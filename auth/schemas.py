from pydantic import EmailStr,BaseModel,ConfigDict

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id:int
    email: EmailStr
    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: EmailStr
    password:str

class Token(BaseModel):
    access_token: str
    token_type: str