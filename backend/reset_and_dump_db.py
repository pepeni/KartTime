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
    Track(track_name="Go Karting Center", address="Mariana Domagały 25, 30-798 Kraków", phone_number="126530256", opening_hours="14:00-22:00", url="https://gokarting.com.pl/"),
    Track(track_name="Motodrom", address="ul. Bartników 10A, 30-798 Kraków", phone_number="501274608", opening_hours="15:00-21:00", url="https://gokarty.pl/"),
    Track(track_name="WRT Karting Nowa Huta (Makuszyńskiego)", address="Kornela Makuszyńskiego 30, 31-752 Kraków", phone_number="511407247", opening_hours="15:00-22:00", url="http://krakow.wrt-karting.pl/"),
    Track(track_name="WRT Karting Nowa Huta (Kapelanka)", address="Kapelanka 54, 30-347 Kraków", phone_number="572507316", opening_hours="15:00-22:00", url="http://krakow.wrt-karting.pl/"),
    Track(track_name="Karting Arena Kraków", address="Legnicka 5, 31-216 Kraków", phone_number="789035269", opening_hours="15:00-22:00", url="https://kartingarena.pl/"),
    Track(track_name="Racing Kart", address="Sulechów 108a k/Krakowa, 32-010 Kocmyrzów", phone_number="798304060", opening_hours="15:00-22:00", url="https://www.racingkart.pl/"),
    Track(track_name="SKW Racing Park", address="ul. Fieldorfa Nila 7, 32-050 Skawina", phone_number="513827301", opening_hours="15:00-22:00", url="https://skw-racingpark.pl/")
]


    db.session.add_all(tracks)

    db.session.commit()

    print("Baza danych została zresetowana i uzupełniona danymi testowymi!")
    