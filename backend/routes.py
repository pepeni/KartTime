from flask import Blueprint, request
from flask_restx import Api, Resource, fields
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import random
import string
from datetime import timedelta, datetime, timezone
from models import GP, GPTimes, Times, Track, User, UserGP
from services import db, token_required

authorizations = {
    'JWT Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization',
        'description': 'Bearer <JWT_Token>'
    }
}

api_blueprint = Blueprint('api', __name__)
api = Api(api_blueprint, title="KartTime API", version="1.0", description="API for KartTime application", authorizations=authorizations)

user_registration_model = api.model('UserRegistration', {
    'name': fields.String(required=True, description="User name"),
    'password': fields.String(required=True, description="User password")
})

user_login_model = api.model('UserLogin', {
    'name': fields.String(required=True, description="User name"),
    'password': fields.String(required=True, description="User password")
})

track_model = api.model('Track', {
    'id': fields.Integer(description='ID toru'),
    'track_name': fields.String(description='Nazwa toru'),
    'address': fields.String(description='Adres toru'),
    'phone_number': fields.String(description='Numer telefonu'),
    'opening_hours': fields.String(description='Godziny otwarcia'),
    'url': fields.String(description='Strona toru')
})

lap_time_model = api.model('LapTime', {
    'user_id': fields.Integer(description='ID usera'),
    'track_id': fields.Integer(required=True, description='ID toru'),
    'lap_time': fields.String(required=True, description='Czas okrążenia w formacie MM:SS.sss')
})

create_gp_model = api.model('CreateGP', {
    'user_id': fields.Integer(description='ID usera'),
    'name': fields.String(required=True, description='Nazwa GP'),
    'track_id': fields.Integer(required=True, description='ID toru')
})

join_gp_model = api.model('JoinGP', {
    'user_id': fields.Integer(description='ID usera'),
    'gp_code': fields.String(required=True)
})

gp_time_model = api.model('GPTime', {
    'user_id': fields.Integer(description='ID usera'),
    'gp_id': fields.Integer(required=True, description='ID Grand Prix'),
    'lap_time': fields.String(required=True, description='Czas okrążenia w formacie MM:SS.sss'),
    'standing': fields.Integer(required=True, description='Pozycja w wyścigu (miejsce na podium)')
})


auth_ns = api.namespace('auth', description='Authentication operations')
tracks_ns = api.namespace('tracks', description='Operations related to tracks')
gp_ns = api.namespace('gp', description='Operations related to gp')

SECRET_KEY = "default_secret_key"
ALGORITHM = "HS256"
TOKEN_EXPIRES_HOURS = 1

