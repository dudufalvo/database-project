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
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    reset_token = data["reset_token"]
    password = data["password"]

    if not reset_token or not password:
      return jsonify({"error": "Reset token and password are required"}), 400

    user_id = decode_token(reset_token)["sub"]
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

@api.route("/client/password", methods=["PUT"])
@jwt_required()
def update_password():
  data = request.json['data']
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    user_id = get_jwt_identity()
    db_cur.execute("SELECT * FROM client WHERE id = %s;", (user_id,))
    user = db_cur.fetchone()

    if not user:
      db_cur.close()
      return jsonify({"error": "User not found"}), 404
    else:
      if check_password_hash(user["password"], data["current_password"]):
        db_cur.execute("UPDATE client SET password = %s WHERE id = %s;", (generate_password_hash(data["password"],"pbkdf2"), user_id,))
        conn.commit()
        db_cur.close()
        return jsonify({"message": "Password updated"}), 200
      else:
        db_cur.close()
        return jsonify({"error": "Invalid credentials"}), 401

  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/client/delete", methods=["POST"])
@jwt_required()
def delete_user():
  data = request.json['data']
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

  try:
    user_id = get_jwt_identity()
    db_cur.execute("SELECT * FROM client WHERE id = %s;", (user_id,))
    user = db_cur.fetchone()

    if not user:
      db_cur.close()
      return jsonify({"error": "User not found"}), 404
    else:
      if check_password_hash(user["password"], data["password"]):
        db_cur.execute("DELETE FROM client WHERE id = %s;", (user_id,))
        conn.commit()
        db_cur.close()
        return jsonify({"message": "User deleted"}), 200
      else:
        db_cur.close()
        return jsonify({"error": "Invalid credentials"}), 401

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

@api.route("/client", methods=["GET", "PUT"])
@jwt_required()
def get_client():
  user_id = get_jwt_identity()
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

  if request.method == "GET":
    db_cur.execute("SELECT * FROM client WHERE id = %s;", (user_id,))
    user = db_cur.fetchone()

    if user:
      db_cur.close()
      return jsonify({"user": {"first_name": user['first_name'], "last_name": user['last_name'], "email": user['email'], "phone_number": user['phone_number'], "nif": user['nif'], "role": user['role']}}), 200
    else:
      db_cur.close()
      return jsonify({"error": "User not found"}), 404

  if request.method == "PUT":
    db_cur.execute("SELECT * FROM client WHERE id = %s;", (user_id,))
    user = db_cur.fetchone()

    if user:
      data = request.json['data']
      db_cur.execute("UPDATE client SET first_name = %s, last_name = %s, email = %s, phone_number = %s WHERE id = %s;", (data["first_name"], data["last_name"], data["email"], data["phone_number"], user_id,))
      conn.commit()
      db_cur.close()
      return jsonify({"message": "User updated"}), 200
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

@api.route("/client/delete", methods=["DELETE"])
@jwt_required()
def delete_client():
  user_id = get_jwt_identity()
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

  try:
    db_cur.execute("SELECT * FROM client WHERE id = %s;", (user_id,))
    user = db_cur.fetchone()

    if not user:
      db_cur.close()
      return jsonify({"error": "User not found"}), 404
    else:
      db_cur.execute("DELETE FROM client WHERE id = %s;", (user_id,))
      conn.commit()
      db_cur.close()
      return jsonify({"message": "User deleted"}), 200

  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/manual-notification/create", methods=["POST"])
@jwt_required()
@admin_required
def create_manual_notification():
  sender_user_id = get_jwt_identity()
  data = request.json['data']
  if "," in data["email"]:
    list_receivers_email = data["email"].replace(" ", "").split(",")
  else:
    list_receivers_email = [data["email"]]
  message = data["message"]
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

  for receiver_email in list_receivers_email:
    if receiver_email == "all.clients@gmail.com":
      try:
        db_cur.execute("SELECT * FROM client;")
        users = db_cur.fetchall()

        for user in users:
          if user["id"] != sender_user_id:
            db_cur.execute("INSERT INTO manual_notification (client_id, notification_client_id, notification_message, notification_is_read) VALUES (%s, %s, %s, %s);", (sender_user_id, user["id"], message, False,))
        conn.commit()
        return jsonify({"message": "Notification created"}), 201
      except Exception as e:
        conn.rollback()
        db_cur.close()
        return jsonify({"error": str(e)}), 500
    else:
      try:
        db_cur.execute("SELECT * FROM client WHERE email = %s;", (receiver_email,))
        user = db_cur.fetchone()

        if not user:
          db_cur.close()
          return jsonify({"error": "User not found"}), 404
        else:
          db_cur.execute("INSERT INTO manual_notification (client_id, notification_client_id, notification_message, notification_is_read) VALUES (%s, %s, %s, %s);", (sender_user_id, user["id"], message, False,))
          conn.commit()
          return jsonify({"message": "Notification created"}), 201
      except Exception as e:
        conn.rollback()
        db_cur.close()
        return jsonify({"error": str(e)}), 500

