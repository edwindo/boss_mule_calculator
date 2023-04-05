import json
import requests
import firebase_admin
import os

from flask import Flask, render_template, request, jsonify
from firebase_admin import credentials, firestore, auth
from bs4 import BeautifulSoup

# Firebase Authentication

firebase_cred = {
  "type": "service_account",
  "client_id": "113130100201188313196",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-pueqw%40boss-mule-income-calculator.iam.gserviceaccount.com"
}
project_id = os.environ.get("project_id")
private_key_id = os.environ.get("private_key_id")
private_key = os.environ.get("private_key")
client_email = os.environ.get("client_email")

if private_key_id:
    firebase_cred["private_key_id"] = private_key_id

if private_key:
    firebase_cred["private_key"] = private_key

if client_email:
    firebase_cred["client_email"] = client_email

cred = credentials.Certificate(firebase_cred)
firebase_admin.initialize_app(cred)

db = firestore.client()

# Flask Setup

app = Flask(__name__)

# Constants
FAVICON_PATH = '../favicon.ico'

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
    'vellum': 105062500,
    'pap': 132250000,
    'akechi': 144000000,
    'lotus': 162562500,
    'damien': 169000000,
    'slime': 171610000,
}

# API Routes


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/add_character')
def add_character_page():
    return render_template("add_character.html")


@app.route('/edit_character')
def edit_character_page():
    return render_template("edit_character.html")


@app.route('/login')
def login_page():
    return render_template("login.html")


@app.route('/signup')
def signup_page():
    return render_template("signup.html")


@app.route('/signup', methods=["POST"])
def handle_signup():
    email = request.json.get('email')
    password = request.json.get('password')

    try:
        # Create a new user account with email and password
        user = auth.create_user(
            email=email,
            password=password,
        )

        # Return a success response
        return jsonify({'id_token': user.uid}), 200
    except auth.EmailAlreadyExistsError:
        # Account Creation failed, return an error response
        return jsonify({'error': 'Failed to create user account.'}), 401

@app.route('/characters', methods=["POST"])
def add_character():
    characters = db.collection('character')
    add_character_doc = parse_character_request(request)
    characters.add(add_character_doc)
    return json.dumps(add_character_doc), 200


def parse_character_request(req):
    json_req = req.json
    character_name = json_req['characterName']
    add_character_doc = {'characterName': character_name}
    total_income = 0

    for boss_name in BOSS_VALUES:
        boss_clear = boss_name in json_req
        add_character_doc[boss_name] = boss_clear
        if boss_clear:
            total_income += BOSS_VALUES[boss_name]

    add_character_doc['totalIncome'] = total_income

    # try to get character image
    url = 'https://mapleranks.com/mu/' + character_name
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    image = soup.find('img')

    if image:
        add_character_doc['characterImageUrl'] = image['src']

    # add userIdToken to document
    user_id_token = json_req['userIdToken']
    add_character_doc['userIdToken'] = user_id_token

    return add_character_doc


@app.route('/characters', methods=["GET"])
def get_data():
    characters = db.collection('character')

    character_name = request.args.get('name')
    user_id_token = request.args.get('userIdToken')

    if character_name:
        characters = characters.where("characterName", '==', character_name)

    if user_id_token:
        characters = characters.where("userIdToken", '==', user_id_token)

    docs = characters.get()
    docs_data = [doc.to_dict() for doc in docs]
    return json.dumps(docs_data)


@app.route('/characters', methods=["PUT"])
def update_character():
    characters = db.collection('character')
    update_character_doc = parse_character_request(request)

    user_id_token = request.json['userIdToken']

    query = characters.where("characterName", '==', request.json['characterName'])
    query = query.where("userIdToken", "==", user_id_token)

    character_snapshot = query.get()[0]

    character_ref = characters.document(character_snapshot.id)
    character_ref.update(update_character_doc)
    return json.dumps(update_character_doc), 200


@app.route('/characters', methods=["DELETE"])
def delete_character():
    characters = db.collection('character')

    user_id_token = request.args.get('userIdToken')

    character_name = request.args.get('name')
    query = characters.where("characterName", '==', character_name)
    query = query.where("userIdToken", "==", user_id_token)
    query_result = query.get()

    if query_result:
        character_snapshot = query_result[0]
        character_ref = characters.document(character_snapshot.id)
        character_ref.delete()

    return json.dumps({}), 200


if __name__ == '__main__':
    app.run(debug=True)
