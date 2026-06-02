import os
import requests

def call_groq_api(system_prompt, user_message):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is missing from the .env file.")

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.7
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()

        print("\n=== RAW GROQ RESPONSE ===")
        print(response_data)
        print("=========================\n")

        if not response.ok:
            if isinstance(response_data, dict):
                error_msg = response_data.get("error", {}).get("message", str(response_data))
            else:
                error_msg = str(response_data)
            raise Exception(f"Groq API Error: {error_msg}")

        if isinstance(response_data, dict) and 'choices' in response_data:
            choices = response_data['choices']
            
            if isinstance(choices, list) and len(choices) > 0:
                first_choice = choices[0]
                
                if isinstance(first_choice, dict) and 'message' in first_choice:
                    message = first_choice['message']
                    
                    if isinstance(message, dict) and 'content' in message:
                        return message['content']
        
        raise Exception("Received an unexpected data structure from Groq.")

    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error communicating with Groq: {str(e)}")