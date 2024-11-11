from flask import Blueprint, jsonify, request
from models import Test
from services import db

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/get_data', methods=['GET'])
def get_data():
    return jsonify({"message": "Data fetched successfully"})

@api_blueprint.route('/post_data', methods=['POST'])
def post_data():
    data = request.json 
    return jsonify({"message": "Data processed successfully", "data": data})

@api_blueprint.route('/add_test', methods=['POST'])
def add_test():
    data = request.get_json()

    if not data or 'name' not in data:
        return jsonify({"message": "Bad request, 'name' is required"}), 400

    new_test = Test(name=data['name'])

    db.session.add(new_test)
    db.session.commit()

    return jsonify({"message": "Test object created successfully", "test": {"id": new_test.id, "name": new_test.name}}), 201

@api_blueprint.route('/get_tests', methods=['GET'])
def get_tests():
    tests = Test.query.all() 
    result = [{"id": test.id, "name": test.name} for test in tests]

    return jsonify({"tests": result}), 200