@api.route("/manual-notification", methods=["GET"])
@jwt_required()
def get_manual_notifications():
  user_id = get_jwt_identity()
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    db_cur.execute("SELECT * FROM manual_notification WHERE notification_client_id = %s or client_id = %s;", (user_id, user_id,))
    notifications = db_cur.fetchall()

    formated_notifications = []
    for notification in notifications:
      # get the sender name
      db_cur.execute("SELECT * FROM client WHERE id = %s;", (notification['client_id'],))
      sender = db_cur.fetchone()

      # get the receiver name
      db_cur.execute("SELECT * FROM client WHERE id = %s;", (notification['notification_client_id'],))
      receiver = db_cur.fetchone()

      formated_notifications.append({"notification_id": notification['notification_id'], "sender": sender['first_name'] + " " + sender['last_name'], "sender_email": sender["email"], "receiver": receiver['first_name'] + " " + receiver['last_name'], "receiver_email": receiver["email"], "message": notification['notification_message'], "is_read": notification['notification_is_read']})
    db_cur.close()
    return jsonify(formated_notifications), 200
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/manual-notification/<int:notification_id>/read", methods=["PUT"])
@jwt_required()
def update_manual_notification(notification_id):
  user_id = get_jwt_identity()
  data = request.json['data']
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    db_cur.execute("SELECT * FROM manual_notification WHERE notification_id = %s;", (notification_id,))
    notification = db_cur.fetchone()

    if not notification:
      db_cur.close()
      return jsonify({"error": "Notification not found"}), 404
    else:
      if user_id == notification["notification_client_id"]:
        db_cur.execute("UPDATE manual_notification SET notification_is_read = %s WHERE notification_id = %s;", (data["is_read"], notification_id,))
        conn.commit()
        db_cur.close()
        return jsonify({"message": "Notification updated"}), 200
      else:
        db_cur.close()
        return jsonify({"error": "Unauthorized"}), 403
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/fields/create", methods=["POST"])
@jwt_required()
@admin_required
def create_field():
  data = request.json['data']
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    db_cur.execute("INSERT INTO fields (name, available) VALUES (%s, %s);", (data["name"], data["available"],))
    conn.commit()
    db_cur.close()
    return jsonify({"message": "Field created"}), 201
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/fields", methods=["GET"])
@jwt_required()
def get_fields():
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

  try:
    db_cur.execute("SELECT * FROM fields;")
    fields = db_cur.fetchall()

    formated_fields = []
    for field in fields:
      formated_fields.append({"field_id": field['id'], "name": field['name'], "available": field['available']})
    db_cur.close()
    return jsonify(formated_fields), 200
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/fields/<int:field_id>", methods=["GET"])
@jwt_required()
def get_field(field_id):
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    db_cur.execute("SELECT * FROM fields WHERE id = %s;", (field_id,))
    field = db_cur.fetchone()

    if field:
      db_cur.close()
      return jsonify({"field_id": field['id'], "name": field['name'], "available": field['available']}), 200
    else:
      db_cur.close()
      return jsonify({"error": "Field not found"}), 404
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/fields/<int:field_id>/update", methods=["PUT"])
@jwt_required()
@admin_required
def update_field(field_id):
  data = request.json['data']
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    db_cur.execute("SELECT * FROM fields WHERE id = %s;", (field_id,))
    field = db_cur.fetchone()

    if not field:
      db_cur.close()
      return jsonify({"error": "Field not found"}), 404
    else:
      db_cur.execute("UPDATE fields SET name = %s, available = %s WHERE id = %s;", (data["name"], data["available"], field_id,))
      conn.commit()
      db_cur.close()
      return jsonify({"message": "Field updated"}), 200
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/fields/<int:field_id>/delete", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_field(field_id):
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    db_cur.execute("SELECT * FROM fields WHERE id = %s;", (field_id,))
    field = db_cur.fetchone()

    if not field:
      db_cur.close()
      return jsonify({"error": "Field not found"}), 404
    else:
      db_cur.execute("DELETE FROM fields WHERE id = %s;", (field_id,))
      conn.commit()
      db_cur.close()
      return jsonify({"message": "Field deleted"}), 200
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/prices/create", methods=["POST"])
@jwt_required()
@admin_required
def create_price():
  data = request.json['data']
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
  
  try:
    db_cur.execute("INSERT INTO price (price_value, price_type) VALUES (%s, %s);", (data["price_value"], data["price_type"],))
    conn.commit()
    db_cur.close()
    return jsonify({"message": "Price created"}), 201
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500

@api.route("/prices", methods=["GET"])
@jwt_required()
def get_prices():
  db_cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

  try:
    db_cur.execute("SELECT * FROM price;")
    prices = db_cur.fetchall()

    formated_prices = []
    for price in prices:
      formated_prices.append({"price_id": price['id'], "price_value": price['price_value'], "price_type": price['price_type'], "start_time": price['start_time'], "is_active": price['is_active']})
    db_cur.close()
    return jsonify(formated_prices), 200
  except Exception as e:
    conn.rollback()
    db_cur.close()
    return jsonify({"error": str(e)}), 500  
