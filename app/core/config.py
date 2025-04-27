from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )

    API_V1_STR: str = "/api/v1"

    PROJECT_NAME: str = "TargetTalkBackend"
    GEMINI_API_KEY: str
    UPSTASH_REDIS_REST_URL: str = "https://massive-kangaroo-29407.upstash.io"
    UPSTASH_REDIS_REST_TOKEN: str


settings = Settings()
