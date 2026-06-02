import os
import sys
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.chat_routes import chat_blueprint

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS so our React frontend can talk to this Flask backend safely
CORS(app)

# Register the routes
app.register_blueprint(chat_blueprint, url_prefix='/api')

if __name__ == '__main__':
    print("Starting Omni-Chat Backend Server on Port 5000...")
    app.run(debug=True, port=5000)