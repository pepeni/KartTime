trello: https://trello.com/b/JjfiebtN/karttime

Swagger: http://127.0.0.1:5000/api/

Odpalenie backa:
- docker-compose up
- cd backend
- python -m venv venv
- venv\Scripts\Activate
- pip install -r requirements.txt
- python reset_and_dump_db.py a później python app.py albo start_app.sh

Podejrzenie tabelek w bazie z cmd:
- docker exec -it postgresql_karttime bash
- psql -U postgres -d DB
- \dt
