from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "K-COMOS API"
    env: str = "development"
    database_url: str = "postgresql+psycopg://komos:komos@db:5432/komos"
    redis_url: str = "redis://redis:6379/0"
    cors_allow_origins: str = "*"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
