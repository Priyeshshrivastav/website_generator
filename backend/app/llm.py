import os
import json
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

# Search for .env in current and parent directories
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_NAME = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

# Fallback models in case primary is busy
FALLBACK_MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"]

def get_groq_client():
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set in .env")
    return Groq(api_key=GROQ_API_KEY)

def call_llm_json(system_prompt: str, user_prompt: str, model: str = MODEL_NAME) -> dict:
    """
    Provider-adapter function calling Groq LLM with JSON response format.
    Can easily be swapped or extended with another provider in the future.
    """
    client = get_groq_client()
    models_to_try = [model] + [m for m in FALLBACK_MODELS if m != model]
    last_err = None

    for m in models_to_try:
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=m,
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            content = chat_completion.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            last_err = e
            continue

    raise RuntimeError(f"Error communicating with Groq LLM: {str(last_err)}")
