from flask import Blueprint, jsonify, request
from flask_restx import Api, Resource, fields
from models import Test
from services import db

api_blueprint = Blueprint('api', __name__)

# Initialize the API object here
api = Api(api_blueprint)

# Define the input model for the POST request to /add_test
test_model = api.model('Test', {
    'name': fields.String(required=True, description='The name of the test')
})

@api.route('/get_data')
class GetData(Resource):
    def get(self):
        """Get data"""
        return {"message": "Data fetched successfully"}

@api.route('/post_data')
class PostData(Resource):
    def post(self):
        """Post data"""
        data = request.json
        return {"message": "Data processed successfully", "data": data}

@api.route('/add_test')
class AddTest(Resource):
    @api.expect(test_model)
    def post(self):
        """Add a new test"""
        data = request.get_json()

        if not data or 'name' not in data:
            return {"message": "Bad request, 'name' is required"}, 400

        new_test = Test(name=data['name'])
        db.session.add(new_test)
        db.session.commit()

        return {"message": "Test object created successfully", "test": {"id": new_test.id, "name": new_test.name}}, 201

@api.route('/get_tests')
class GetTests(Resource):
    def get(self):
        """Get all tests"""
        tests = Test.query.all()
        result = [{"id": test.id, "name": test.name} for test in tests]
        return {"tests": result}, 200