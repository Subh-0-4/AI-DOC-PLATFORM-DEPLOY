from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # JWT / auth settings
    secret_key: str = "supersecret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # Database
    DATABASE_URL: str = "sqlite:///./app.db"

    # Gemini LLM
    gemini_api_key: str | None = None  # <-- IMPORTANT

    # Tell pydantic to load from .env, and ignore extra env vars instead of crashing
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
