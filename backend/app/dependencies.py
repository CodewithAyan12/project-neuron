from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import get_db
from . import models


def get_current_user(db: Session = Depends(get_db)) -> models.User:
    """Returns the default demo user, creating them if not present."""
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
