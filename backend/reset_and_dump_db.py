from services import db
from models import User, Track
from app import app
from werkzeug.security import generate_password_hash


with app.app_context():
    db.drop_all()
    db.create_all()

    first_user = User(name="admin", pwd_hash=generate_password_hash("admin123"))
    second_user = User(name="Karmel", pwd_hash=generate_password_hash("Abcd123!"))
    third_user = User(name="Jan Cox", pwd_hash=generate_password_hash("Password#1"))
    db.session.add(first_user)
    db.session.add(second_user)
    db.session.add(third_user)

    tracks = [
        Track(track_name="WRT", address="Kornela Makuszyńskiego 30", phone_number="511407247", opening_hours="15:00-22:00", url="http://krakow.wrt-karting.pl/"),
        Track(track_name="Karting Arena Kraków", address="Legnicka 5", phone_number="789035269", opening_hours="10:00-20:00", url="https://kartingarena.pl/"),
        Track(track_name="Budda Center", address="Montelupich 7", phone_number="997112997", opening_hours="6:00-23:00", url="https://areszt-sledczy.pl/"),
        Track(track_name="Silverstone", address="UK", phone_number="987654321", opening_hours="10:00-19:00", url="http://silverstone.com"),
        Track(track_name="Spa-Francorchamps", address="Belgium", phone_number="456789123", opening_hours="08:00-17:00", url="http://spa.com")
    ]

    db.session.add_all(tracks)

    db.session.commit()

    print("Baza danych została zresetowana i uzupełniona danymi testowymi!")
    