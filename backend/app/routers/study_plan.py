from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas, models
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/study-plan", tags=["Study Plan"])


@router.get("", response_model=List[schemas.StudyPlanResponse])
def read_study_plans(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_study_plans(db, user_id=current_user.id)


@router.post("/{plan_id}/complete", response_model=schemas.StudyPlanResponse)
def complete_study_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    plan = crud.complete_study_plan(db, plan_id=plan_id, user_id=current_user.id)
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Study plan item with ID {plan_id} not found",
        )
    return plan
