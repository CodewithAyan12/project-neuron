from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas, models
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("", response_model=schemas.AnalyticsResponse)
def read_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_analytics(db, user_id=current_user.id)
