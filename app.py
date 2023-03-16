import json

from flask import Flask, render_template, request, url_for
import firebase_admin
from firebase_admin import credentials, firestore
import requests
from bs4 import BeautifulSoup

# Firebase Authentication

cred = credentials.Certificate('firebase-adminsdk.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Flask Setup

app = Flask(__name__)

# Constants
FAVICON_PATH = 'favicon.ico'

ALL_BOSSES = ['hilla', 'pinkbean', 'cygnus', 'zakum', 'queen', 'pierre', 'vonbon', 'pno', 'magnus', 'vellum']
BOSS_VALUES = {
    'hilla': 56250000,
    'pinkbean': 64000000,
    'cygnus': 72250000,
    'zakum': 81000000,
    'queen': 81000000,
    'pierre': 81000000,
    'vonbon': 81000000,
    'pno': 81000000,
    'magnus': 95062500,
    'vellum': 105062500
}

# API Routes


@app.route('/')
def index():
    return render_template("index.html")


# Add a route for the favicon file
@app.route('/favicon.ico')
def favicon():
    return url_for('static', filename='favicon.ico')


@app.route('/add_character')
def add_character_page():
    return render_template("add_character.html")


@app.route('/add_character', methods=["POST"])
def add_character():
    characters = db.collection('character')
    add_character_doc = parse_add_character_request(request)
    characters.add(add_character_doc)
    return json.dumps(add_character_doc), 200


def parse_add_character_request(req):
    json_req = req.json
    character_name = json_req['character-name']
    add_character_doc = {'character-name': character_name}
    total_income = 0

    for boss_name in ALL_BOSSES:
        boss_clear = boss_name in json_req
        add_character_doc[boss_name] = boss_clear
        if boss_clear:
            total_income += BOSS_VALUES[boss_name]

    add_character_doc['total-income'] = total_income

    # try to get character image
    url = 'https://mapleranks.com/mu/' + character_name
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    image = soup.find('img')

    if image:
        add_character_doc['character-image-url'] = image['src']

    return add_character_doc


@app.route('/get_data', methods=["GET"])
def get_data():
    characters = db.collection('character')
    docs = characters.get()
    docs_data = [doc.to_dict() for doc in docs]
    return json.dumps(docs_data)


if __name__ == '__main__':
    app.run(debug=True)
