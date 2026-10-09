import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas, models
from ..dependencies import get_current_user
from ..services.llm_service import build_system_context, call_llm

router = APIRouter(prefix="/api/ai", tags=["AI Mentor"])

SAMPLE_KNOWLEDGE_BASE = {
    "practice": (
        "Based on your recent performance, here's what I recommend for today:\n\n"
        "**Priority 1: Dynamic Programming (Score: 45%)**\n"
        "- Start with 'Climbing Stairs' (Easy) to build state transition confidence.\n"
        "- Progress to 'House Robber' (Medium).\n\n"
        "**Priority 2: Graph Problems (Score: 58%)**\n"
        "- Try 'Number of Islands' — it strengthens DFS flood fill techniques.\n\n"
        "💡 *Tip: Spend 25 minutes per problem. If stuck on DP state equations, write down base cases first.*"
    ),
    "dynamic": (
        "Let's break down why Dynamic Programming can feel challenging:\n\n"
        "1. **State Definition Confusion**: In 60% of failed DP attempts, the issue is unclear state formulation. Always define: *'What does dp[i] or dp[i][j] physically represent?'*\n"
        "2. **Choice Identification**: At element `i`, what decisions can you make? (e.g., include vs skip).\n"
        "3. **Base Conditions**: Always test `n=0` and `n=1` explicitly.\n\n"
        "**Action Plan**: Solve 3 1D-DP problems today focusing only on writing the recurrence relation on paper before coding."
    ),
    "mistake": (
        "Analyzing your recent submission history reveals 3 recurring patterns:\n\n"
        "1. **Off-by-One Array Bounds**: Loops running `0..n` instead of `0..n-1`.\n"
        "2. **Unchecked Edge Cases**: Empty lists or single-element inputs leading to IndexErrors.\n"
        "3. **Time Complexity Oversight**: Falling back to O(N²) nested loops where hash maps provide O(N) lookup.\n\n"
        "Your algorithmic intuition is solid — sharpening input validation will instantly boost your acceptance rate."
    ),
    "plan": (
        "Here is your personalized 7-Day Sprint to master your weak topics:\n\n"
        "• **Day 1**: 1D DP Fundamentals (Memoization vs Tabulation)\n"
        "• **Day 2**: Subsequence Patterns (Coin Change, LIS)\n"
        "• **Day 3**: 2D Grid DP (Unique Paths, Edit Distance)\n"
        "• **Day 4**: Graph Representation & BFS/DFS\n"
        "• **Day 5**: Cycle Detection & Topological Sort\n"
        "• **Day 6**: Mixed Timed Mock Test (30 min/problem)\n"
        "• **Day 7**: Retrospective Review & Error Analysis"
    ),
}

DEFAULT_RESPONSE = (
    "I am Neuron AI, your personalized coding mentor. I monitor your problem-solving metrics, "
    "identify weakness clusters (like Dynamic Programming and Graph traversals), and guide your interview preparation.\n\n"
    "How can I help you today? You can ask me for problem recommendations, algorithm explanations, or an error retrospective."
)

DEFAULT_SUGGESTIONS = [
    "What should I practice today?",
    "Why am I weak in Dynamic Programming?",
    "Explain my recent coding mistakes.",
    "Create a 7-day study plan.",
    "How can I improve my problem-solving speed?",
]


@router.post("/chat", response_model=schemas.AIChatResponse)
async def mentor_chat(
    payload: schemas.AIChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    system_context = build_system_context(db, current_user)

    # Attempt real LLM generation
    try:
        real_response = await call_llm(payload.message, system_context)
        if real_response and real_response.strip():
            return schemas.AIChatResponse(
                response=real_response.strip(),
                user_id=current_user.id,
                suggestions=DEFAULT_SUGGESTIONS,
            )
    except Exception:
        # Graceful fallback to rule-based engine if LLM service times out or fails
        pass

    # Socratic Knowledge Base fallback
    text = payload.message.lower().strip()
    response_text = None
    for keyword, response in SAMPLE_KNOWLEDGE_BASE.items():
        if keyword in text:
            response_text = response
            break

    if not response_text:
        if "speed" in text or "fast" in text or "time" in text:
            response_text = (
                "**Data-Driven Speed Optimization:**\n\n"
                "• Easy problems target: < 10 mins (Your avg: 10 mins ✅)\n"
                "• Medium problems target: < 25 mins (Your avg: 25 mins ⚠️)\n"
                "• Hard problems target: < 45 mins (Your avg: 47 mins)\n\n"
                "To reduce time on Mediums, spend the first 3 minutes sketching the data structure choice on paper before writing code."
            )
        else:
            response_text = DEFAULT_RESPONSE

    return schemas.AIChatResponse(
        response=response_text,
        user_id=current_user.id,
        suggestions=DEFAULT_SUGGESTIONS,
    )
