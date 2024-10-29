from flask import Flask
from flask_cors import CORS
from .routes import api_blueprint 

app = Flask(__name__)
CORS(app)  

# Register the blueprint
app.register_blueprint(api_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
