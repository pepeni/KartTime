from services import db
from werkzeug.security import generate_password_hash, check_password_hash

class Test(db.Model):
    __tablename__ = 'test'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return f"<Test {self.name}>"
    
class Track(db.Model):
    __tablename__ = 'track'

    id = db.Column(db.Integer, primary_key=True)
    nazwa = db.Column(db.String(100), nullable=False)
    informacje = db.Column(db.Text, nullable=True)
    inne = db.Column(db.Text, nullable=True)

    # Relacja do tabeli ToryGp
    tory_gp = db.relationship('TrackGp', backref='track', lazy=True)

    def __init__(self, nazwa, informacje=None, inne=None):
        self.nazwa = nazwa
        self.informacje = informacje
        self.inne = inne

    def __repr__(self):
        return f"<Track {self.nazwa}>"

class Gp(db.Model):
    __tablename__ = 'gp'

    id = db.Column(db.Integer, primary_key=True)
    nazwa = db.Column(db.String(100), nullable=False)
    haslo = db.Column(db.String(100), nullable=False)

    # Relacja do tabeli ToryGp
    tory_gp = db.relationship('TrackGp', backref='gp', lazy=True)

    def __init__(self, nazwa, haslo):
        self.nazwa = nazwa
        self.haslo = haslo

    def __repr__(self):
        return f"<Gp {self.nazwa}>"

class TrackGp(db.Model):
    __tablename__ = 'trackgp'

    id = db.Column(db.Integer, primary_key=True)
    tor_id = db.Column(db.Integer, db.ForeignKey('track.id'), nullable=False) 
    gp_id = db.Column(db.Integer, db.ForeignKey('gp.id'), nullable=False)

    def __init__(self, tor_id, gp_id):
        self.tor_id = tor_id
        self.gp_id = gp_id

    def __repr__(self):
        return f"<TrackGp track_id={self.tor_id} gp_id={self.gp_id}>"
    
class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __init__(self, username, password, email):
        self.username = username
        self.password_hash = generate_password_hash(password)
        self.email = email

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"
    

class Wynik(db.Model):
    __tablename__ = 'wyniki'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tor_id = db.Column(db.Integer, db.ForeignKey('track.id'), nullable=False)
    czas = db.Column(db.Float, nullable=False)
    data = db.Column(db.DateTime, nullable=False)

    # Relacje
    user = db.relationship('User', backref='wyniki', lazy=True)
    tor = db.relationship('Track', backref='wyniki', lazy=True)

    def __init__(self, user_id, tor_id, czas, data):
        self.user_id = user_id
        self.tor_id = tor_id
        self.czas = czas
        self.data = data

    def __repr__(self):
        return f"<Wynik user_id={self.user_id} tor_id={self.tor_id} czas={self.czas}>"
