from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    problems = relationship("Problem", back_populates="user", cascade="all, delete-orphan")
    study_plans = relationship("StudyPlan", back_populates="user", cascade="all, delete-orphan")


class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False, index=True)
    platform = Column(String(50), default="LeetCode")
    topic = Column(String(100), nullable=False, index=True)
    difficulty = Column(String(20), nullable=False)  # Easy, Medium, Hard
    language = Column(String(50), default="Python")
    time_taken = Column(String(50), default="15")  # in minutes or display format
    notes = Column(Text, nullable=True)
    status = Column(String(50), default="Solved")  # Solved, Attempted, Revising
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="problems")


class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    day = Column(Integer, nullable=False)
    topic = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    estimated_time = Column(String(50), default="2 hours")
    difficulty = Column(String(20), default="Medium")
    completed = Column(Boolean, default=False)

    # Relationship
    user = relationship("User", back_populates="study_plans")
