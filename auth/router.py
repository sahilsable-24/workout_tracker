from fastapi import APIRouter,HTTPException,Depends,status
from database import get_db
from auth.models import User
from auth.schemas import UserCreate,UserOut,LoginRequest,Token
from sqlalchemy.orm import Session
from security import hash_password,verify_password
from auth.jwt import create_access_token,get_current_user

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

@router.post("/login",response_model=Token)
def login(user_login:LoginRequest,db:Session = Depends(get_db)):

    user = db.query(User).filter(User.email == user_login.email).first()

    if not user:
        raise HTTPException(status_code=401,detail="Invalid Not Found")

    if not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(status_code=401,detail="Invalid Email or Password")

    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type":"bearer"
    }

@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user