def validate_input(user_input):
    """Ensures the user didn't send an empty string or just spaces."""
    if not user_input or not str(user_input).strip():
        return False
    return True