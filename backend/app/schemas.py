from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict


# User Schemas
class UserBase(BaseModel):
    name: str
    email: str


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Problem Schemas
class ProblemBase(BaseModel):
    title: str
    platform: Optional[str] = "LeetCode"
    topic: str
    difficulty: str
    language: Optional[str] = "Python"
    time_taken: Optional[str] = "15"
    notes: Optional[str] = None
    status: Optional[str] = "Solved"


class ProblemCreate(ProblemBase):
    user_id: Optional[int] = 1


class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    platform: Optional[str] = None
    topic: Optional[str] = None
    difficulty: Optional[str] = None
    language: Optional[str] = None
    time_taken: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None


class ProblemResponse(ProblemBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# Study Plan Schemas
class StudyPlanBase(BaseModel):
    day: int
    topic: str
    description: str
    estimated_time: Optional[str] = "2 hours"
    difficulty: Optional[str] = "Medium"
    completed: Optional[bool] = False


class StudyPlanCreate(StudyPlanBase):
    user_id: Optional[int] = 1


class StudyPlanResponse(StudyPlanBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)


# Analytics Schemas
class TopicPerformance(BaseModel):
    topic: str
    score: int
    solved: int
    total: int


class ActivityItem(BaseModel):
    id: int
    title: str
    platform: str
    difficulty: str
    status: str
    time: str
    date: str


class AnalyticsResponse(BaseModel):
    total_problems: int
    easy_count: int
    medium_count: int
    hard_count: int
    average_solve_time: float
    topic_performance: List[TopicPerformance]
    recent_activity: List[ActivityItem]


# AI Chat Schemas
class AIChatRequest(BaseModel):
    message: str
    user_id: Optional[int] = 1


class AIChatResponse(BaseModel):
    response: str
    user_id: int
    suggestions: List[str]
