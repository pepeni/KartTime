#!/bin/bash

echo "Resetowanie bazy danych i ładowanie danych testowych..."
python reset_and_dump_db.py

if [ $? -ne 0 ]; then
  echo "Błąd podczas resetowania bazy danych!"
  exit 1
fi

echo "Uruchamianie aplikacji Flask..."
python app.py

if [ $? -ne 0 ]; then
  echo "Błąd podczas uruchamiania aplikacji!"
  exit 1
fi