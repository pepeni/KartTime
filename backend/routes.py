from flask import Blueprint, jsonify, request

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/get_data', methods=['GET'])
def get_data():
    return jsonify({"message": "Data fetched successfully"})

@api_blueprint.route('/post_data', methods=['POST'])
def post_data():
    data = request.json 
    return jsonify({"message": "Data processed successfully", "data": data})
