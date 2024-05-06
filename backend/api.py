import os
import psycopg2
import psycopg2.extras
from functools import wraps
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
  JWTManager, jwt_required, create_access_token, 
  create_refresh_token, get_jwt_identity, decode_token
)
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail
from flask import render_template
import datetime
from email.message import EmailMessage
import ssl
import smtplib

load_dotenv()  # loads variables from .env file into environment

api = Flask(__name__)
api.config["JWT_SECRET_KEY"] = "padel-secret"

CORS(
  api,
  origins=['*'],
  methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  supports_credentials=True
)
jwt = JWTManager(api)
mail = Mail(api)
url = os.environ.get("DATABATE_URL")
conn = psycopg2.connect(url) 

def admin_required(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
    user_id = get_jwt_identity()
    user_role = get_user_role(user_id)
    
    if user_role == 'regular':
      return jsonify({"error": "Admin role required"}), 403
    
    return f(*args, **kwargs)
  return decorated_function

def get_user_role(user_id):
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  db_cur.execute("SELECT role FROM client WHERE id = %s;", (user_id,))
  user = db_cur.fetchone()
  db_cur.close()
  return user['role'] if user else None

@api.route("/")
def hello_world():
  return "<p>Hello, World!</p>"

@api.route("/client/register", methods=["POST"])
def register_user():
  data = request.json['data']
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    db_cur.execute("SELECT * FROM client WHERE email = %s;", (data["email"],))
    user = db_cur.fetchone()

    if user:
      db_cur.close()
      return jsonify({"error": "User already exists"}), 400
    else: 
      print(data["first_name"], data["last_name"], data["password"], data["email"], data["phone_number"], data["nif"], data["role"])
      db_cur.execute("INSERT INTO client (first_name, last_name, password, email, phone_number, nif, role) VALUES (%s, %s, %s, %s, %s, %s, %s);", (data["first_name"], data["last_name"], generate_password_hash(data["password"],"pbkdf2"), data["email"], data["phone_number"], data["nif"], data["role"],))
      conn.commit()

      db_cur.execute("SELECT * FROM client WHERE email = %s;", (data["email"],))
      user = db_cur.fetchone()
      access_token = create_access_token(identity=user[0], additional_claims={"role": user[6]})
      refresh_token = create_refresh_token(identity=user[0], additional_claims={"role": user[6]})
      db_cur.close()

      return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 201
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/client/login", methods=["POST"])
def login_user():
  data = request.json['data']
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    db_cur.execute("SELECT * FROM client WHERE email = %s;", (data["email"],))
    user = db_cur.fetchone()

    if not user:
      db_cur.close()
      return jsonify({"error": "User not found"}), 404
    else:
      if check_password_hash(user["password"], data["password"]):
        access_token = create_access_token(identity=user["id"], additional_claims={"role": user["role"]})
        refresh_token = create_refresh_token(identity=user["id"], additional_claims={"role": user["role"]})
        db_cur.close()
        return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200
      else:
        db_cur.close()
        return jsonify({"error": "Invalid credentials"}), 401
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/client/recover-password", methods=["POST"])
def recover_password():
  url =  "http://localhost:5173/client/reset/"
  data = request.json['data']
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    email = data["email"]
    if not email:
      return jsonify({"error": "Email is required"}), 400

    db_cur.execute("SELECT * FROM client WHERE email = %s;", (data["email"],))
    user = db_cur.fetchone()
    if not user:
      db_cur.close()
      return jsonify({"error": "User not found"}), 404

    expires = datetime.timedelta(hours=24)
    reset_token = create_access_token(user["id"], expires_delta=expires)

    # substitutes the "." in the token for a "%" to avoid problems with the url
    reset_token = reset_token.replace(".", "+")

    email_sender = os.environ.get("EMAIL_USERNAME")
    email_password = os.environ.get("EMAIL_PASSWORD")

    subject = "Padle Time - Reset Password"
    text_body = "You requested to reset your password. Please click on the following link to reset it: " + url + reset_token
    html_body = "<p>You requested to reset your password. Please click on the following link to reset it: <a href='" + url + reset_token + "'>Reset Password</a></p>"
    msg = EmailMessage()
    msg.set_content(text_body)
    msg.add_alternative(html_body, subtype="html")
    msg["Subject"] = subject
    msg["From"] = email_sender
    msg["To"] = user["email"]

    context = ssl.create_default_context()
    
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
      server.login(email_sender, email_password)
      server.sendmail(email_sender, user["email"], msg.as_string())
    
    db_cur.close()
    return jsonify({"reset_token": reset_token}), 200

  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/client/reset-password", methods=["POST"])
def reset_password():
  data = request.json['data']
  print(data)
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    reset_token = data["reset_token"]
    password = data["password"]

    if not reset_token or not password:
      return jsonify({"error": "Reset token and password are required"}), 400

    user_id = decode_token(reset_token)["sub"]
    print(user_id)
    db_cur.execute("SELECT * FROM client WHERE id = %s;", (user_id,))
    user = db_cur.fetchone()

    if not user:
      db_cur.close()
      return jsonify({"error": "User not found"}), 404
    
    db_cur.execute("UPDATE client SET password = %s WHERE id = %s;", (generate_password_hash(password,"pbkdf2"), user_id,))
    conn.commit()
    db_cur.close()
    return jsonify({"message": "Password updated"}), 200

  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/client/logout", methods=["POST"])
def logout_user():
  return jsonify({"message": "User logged out"}), 200

@api.route("/client/refresh", methods=["POST"])
@jwt_required()
def refresh_token():
  access_token = create_access_token(identity=request.json["id"], additional_claims={"role": request.json["role"]})
  refresh_token = create_refresh_token(identity=request.json["id"], additional_claims={"role": request.json["role"]})
  return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200

@api.route("/client", methods=["GET"])
@jwt_required()
def get_client():
  user_id = get_jwt_identity()
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  db_cur.execute("SELECT * FROM client WHERE id = %s;", (user_id,))
  user = db_cur.fetchone()

  if user:
    db_cur.close()
    return jsonify({"user": {"first_name": user['first_name'], "last_name": user['last_name'], "email": user['email'], "phone_number": user['phone_number'], "nif": user['nif'], "role": user['role']}}), 200
  else:
    db_cur.close()
    return jsonify({"error": "User not found"}), 404

@api.route("/clients", methods=["GET"])
@jwt_required()
def get_clients():
  user_id = get_jwt_identity()
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  db_cur.execute("SELECT * FROM client WHERE id = %s;", (user_id,))
  user = db_cur.fetchone()

  if user:
    db_cur.execute("SELECT * FROM client;")
    users = db_cur.fetchall()
    db_cur.close()

    formated_users = []
    for user in users:
      formated_users.append({"first_name": user['first_name'], "last_name": user['last_name'], "email": user['email'], "phone_number": user['phone_number'], "nif": user['nif'], "role": user['role']})
    return jsonify(formated_users), 200
  else:
    db_cur.close()
    return jsonify({"error": "User not found"}), 404

@api.route("/client/admin", methods=["POST"])
@jwt_required()
@admin_required
def turn_client_into_admin():
  data = request.json['data']
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    db_cur.execute("SELECT * FROM client WHERE email = %s;", (data["email"],))
    user = db_cur.fetchone()
    print(user['id'])

    if not user:
      db_cur.close()
      return jsonify({"error": "User not found"}), 404
    else:
      db_cur.execute("SELECT change_role_to_admin({});".format((user["id"]),))
      db_cur.close()
      return jsonify({"message": "User turned into admin"}), 200
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/client/regular", methods=["POST"])
@jwt_required()
@admin_required
def turn_admin_into_client():
  data = request.json['data']
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    db_cur.execute("SELECT * FROM client WHERE email = %s;", (data["email"],))
    user = db_cur.fetchone()

    if not user:
      db_cur.close()
      return jsonify({"error": "User not found"}), 404
    else:
      db_cur.execute("SELECT change_role_to_regular({});".format((user["id"]),))
      db_cur.close()
      return jsonify({"message": "Admin turned into regular"}), 200
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500