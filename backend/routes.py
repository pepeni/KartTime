from flask import Blueprint, jsonify, request
from flask_restx import Api, Resource, fields
from models import Test, Tor, Gp, ToryGp
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
    
########
# Model dla Toru
tor_model = api.model('Tor', {
    'id': fields.Integer(readonly=True, description='ID toru'),
    'nazwa': fields.String(required=True, description='Nazwa toru'),
    'informacje': fields.String(description='Informacje o torze'),
    'inne': fields.String(description='Inne informacje o torze')
})

# Model dla Gp
gp_model = api.model('Gp', {
    'id': fields.Integer(readonly=True, description='ID GP'),
    'nazwa': fields.String(required=True, description='Nazwa GP'),
    'haslo': fields.String(required=True, description='Hasło GP')
})

# Model dla ToryGp
torygp_model = api.model('ToryGp', {
    'id': fields.Integer(readonly=True, description='ID relacji tor-gp'),
    'tor_id': fields.Integer(required=True, description='ID toru'),
    'gp_id': fields.Integer(required=True, description='ID GP')
})

# Endpoint dla wszystkich torów
@api.route('/tory')
class Tories(Resource):
    @api.marshal_list_with(tor_model)
    def get(self):
        """Get all tor entries"""
        tor_list = Tor.query.all()
        return tor_list, 200

    @api.expect(tor_model)
    def post(self):
        """Add a new tor"""
        data = request.get_json()
        if 'nazwa' not in data:
            return {"message": "Bad request, 'nazwa' is required"}, 400

        new_tor = Tor(nazwa=data['nazwa'], informacje=data.get('informacje'), inne=data.get('inne'))
        db.session.add(new_tor)
        db.session.commit()

        return {"message": "Tor created successfully", "tor": {"id": new_tor.id, "nazwa": new_tor.nazwa}}, 201

# Endpoint dla wszystkich GP
@api.route('/gp')
class Gps(Resource):
    @api.marshal_list_with(gp_model)
    def get(self):
        """Get all gp entries"""
        gp_list = Gp.query.all()
        return gp_list, 200

    @api.expect(gp_model)
    def post(self):
        """Add a new GP"""
        data = request.get_json()
        if 'nazwa' not in data or 'haslo' not in data:
            return {"message": "Bad request, 'nazwa' and 'haslo' are required"}, 400

        new_gp = Gp(nazwa=data['nazwa'], haslo=data['haslo'])
        db.session.add(new_gp)
        db.session.commit()

        return {"message": "Gp created successfully", "gp": {"id": new_gp.id, "nazwa": new_gp.nazwa}}, 201

# Endpoint dla wszystkich relacji Tory-GP
@api.route('/torygp')
class ToryGps(Resource):
    @api.marshal_list_with(torygp_model)
    def get(self):
        """Get all tory-gp entries"""
        torygp_list = ToryGp.query.all()
        return torygp_list, 200

    @api.expect(torygp_model)
    def post(self):
        """Add a new tory-gp relation"""
        data = request.get_json()
        if 'tor_id' not in data or 'gp_id' not in data:
            return {"message": "Bad request, 'tor_id' and 'gp_id' are required"}, 400

        new_torygp = ToryGp(tor_id=data['tor_id'], gp_id=data['gp_id'])
        db.session.add(new_torygp)
        db.session.commit()

        return {"message": "ToryGp created successfully", "torygp": {"id": new_torygp.id, "tor_id": new_torygp.tor_id, "gp_id": new_torygp.gp_id}}, 201