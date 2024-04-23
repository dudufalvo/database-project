import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask

load_dotenv()  # loads variables from .env file into environment

api = Flask(__name__)
url = os.environ.get("DATABATE_URL")
conn = psycopg2.connect(url)

@api.route("/")
def hello_world():
    
    return "<p>Hello, World!</p>"