from flask import Flask
from flask_cors import CORS
from config import config
from routes import api_blueprint
from services import db, init_db
from flask_restx import Api

app = Flask(__name__)

env = 'development'  # Change to 'production' as needed
app.config.from_object(config[env])

# Initialize Flask-RESTX API
api = Api(app, version='1.0', title='KartTime with Swagger', description='Automatically generated Swagger docs')

CORS(app)

# Initialize the database with the app
init_db(app)

# Register the blueprint
app.register_blueprint(api_blueprint, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