@auth_ns.route('/register')
class Register(Resource):
    @api.expect(user_registration_model)
    def post(self):
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')

        if not name or not password:
            return {"message": "Nazwa użytkownika i hasło są wymagane."}, 400

        if User.query.filter_by(name=name).first():
            return {"message": "Użytkownik o podanej nazwie już istnieje."}, 409

        hashed_password = generate_password_hash(password)
        new_user = User(name=name, pwd_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return {"message": "Rejestracja zakończona sukcesem."}, 201


@auth_ns.route('/login')
class Login(Resource):
    @api.expect(user_login_model)
    def post(self):
        data = request.get_json()
        name = data.get('name')
        password = data.get('password')

        if not name or not password:
            return {"message": "Nazwa użytkownika i hasło są wymagane."}, 400

        user = User.query.filter_by(name=name).first()
        if not user or not check_password_hash(user.pwd_hash, password):
            return {"message": "Nieprawidłowa nazwa użytkownika lub hasło."}, 401
        
        payload = {
            "identity": user.id,
            "exp": datetime.now(timezone.utc) + timedelta(hours=1),
            "iat": datetime.now(timezone.utc)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

        return {"message": "Logged in successfully.", "access_token": token, "user_id": user.id}, 200
    

@auth_ns.route('/whoami/<int:user_id>')
class WhoAmI(Resource):
    # @api.doc(security='JWT Auth')
    # @token_required
    def get(self, user_id):
        user = User.query.filter_by(id=user_id).first()
        if user:
            return {'message': 'User found', 'name': user.name}
        else:
            return {'message': 'User not found'}, 404
        
@tracks_ns.route('/user/<int:user_id>/best-times')
class UserBestLapTimes(Resource):
    # @api.doc(security='JWT Auth')
    # @token_required
    def get(self, user_id):
        best_times = (
            db.session.query(
                Times.track_id,
                Track.track_name,
                db.func.min(Times.lap_time).label("best_lap_time"),
                db.func.min(Times.lap_date).label("lap_date")
            )
            .join(Track, Times.track_id == Track.id)
            .filter(Times.user_id == user_id)
            .group_by(Times.track_id, Track.track_name)
            .all()
        )

        if not best_times:
            return {"message": "Brak najlepszych czasów dla tego użytkownika."}, 404

        return [
            {
                "track_id": best_time.track_id,
                "track_name": best_time.track_name,
                "lap_time": f"{best_time.best_lap_time.minute:02}:{best_time.best_lap_time.second:02}.{int(best_time.best_lap_time.microsecond / 1000):03}",
                "lap_date": best_time.lap_date.strftime('%Y-%m-%d')
            }
            for best_time in best_times
        ], 200
    
@tracks_ns.route('/')
class TracksList(Resource):
    # @api.doc(security='JWT Auth')
    @api.marshal_list_with(track_model)
    # @token_required
    def get(self):
        tracks = Track.query.all()
        return tracks


@tracks_ns.route('/<int:track_id>')
class TrackDetail(Resource):
    # @api.doc(security='JWT Auth')
    
    @api.marshal_with(track_model)
    def get(self, track_id):
        track = Track.query.get(track_id)
        if not track:
            api.abort(404, "Tor o podanym ID nie istnieje")
        return track


@tracks_ns.route('/add_time')
class AddLapTime(Resource):
    # @api.doc(security='JWT Auth') 
    @api.expect(lap_time_model)
    # @token_required
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        track_id = data.get('track_id')
        lap_time = data.get('lap_time')

        if not track_id or not lap_time:
            return {"message": "ID toru i czas okrążenia są wymagane!"}, 400

        track = Track.query.get(track_id)
        if not track:
            return {"message": "Podany tor nie istnieje!"}, 404

        try:
            minutes, seconds = map(float, lap_time.split(':'))
            total_seconds = minutes * 60 + seconds
            lap_time = (datetime.fromtimestamp(total_seconds, tz=timezone.utc)).time()
        except ValueError:
            return {"message": "Nieprawidłowy format czasu okrążenia. Użyj MM:SS.SSS."}, 400

        lap_date = datetime.now(timezone.utc).replace(tzinfo=None)

        new_time = Times(
            user_id=user_id,
            track_id=track_id,
            lap_time=lap_time,
            lap_date=lap_date
        )
        db.session.add(new_time)
        db.session.commit()

        return {"message": "Czas dodany pomyślnie!"}, 201
    

@tracks_ns.route('/times/<int:user_id>')
class UserLapTimes(Resource):
    # @api.doc(security='JWT Auth')
    # @token_required
    def get(self, user_id):
        times = Times.query.filter_by(user_id=user_id).all()

        if not times:
            return {"message": "Brak wyników dla tego użytkownika."}, 404

        return [{
            "track_id": time.track_id,
            "lap_time": f"{time.lap_time.minute:02}:{time.lap_time.second:02}.{int(time.lap_time.microsecond / 1000):03}",
            "lap_date": time.lap_date.strftime('%Y-%m-%d %H:%M:%S')
        } for time in times], 200
    

@tracks_ns.route('/<int:track_id>/times')
class TrackLapTimes(Resource):
    # @api.doc(security='JWT Auth')
    # @token_required
    def get(self, track_id):
        track = Track.query.get(track_id)
        if not track:
            return {"message": "Podany tor nie istnieje!"}, 404

        times = (
            db.session.query(Times, User)
            .join(User)
            .filter(Times.track_id == track_id)
            .order_by(Times.lap_time.asc())
            .all()
        )

        if not times:
            return {"message": "Brak czasów dla tego toru."}, 404

        return [{
            "id": time.Times.id,
            "user_id": time.Times.user_id,
            "user_name": time.User.name,
            "lap_time": f"{time.Times.lap_time.minute:02}:{time.Times.lap_time.second:02}.{int(time.Times.lap_time.microsecond / 1000):03}",
            "lap_date": time.Times.lap_date.strftime('%Y-%m-%d')
        } for time in times], 200
    

@gp_ns.route('/create')
class CreateGP(Resource):
    # @api.doc(security='JWT Auth')
    @api.expect(create_gp_model)
    # @token_required
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        name = data.get('name')
        track_id = data.get('track_id')

        if not name:
            return {"message": "Nazwa GP jest wymagana!"}, 400
        
        track = Track.query.get(track_id)
        if not track:
            return {"message": "Podany tor nie istnieje!"}, 404

        gp_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

        new_gp = GP(name=name, gp_code=gp_code, track_id=track_id)
        db.session.add(new_gp)
        db.session.commit()

        user_gp = UserGP(user_id=user_id, gp_id=new_gp.id)
        db.session.add(user_gp)
        db.session.commit()

        return {
            "message": "GP utworzone pomyślnie!",
            "gp_id": new_gp.id,
            "name": new_gp.name,
            "gp_code": new_gp.gp_code,
            "track_name": track.track_name
        }, 201
    

@gp_ns.route('/join')
class JoinGP(Resource):
    # @api.doc(security='JWT Auth')
    @api.expect(join_gp_model)
    # @token_required
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        gp_code = data.get('gp_code')

        if not gp_code:
            return {"message": "Kod zapisu jest wymagany!"}, 400

        gp = GP.query.filter_by(gp_code=gp_code).first()
        if not gp:
            return {"message": "Nieprawidłowy kod zapisu!"}, 404

        existing_member = UserGP.query.filter_by(user_id=user_id, gp_id=gp.id).first()
        if existing_member:
            return {"message": "Jesteś już członkiem tego GP!"}, 400

        user_gp = UserGP(user_id=user_id, gp_id=gp.id)
        db.session.add(user_gp)
        db.session.commit()

        return {"message": f"Dołączono do GP '{gp.name}' pomyślnie!"}, 200
    

@gp_ns.route('/<int:gp_id>/participants')
class GPParticipants(Resource):
    # @api.doc(security='JWT Auth')
    # @token_required
    def get(self, gp_id):
        gp = GP.query.get(gp_id)
        if not gp:
            return {"message": "GP nie istnieje!"}, 404

        participants = db.session.query(User).join(UserGP).filter(UserGP.gp_id == gp_id).all()

        if not participants:
            return {"message": "Brak uczestników w tym GP."}, 404
        
        track = Track.query.get(gp.track_id)

        return {
            "gp_id": gp.id,
            "name": gp.name, 
            "gp_code": gp.gp_code,
            "track_id": gp.track_id,
            "track_name": track.track_name,
            "participants": 
                [{"id": user.id, "name": user.name} for user in participants]
        }, 200
    
@gp_ns.route('/add_time')
class AddGPTime(Resource):
    # @api.doc(security='JWT Auth')
    @api.expect(gp_time_model)
    # @token_required
    def post(self):
        data = request.get_json()
        user_id = data.get('user_id')
        gp_id = data.get('gp_id')
        lap_time = data.get('lap_time')
        standing = data.get('standing')

        if not gp_id or not lap_time or standing is None:
            return {"message": "ID GP, czas okrążenia i pozycja są wymagane!"}, 400

        gp = GP.query.get(gp_id)
        if not gp:
            return {"message": "Podane GP nie istnieje!"}, 404

        try:
            minutes, seconds = map(float, lap_time.split(':'))
            total_seconds = minutes * 60 + seconds
            lap_time = (datetime.fromtimestamp(total_seconds, tz=timezone.utc)).time()
        except ValueError:
            return {"message": "Nieprawidłowy format czasu okrążenia. Użyj MM:SS.SSS."}, 400

        lap_date = datetime.now(timezone.utc).replace(tzinfo=None)

        new_gp_time = GPTimes(
            user_id=user_id,
            gp_id=gp_id,
            standing=standing,
            lap_time=lap_time,
            lap_date=lap_date
        )
        db.session.add(new_gp_time)
        db.session.commit()

        return {"message": "Czas dodany do GP pomyślnie!"}, 201
    
@gp_ns.route('/<int:gp_id>/times')
class GPTimesList(Resource):
    # @api.doc(security='JWT Auth')
    # @token_required
    def get(self, gp_id):
        gp = GP.query.get(gp_id)
        if not gp:
            return {"message": "GP nie istnieje!"}, 404

        times = db.session.query(GPTimes, User).join(User).filter(GPTimes.gp_id == gp_id).all()

        if not times:
            return {"message": "Brak czasów dla tego GP."}, 404

        return [{
            "id": time.GPTimes.id,
            "user_id": time.GPTimes.user_id,
            "user_name": time.User.name,
            "standing": time.GPTimes.standing,
            "lap_time": f"{time.GPTimes.lap_time.minute:02}:{time.GPTimes.lap_time.second:02}.{int(time.GPTimes.lap_time.microsecond / 1000):03}",
            "lap_date": time.GPTimes.lap_date.strftime('%Y-%m-%d')
        } for time in times], 200
    
@gp_ns.route('/user/<int:user_id>/gplist')
class UserGPList(Resource):
    # @api.doc(security='JWT Auth')
    # @token_required
    def get(self, user_id):
        gps = db.session.query(GP).join(UserGP).filter(UserGP.user_id == user_id).all()

        if not gps:
            return {"message": "Brak Grand Prix dla tego użytkownika."}, 404

        return [{
            "gp_id": gp.id,
            "name": gp.name,
            "gp_code": gp.gp_code,
            "track_id": gp.track_id,
            "track_name": gp.tracks.track_name
        } for gp in gps], 200



api.add_namespace(auth_ns)
api.add_namespace(tracks_ns)
api.add_namespace(gp_ns)
