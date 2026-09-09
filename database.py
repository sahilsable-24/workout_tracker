from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase
from settings import settings

class Base(DeclarativeBase):
    pass

engine = create_engine(settings.database_url)