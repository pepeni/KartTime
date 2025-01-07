from services import db
from datetime import datetime, timezone


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    pwd_hash = db.Column(db.String(255), nullable=False)

    times = db.relationship('Times', backref='users', lazy=True)
    gptimes = db.relationship('GPTimes', backref='users', lazy=True)
    user_gps = db.relationship('UserGP', backref='users', lazy=True)


class Track(db.Model):
    __tablename__ = 'tracks'
    id = db.Column(db.Integer, primary_key=True)
    track_name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(12), nullable=True)
    opening_hours = db.Column(db.String(200), nullable=True)
    url = db.Column(db.String(100), nullable=True)

    times = db.relationship('Times', backref='tracks', lazy=True)
    gp_tracks = db.relationship('GP', backref='tracks', lazy=True)


class GP(db.Model):
    __tablename__ = 'gp'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    gp_code = db.Column(db.String(100), nullable=False)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), nullable=False)

    gptimes = db.relationship('GPTimes', backref='gp', lazy=True)
    user_gps = db.relationship('UserGP', backref='gp', lazy=True)


class Times(db.Model):
    __tablename__ = 'times'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), nullable=False)
    lap_time = db.Column(db.Time, nullable=False)
    lap_date = db.Column(db.DateTime, nullable=False)


class GPTimes(db.Model):
    __tablename__ = 'gptimes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    gp_id = db.Column(db.Integer, db.ForeignKey('gp.id'), nullable=False)
    standing = db.Column(db.Integer, nullable=False)
    lap_time = db.Column(db.Time, nullable=False)
    lap_date = db.Column(db.DateTime, nullable=False)


class UserGP(db.Model):
    __tablename__ = 'user_gp'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    gp_id = db.Column(db.Integer, db.ForeignKey('gp.id'), nullable=False)
