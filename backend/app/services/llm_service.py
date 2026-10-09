import os
import httpx
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from .. import crud, models


def build_system_context(db: Session, user: models.User) -> str:
    """Builds a dynamic context string from the student's actual performance history."""
    try:
        analytics = crud.get_analytics(db, user_id=user.id)
        weak_topics = [tp.topic for tp in analytics.topic_performance if tp.score < 60]
        strong_topics = [tp.topic for tp in analytics.topic_performance if tp.score >= 80]

        recent_submissions = [
            f"{act.title} ({act.difficulty}, Status: {act.status})"
            for act in analytics.recent_activity[:4]
        ]

        context = f"""You are Neuron AI, an elite Agentic Coding Mentor designed to help students master Data Structures, Algorithms, and Technical Coding Interviews.
Student Profile:
- Name: {user.name}
- Total Problems Attempted: {analytics.total_problems}
- Weak Topics (<60% accuracy): {', '.join(weak_topics) if weak_topics else 'Dynamic Programming, Graphs'}
- Strong Topics: {', '.join(strong_topics) if strong_topics else 'Arrays, Strings'}
- Recent Submissions: {'; '.join(recent_submissions) if recent_submissions else 'None'}

Mentor Directives:
1. Socratic Teaching: Guide the user to identify the optimal pattern, recurrence relation, or state definition instead of just giving complete answers immediately.
2. Structure: Use concise markdown with bullet points, bold keywords, and clean formatting.
3. Actionable: End with 1 clear action item or recommended next problem.
4. Tone: Encouraging, analytical, and structured."""
        return context
    except Exception:
        return (
            "You are Neuron AI, an elite adaptive coding mentor helping computer science students "
            "master algorithmic problem solving and technical interviews using the Socratic method."
        )


async def call_llm(prompt: str, system_context: str) -> Optional[str]:
    """Calls configured LLM provider (Groq, OpenAI, or Gemini) with graceful timeout."""
    api_key = (
        os.getenv("AI_API_KEY")
        or os.getenv("GROQ_API_KEY")
        or os.getenv("OPENAI_API_KEY")
        or os.getenv("GEMINI_API_KEY")
    )

    if not api_key:
        return None

    api_key = api_key.strip()
    if not api_key:
        return None

    # Detect provider based on key prefix or explicit configuration
    # 1. Groq (starts with gsk_ or default for free LLM API)
    if api_key.startswith("gsk_") or os.getenv("GROQ_API_KEY"):
        url = "https://api.groq.com/openai/v1/chat/completions"
        model = os.getenv("AI_MODEL", "llama-3.3-70b-versatile")
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_context},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 800,
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]

    # 2. Gemini (starts with AIzaSy or GEMINI_API_KEY)
    elif api_key.startswith("AIzaSy") or os.getenv("GEMINI_API_KEY"):
        model = os.getenv("AI_MODEL", "gemini-1.5-flash")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"{system_context}\n\nStudent asks: {prompt}"}
                    ]
                }
            ]
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]

    # 3. OpenAI or standard OpenAI-compatible API
    else:
        base_url = os.getenv("AI_BASE_URL", "https://api.openai.com/v1")
        url = f"{base_url.rstrip('/')}/chat/completions"
        model = os.getenv("AI_MODEL", "gpt-4o-mini")
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_context},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 800,
        }
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]

    return None
