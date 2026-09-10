from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name : str = "Workout Tracker"
    model_config = SettingsConfigDict(env_file=".env")
    database_url: str
    secret_key: str
    access_token_expire_minutes: int = 30

settings= Settings()