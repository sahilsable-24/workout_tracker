from fastapi import APIRouter,HTTPException,Depends,status
from database import get_db
from auth.models import User
from auth.schemas import UserCreate,UserOut
from sqlalchemy.orm import Session
from security import hash_password

router = APIRouter(prefix="/auth",tags=["auth"])

@router.post("/register",response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in:UserCreate,db:Session = Depends(get_db)):

    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=409,detail="User already exists")

    hashed_password = hash_password(user_in.password)

    new_user = User(email=user_in.email,hashed_password = hashed_password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user