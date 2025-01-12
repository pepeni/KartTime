from flask import Flask
from flask_cors import CORS
from config import config
from routes import api_blueprint
from services import init_db
import logging

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True, withCredentials=True)

env = 'development'
app.config.from_object(config[env])

app.register_blueprint(api_blueprint, url_prefix='/api')

init_db(app)

logging.basicConfig(level=logging.DEBUG)

app.logger.setLevel(logging.INFO)
app.debug = True


if __name__ == '__main__':
    app.run(debug=True)
