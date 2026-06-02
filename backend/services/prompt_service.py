def enhance_prompt(user_message):
    """
    Analyzes the user's input and assigns the perfect System Persona and formatting instructions.
    """
    msg_lower = user_message.lower()
    
    # Feature 1: Summarization Capability
    if "summarize" in msg_lower or "summary" in msg_lower:
        system_prompt = "You are an expert summarizer. Provide a concise, highly accurate summary of the provided text. Use bullet points for key takeaways."
        enhanced_message = f"Please summarize this:\n\n{user_message}"
    
    # Feature 2 & 3: Q&A and Well-Structured Responses
    else:
        system_prompt = (
            "You are an intelligent, helpful AI assistant. "
            "Always structure your responses clearly. Use bullet points, bold text, "
            "or numbered lists where appropriate to make the information highly readable."
        )
        enhanced_message = user_message

    return system_prompt, enhanced_message