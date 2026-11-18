
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()


def generate_chat_response(message: str) -> str:

    # Create OpenAI client
    client = OpenAI()

    # Send the question to OpenAI
    response = client.responses.create(
        model="gpt-4.1-mini",
        instructions=(
            "You are an AI assistant for an e-commerce "
            "administration and monitoring system. "
            "Answer clearly and concisely. "
            "Do not claim access to live orders, payments, "
            "or inventory unless that data is provided."
        ),
        input=message,
        max_output_tokens=250
    )

    return response.output_text
