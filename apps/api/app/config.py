from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "DataDemolisher API"
    env: str = "development"
    database_url: str = "sqlite:///./datademolisher.db"
    tba_api_key: str | None = None
    statbotics_base_url: str = "https://api.statbotics.io/v3"
    tba_base_url: str = "https://www.thebluealliance.com/api/v3"
    redis_url: str = "redis://localhost:6379/0"


settings = Settings()
