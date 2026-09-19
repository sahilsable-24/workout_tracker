from groq import Groq
from settings import settings

client = Groq(api_key=settings.groq_api_key)

response = client.chat.completions.create(
    model="openai/gpt-oss-20b",
    messages=[
        {"role": "user", "content": "Say hello in exactly five words."}
    ],
)

print(response.choices[0].message.content)