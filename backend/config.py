import os

from dotenv import load_dotenv


# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()


# ==========================================
# Application Settings
# ==========================================

APP_NAME = os.getenv(
    "APP_NAME",
    "Directorate Reserve Seats AI Assistant",
)

APP_VERSION = os.getenv(
    "APP_VERSION",
    "1.0.0",
)


# ==========================================
# Database Settings
# ==========================================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./reserve_seats.db",
)


# ==========================================
# AI Settings
# ==========================================

AI_MODEL = os.getenv(
    "AI_MODEL",
    "default",
)

AI_TEMPERATURE = float(
    os.getenv(
        "AI_TEMPERATURE",
        "0.2",
    )
)


# ==========================================
# File / Knowledge Base Settings
# ==========================================

DATA_DIR = os.getenv(
    "DATA_DIR",
    "data",
)

MAX_UPLOAD_SIZE_MB = int(
    os.getenv(
        "MAX_UPLOAD_SIZE_MB",
        "20",
    )
)


# ==========================================
# Security Settings
# ==========================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "change-this-secret-key-in-production",
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "60",
    )
)