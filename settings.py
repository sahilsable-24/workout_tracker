from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name : str = "Workout Tracker"
    model_config = SettingsConfigDict(env_file=".env")
    database_url: str

settings= Settings()