import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=API_KEY,
    http_options=types.HttpOptions(
        timeout=120000
    )
)

def ask_gemini(prompt):

    response = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt
    )

    return response.output_text

import time
from google.genai.errors import ServerError

def ask_gemini(prompt):

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt
            )

            return response.text

        except ServerError as error:
            if "503" not in str(error):
                raise

            if attempt == 2:
                raise

            time.sleep(2 ** (attempt + 1))