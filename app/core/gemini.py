import google.generativeai as genai
from typing import Union
from .config import settings

GEMINI_MODEL_ERROR: Union[str, None] = None

# Load system prompt from file
def load_system_prompt() -> Union[str, None]:
    try:
        with open('prompts.txt', 'r') as file:
            return file.read()
    except FileNotFoundError:
        return None

    return None

try:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    # List available models
    # print("\nAvailable models:")
    # for m in genai.list_models():
    #     if "generateContent" in m.supported_generation_methods:
    #         print(f"- {m.name}")
    
    # Initialize the model
    model = genai.GenerativeModel('gemini-2.5-pro-preview-03-25')
    # print("\nModel initialized successfully!")
except Exception as e:
    GEMINI_MODEL_ERROR = f"{e}"
    model = None

def chat_with_gemini(prompt: str, option: str) -> str:
    """
    Send a prompt to Gemini and get the response
    """
    if model == None:
        return f"AI Model Error: {GEMINI_MODEL_ERROR}"

    try:
        system_prompt = load_system_prompt()
        if system_prompt is None:
            return "Error: Prompts for AI failed to load"
        full_prompt = f"{system_prompt}\n\nUser: {prompt}\nOption: {option}"
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        return f"AI Error: {str(e)}"