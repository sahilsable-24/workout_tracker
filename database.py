from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase,sessionmaker,Session
from settings import settings

class Base(DeclarativeBase):
    pass

engine = create_engine(settings.database_url)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()