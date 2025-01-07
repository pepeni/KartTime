from flask_sqlalchemy import SQLAlchemy
import jwt
from functools import wraps
from flask import request, jsonify


db = SQLAlchemy()


def init_db(app):
    db.init_app(app)
    with app.app_context():
        try:
            db.create_all()
            print("Tables created successfully!")
        except Exception as e:
            print(f"Error: {e}")



SECRET_KEY = "default_secret_key"
ALGORITHM = "HS256"
TOKEN_EXPIRES_HOURS = 1

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"message": "Token jest wymagany!"}), 401

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            request.user_id = decoded['identity']
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token wygasł!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Nieprawidłowy token!"}), 401

        return f(*args, **kwargs)
    return decorated
