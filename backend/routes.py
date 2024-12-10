from flask import Blueprint, jsonify, request
from flask_restx import Api, Resource, fields
from models import Test, Tor, Gp, ToryGp, User, Wynik
from services import db
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash

api_blueprint = Blueprint('api', __name__)

# Dodanie opisu schematu autoryzacji
authorizations = {
    'Bearer Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': 'Add "Bearer <JWT Token>"'
    }
}

# Initialize the API object here
api = Api(api_blueprint, authorizations=authorizations)

# Define the input model for the POST request to /add_test
test_model = api.model('Test', {
    'name': fields.String(required=True, description='The name of the test')
})
user_model = api.model('User', {
    'username': fields.String(required=True, description='Username of the user'),
    'password': fields.String(required=True, description='Password of the user'),
    'email': fields.String(required=True, description='Email of the user')
})

login_model = api.model('Login', {
    'username': fields.String(required=True, description='Username of the user'),
    'password': fields.String(required=True, description='Password of the user')
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
        """Pobierz wszystkie tory lub filtruj po nazwie"""
        nazwa = request.args.get('nazwa', None)
        if nazwa:
            tor_list = Tor.query.filter(Tor.nazwa.ilike(f"%{nazwa}%")).all()
        else:
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

@api.route('/tory/<int:id>')
class TorById(Resource):
    @api.expect(tor_model)
    def put(self, id):
        """Update an existing tor"""
        tor = Tor.query.get(id)
        if tor is None:
            return {"message": "Tor not found"}, 404
        
        data = request.get_json()
        tor.nazwa = data.get('nazwa', tor.nazwa)
        tor.informacje = data.get('informacje', tor.informacje)
        tor.inne = data.get('inne', tor.inne)

        db.session.commit()

        return {"message": "Tor updated successfully", "tor": {"id": tor.id, "nazwa": tor.nazwa}}, 200


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

@api.route('/gp/<int:id>')
class GpById(Resource):
    @api.expect(gp_model)
    def put(self, id):
        """Update an existing GP"""
        gp = Gp.query.get(id)
        if gp is None:
            return {"message": "Gp not found"}, 404
        
        data = request.get_json()
        gp.nazwa = data.get('nazwa', gp.nazwa)
        gp.haslo = data.get('haslo', gp.haslo)

        db.session.commit()

        return {"message": "Gp updated successfully", "gp": {"id": gp.id, "nazwa": gp.nazwa}}, 200

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
    
    @api.route('/torygp/<int:id>')
    class ToryGpById(Resource):
        @api.expect(torygp_model)
        def put(self, id):
            """Update an existing tory-gp relation"""
            torygp = ToryGp.query.get(id)
            if torygp is None:
                return {"message": "ToryGp not found"}, 404
            
            data = request.get_json()
            torygp.tor_id = data.get('tor_id', torygp.tor_id)
            torygp.gp_id = data.get('gp_id', torygp.gp_id)

            db.session.commit()

            return {"message": "ToryGp updated successfully", "torygp": {"id": torygp.id, "tor_id": torygp.tor_id, "gp_id": torygp.gp_id}}, 200


# User-related routes
@api.route('/register')
class Register(Resource):
    @api.expect(user_model)
    def post(self):
        """Register a new user"""
        data = request.get_json()

        if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first():
            return {"message": "Username or email already exists"}, 400

        new_user = User(username=data['username'], password=data['password'], email=data['email'])
        db.session.add(new_user)
        db.session.commit()

        return {"message": "User registered successfully"}, 201


@api.route('/login')
class Login(Resource):
    @api.expect(login_model)
    def post(self):
        """Log in a user"""
        data = request.get_json()

        if not data.get('username') or not data.get('password'):
            return {"message": "Username and password are required"}, 400

        user = User.query.filter_by(username=data['username']).first()

        if user and user.verify_password(data['password']):
            token = create_access_token(identity=str(user.id))
            return {"message": "Login successful", "access_token": token}, 200

        return {"message": "Invalid credentials"}, 401


@api.route('/profile')
class UserProfile(Resource):
    @jwt_required()
    @api.doc(security='Bearer Auth')
    def get(self):
        """Get user profile"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {"message": "User not found"}, 404

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }, 200

    @jwt_required()
    @api.expect(user_model)
    def put(self):
        """Update user profile"""
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {"message": "User not found"}, 404

        data = request.get_json()
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)

        if 'password' in data:
            user.password_hash = generate_password_hash(data['password'])

        db.session.commit()
        return {"message": "Profile updated successfully"}, 200
    
wynik_model = api.model('Wynik', {
    'id': fields.Integer(readonly=True, description='ID wyniku'),
    'user_id': fields.Integer(required=True, description='ID użytkownika'),
    'tor_id': fields.Integer(required=True, description='ID toru'),
    'czas': fields.Float(required=True, description='Czas użytkownika na torze'),
    'data': fields.String(required=True, description='Data wyniku (ISO format)')
})

@api.route('/wyniki')
class Wyniki(Resource):
    @api.marshal_list_with(wynik_model)
    def get(self):
        """Pobierz wszystkie wyniki"""
        wyniki = Wynik.query.all()
        return wyniki, 200

    @api.expect(wynik_model)
    @jwt_required()
    @api.doc(security='Bearer Auth')
    def post(self):
        """Dodaj nowy wynik"""
        data = request.get_json()
        user_id = get_jwt_identity()

        if 'tor_id' not in data or 'czas' not in data or 'data' not in data:
            return {"message": "Bad request, required fields: 'tor_id', 'czas', 'data'"}, 400

        wynik = Wynik(
            user_id=user_id,
            tor_id=data['tor_id'],
            czas=data['czas'],
            data=data['data']
        )
        db.session.add(wynik)
        db.session.commit()

        return {"message": "Wynik dodany pomyślnie", "wynik": {"id": wynik.id}}, 201

@api.route('/wyniki/<int:id>')
class WynikById(Resource):
    def get(self, id):
        """Pobierz wynik po ID"""
        wynik = Wynik.query.get(id)
        if wynik is None:
            return {"message": "Wynik nie znaleziony"}, 404
        return {"id": wynik.id, "user_id": wynik.user_id, "tor_id": wynik.tor_id, "czas": wynik.czas, "data": wynik.data}, 200

    @jwt_required()
    def delete(self, id):
        """Usuń wynik"""
        wynik = Wynik.query.get(id)
        if wynik is None:
            return {"message": "Wynik nie znaleziony"}, 404

        db.session.delete(wynik)
        db.session.commit()

        return {"message": "Wynik usunięty pomyślnie"}, 200