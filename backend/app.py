from flask import Flask
from flask_cors import CORS
from config import config
from routes import api_blueprint
from services import db, init_db

app = Flask(__name__)

env = 'development'  # Change to 'production' as needed
app.config.from_object(config[env])

CORS(app)

# Initialize the database with the app
init_db(app)

# Register the blueprint
app.register_blueprint(api_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
