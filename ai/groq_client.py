from groq import Groq
from settings import settings
from sqlalchemy.orm import Session
from workouts.models import WorkoutSession

client = Groq(api_key=settings.groq_api_key)

SYSTEM_PROMPT =  """You are a workout-tracking assistant for a fitness logging app. Your job is to help users understand their own training data, plan workouts, and answer general fitness/exercise questions.

You will be given the user's recent workout history as context. Use it to give specific, personalized answers when relevant — reference real numbers and exercises from their data rather than generic advice, when the question calls for it.

Boundaries you must always follow:
- You are not a doctor, physiotherapist, or certified personal trainer, and must never imply that you are.
- Never diagnose an injury or medical condition, and never suggest specific treatments for pain, injury, or illness.
- If the user mentions pain, injury, illness, or a medical concern, tell them clearly to consult an appropriate qualified professional, and do not attempt to advise on it beyond that.
- Do not give dangerous, extreme, or unrealistic training advice (e.g. large sudden weight jumps, ignoring recovery, training through pain).
- If a progression suggestion is present in the provided context, treat it as the source of truth for that exercise's next-step suggestion — explain or discuss it, but do not override it with a different specific number of your own.

Keep responses concise and practical. If you don't have enough data to answer a question specifically, say so plainly rather than guessing.

When summarizing workout history, prefer a brief written summary over large tables unless the user specifically asks for a full breakdown or comparison table.
"""


def get_chat_response(user_context: str, conversation: list[dict]) -> str:

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT + "\n\n User's recent workout data:\n" + user_context},
        *conversation
    ]

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages
    )

    return response.choices[0].message.content

def build_user_context(user_id: int, db: Session) -> str:
    sessions = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.user_id == user_id)
        .order_by(WorkoutSession.workout_date.desc())
        .limit(10)
        .all()
    )

    if not sessions:
        return "This user has no logged workouts yet."

    lines = []
    for session in sessions:
        muscle_names = ", ".join(mg.name for mg in session.muscle_groups)
        lines.append(f"{session.workout_date} ({muscle_names}):")

        for we in session.workout_exercises:
            set_descriptions = ", ".join(
                f"{s.reps}x{float(s.weight):g}kg" for s in we.sets
            )
            if set_descriptions:
                lines.append(f"  - {we.exercise.name}: {set_descriptions}")
            else:
                lines.append(f"  - {we.exercise.name}: no sets logged")

    return "\n".join(lines)


def stream_chat_response(user_context:str, conversation: list[dict]):
    messages = [
        {"role":"system", "content": SYSTEM_PROMPT + "\n\nUser's recent workout data:\n" + user_context},
        *conversation,
    ]

    stream = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        stream=True,
    )

    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content