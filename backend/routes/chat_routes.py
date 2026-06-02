from flask import Blueprint, request, jsonify
from utils.input_handler import validate_input
from services.prompt_service import enhance_prompt
from services.groq_service import call_groq_api

chat_blueprint = Blueprint('chat', __name__)

@chat_blueprint.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')

        # 1. Validation
        if not validate_input(user_message):
            return jsonify({"error": "Message cannot be empty."}), 400

        # 2. Enhance Prompt
        system_prompt, enhanced_user_prompt = enhance_prompt(user_message)

        # 3. Connect to Groq API
        ai_response = call_groq_api(system_prompt, enhanced_user_prompt)

        # 4. Return formatted JSON to React
        return jsonify({"response": ai_response})

    except Exception as e:
        # Error Handling: Send formatted errors back to the frontend
        return jsonify({"error": str(e)}), 500