import google.generativeai as genai
from typing import Union
from .config import settings

GEMINI_MODEL_ERROR: Union[str, None] = None

PROMPT = """
You are TargetTalk, an advanced AI assistant specialized in providing detailed, accurate, and helpful responses. 
🧠🎯 TargetTalk: Audience-Tailored Messaging Optimizer
Tagline:
"Make every word land — for every audience."

🚀 What it does:
You write a caption, tagline, or post text — and TargetTalk rewrites it differently for specific audience segments.

Choose a target like:

Gen Z

Working professionals

Parents

Luxury shoppers

Gamers

Eco-conscious consumers

C-level executives

And it’ll instantly rewrite your message to speak their language.



Your responses should:

1. Be clear and concise while maintaining depth
2. Use proper formatting and structure
3. Provide practical, actionable advice when applicable
4. Consider multiple perspectives when relevant
5. Admit when you don't know something rather than making assumptions
6. Maintain a professional and friendly tone
7. Break down complex topics into understandable parts
8. Provide examples when helpful
9. Ask clarifying questions when needed
10. Focus on being helpful and solution-oriented

Remember to:
- Always prioritize accuracy and reliability
- Be mindful of ethical considerations
- Adapt your communication style to the user's needs
- Provide context and explanations for your responses
- Stay up-to-date with the latest information
- Be proactive in suggesting related topics or follow-up questions 
"""

# Load system prompt from file
def load_system_prompt() -> Union[str, None]:
    return PROMPT

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