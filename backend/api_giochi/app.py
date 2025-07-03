from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

def load_games():
    with open('giochi.json', 'r', encoding='utf-8') as f:
        return json.load(f)

@app.route('/')
def home():
    return 'API giochi attiva!'

@app.route('/games', methods=['GET'])
def get_all_games():
    games = load_games()
    return jsonify(games)

@app.route('/games/<int:game_id>', methods=['GET'])
def get_game_by_id(game_id):
    games = load_games()
    game = next((g for g in games if int(g['id']) == game_id), None)
    if game:
        return jsonify(game)
    return jsonify({'error': 'Gioco non trovato'}), 404

if __name__ == '__main__':
    app.run(debug=True)