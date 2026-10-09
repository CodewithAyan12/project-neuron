import re
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from . import models, schemas


def get_or_create_demo_user(db: Session) -> models.User:
    user = db.query(models.User).filter(models.User.email == "demo@neuron.ai").first()
    if not user:
        user = models.User(
            name="Ayan Sharma",
            email="demo@neuron.ai"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def seed_initial_data_if_empty(db: Session):
    user = get_or_create_demo_user(db)

    # Seed problems if none exist
    if db.query(models.Problem).count() == 0:
        default_problems = [
            {"title": "Two Sum", "platform": "LeetCode", "topic": "Arrays", "difficulty": "Easy", "language": "Python", "time_taken": "12", "notes": "Used hash map approach", "status": "Solved"},
            {"title": "Longest Substring Without Repeating Characters", "platform": "LeetCode", "topic": "Strings", "difficulty": "Medium", "language": "JavaScript", "time_taken": "25", "notes": "Sliding window technique", "status": "Solved"},
            {"title": "Merge K Sorted Lists", "platform": "LeetCode", "topic": "Linked List", "difficulty": "Hard", "language": "C++", "time_taken": "45", "notes": "Used min-heap. Need to review merge approach.", "status": "Attempted"},
            {"title": "Coin Change", "platform": "LeetCode", "topic": "Dynamic Programming", "difficulty": "Medium", "language": "Python", "time_taken": "30", "notes": "Bottom-up DP approach", "status": "Solved"},
            {"title": "Valid Parentheses", "platform": "LeetCode", "topic": "Strings", "difficulty": "Easy", "language": "Java", "time_taken": "8", "notes": "Stack-based solution", "status": "Solved"},
            {"title": "Binary Tree Level Order Traversal", "platform": "LeetCode", "topic": "Trees", "difficulty": "Medium", "language": "Python", "time_taken": "20", "notes": "BFS with queue", "status": "Solved"},
            {"title": "Number of Islands", "platform": "LeetCode", "topic": "Graphs", "difficulty": "Medium", "language": "Python", "time_taken": "22", "notes": "DFS flood fill", "status": "Solved"},
            {"title": "Edit Distance", "platform": "LeetCode", "topic": "Dynamic Programming", "difficulty": "Hard", "language": "C++", "time_taken": "50", "notes": "Classic 2D DP. Still shaky on state transitions.", "status": "Attempted"},
            {"title": "Maximum Subarray", "platform": "LeetCode", "topic": "Arrays", "difficulty": "Medium", "language": "Python", "time_taken": "15", "notes": "Kadane's algorithm", "status": "Solved"},
            {"title": "Word Search", "platform": "LeetCode", "topic": "Graphs", "difficulty": "Medium", "language": "Java", "time_taken": "35", "notes": "Backtracking DFS", "status": "Solved"},
        ]
        for p in default_problems:
            problem = models.Problem(**p, user_id=user.id)
            db.add(problem)

    # Seed study plan if none exist
    if db.query(models.StudyPlan).count() == 0:
        default_plans = [
            {"day": 1, "topic": "Dynamic Programming Basics", "description": "Master overlapping subproblems and memoization vs tabulation. Solve Fibonacci & Climbing Stairs.", "estimated_time": "2 hours", "difficulty": "Easy", "completed": True},
            {"day": 2, "topic": "1D Dynamic Programming", "description": "Solve House Robber, Coin Change, and Longest Increasing Subsequence.", "estimated_time": "2.5 hours", "difficulty": "Medium", "completed": False},
            {"day": 3, "topic": "2D Dynamic Programming", "description": "Solve Unique Paths, LCS, and Edit Distance with state transition matrices.", "estimated_time": "3 hours", "difficulty": "Hard", "completed": False},
            {"day": 4, "topic": "Graph Traversals (BFS/DFS)", "description": "Graph representation, Number of Islands, and Clone Graph.", "estimated_time": "2.5 hours", "difficulty": "Medium", "completed": False},
            {"day": 5, "topic": "Advanced Graphs & Topological Sort", "description": "Cycle detection and Course Schedule problems.", "estimated_time": "2.5 hours", "difficulty": "Medium", "completed": False},
            {"day": 6, "topic": "Mixed Speed Practice", "description": "Cheapest Flights, Word Break under timed conditions.", "estimated_time": "3 hours", "difficulty": "Medium", "completed": False},
            {"day": 7, "topic": "Full Mock Assessment", "description": "4 problems in 2 hours with in-depth error retrospective.", "estimated_time": "3 hours", "difficulty": "Hard", "completed": False},
        ]
        for sp in default_plans:
            plan = models.StudyPlan(**sp, user_id=user.id)
            db.add(plan)

    db.commit()


# Problems CRUD
def get_problems(db: Session, user_id: int = 1) -> List[models.Problem]:
    return db.query(models.Problem).filter(models.Problem.user_id == user_id).order_by(models.Problem.created_at.desc()).all()


def create_problem(db: Session, problem: schemas.ProblemCreate, user_id: int = 1) -> models.Problem:
    db_problem = models.Problem(
        user_id=user_id,
        title=problem.title,
        platform=problem.platform or "LeetCode",
        topic=problem.topic,
        difficulty=problem.difficulty,
        language=problem.language or "Python",
        time_taken=str(problem.time_taken or "15"),
        notes=problem.notes,
        status=problem.status or "Solved"
    )
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    return db_problem


def delete_problem(db: Session, problem_id: int, user_id: int = 1) -> bool:
    problem = db.query(models.Problem).filter(models.Problem.id == problem_id, models.Problem.user_id == user_id).first()
    if not problem:
        return False
    db.delete(problem)
    db.commit()
    return True


# Study Plan CRUD
def get_study_plans(db: Session, user_id: int = 1) -> List[models.StudyPlan]:
    return db.query(models.StudyPlan).filter(models.StudyPlan.user_id == user_id).order_by(models.StudyPlan.day.asc()).all()


def complete_study_plan(db: Session, plan_id: int, user_id: int = 1) -> Optional[models.StudyPlan]:
    plan = db.query(models.StudyPlan).filter(models.StudyPlan.id == plan_id, models.StudyPlan.user_id == user_id).first()
    if not plan:
        return None
    plan.completed = not plan.completed  # toggle status
    db.commit()
    db.refresh(plan)
    return plan


# Analytics Aggregator
def get_analytics(db: Session, user_id: int = 1) -> schemas.AnalyticsResponse:
    problems = db.query(models.Problem).filter(models.Problem.user_id == user_id).all()

    total_problems = len(problems)
    easy_count = sum(1 for p in problems if p.difficulty.lower() == "easy")
    medium_count = sum(1 for p in problems if p.difficulty.lower() == "medium")
    hard_count = sum(1 for p in problems if p.difficulty.lower() == "hard")

    # Calculate average time taken
    times = []
    for p in problems:
        if p.time_taken:
            numbers = re.findall(r"\d+", str(p.time_taken))
            if numbers:
                times.append(float(numbers[0]))
    average_solve_time = round(sum(times) / len(times), 1) if times else 22.0

    # Topic performance calculation
    topics_map = {}
    for p in problems:
        topic = p.topic
        if topic not in topics_map:
            topics_map[topic] = {"solved": 0, "total": 0}
        topics_map[topic]["total"] += 1
        if p.status == "Solved":
            topics_map[topic]["solved"] += 1

    topic_performance = []
    benchmark_topics = {
        "Arrays": 85,
        "Strings": 78,
        "Linked List": 72,
        "Trees": 65,
        "Graphs": 58,
        "Dynamic Programming": 45,
    }

    for topic, stats in topics_map.items():
        base_benchmark = benchmark_topics.get(topic, 70)
        calculated_score = int((stats["solved"] / max(stats["total"], 1)) * 100)
        final_score = int((base_benchmark + calculated_score) / 2)
        topic_performance.append(
            schemas.TopicPerformance(
                topic=topic,
                score=min(final_score, 100),
                solved=stats["solved"],
                total=stats["total"],
            )
        )

    # Ensure all benchmark topics appear even if not yet in problems
    existing_topics = {tp.topic for tp in topic_performance}
    for topic, score in benchmark_topics.items():
        if topic not in existing_topics:
            topic_performance.append(
                schemas.TopicPerformance(topic=topic, score=score, solved=2, total=4)
            )

    recent_activity = [
        schemas.ActivityItem(
            id=p.id,
            title=p.title,
            platform=p.platform or "LeetCode",
            difficulty=p.difficulty,
            status=p.status or "Solved",
            time=f"{p.time_taken} min" if not str(p.time_taken).endswith("min") else str(p.time_taken),
            date=p.created_at.strftime("%Y-%m-%d"),
        )
        for p in problems[:5]
    ]

    return schemas.AnalyticsResponse(
        total_problems=total_problems,
        easy_count=easy_count,
        medium_count=medium_count,
        hard_count=hard_count,
        average_solve_time=average_solve_time,
        topic_performance=topic_performance,
        recent_activity=recent_activity,
    )
