from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas, models
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/problems", tags=["Problems"])


@router.get("", response_model=List[schemas.ProblemResponse])
def read_problems(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_problems(db, user_id=current_user.id)


@router.post("", response_model=schemas.ProblemResponse, status_code=status.HTTP_201_CREATED)
def create_problem(
    problem: schemas.ProblemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_problem(db, problem, user_id=current_user.id)


@router.delete("/{problem_id}", status_code=status.HTTP_200_OK)
def delete_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    success = crud.delete_problem(db, problem_id, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Problem with ID {problem_id} not found",
        )
    return {"message": f"Problem {problem_id} deleted successfully"}
