import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer


# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()


# ==========================================
# JWT Configuration
# ==========================================

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

JWT_EXPIRE_MINUTES = int(
    os.getenv(
        "JWT_EXPIRE_MINUTES",
        "60",
    )
)

JWT_ALGORITHM = "HS256"


if not JWT_SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY is not configured in the .env file."
    )


# ==========================================
# HTTP Bearer Authentication
# ==========================================

security = HTTPBearer()


# ==========================================
# Create Student Access Token
# ==========================================

def create_access_token(
    student_id: int,
    email: str,
) -> str:

    expire = (
        datetime.now(timezone.utc)
        + timedelta(minutes=JWT_EXPIRE_MINUTES)
    )

    payload = {
        "sub": str(student_id),
        "email": email,
        "role": "student",
        "exp": expire,
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )

    return token


# ==========================================
# Create Admin Access Token
# ==========================================

def create_admin_access_token(
    admin_id: int,
    email: str,
) -> str:

    expire = (
        datetime.now(timezone.utc)
        + timedelta(minutes=JWT_EXPIRE_MINUTES)
    )

    payload = {
        "sub": str(admin_id),
        "email": email,
        "role": "admin",
        "exp": expire,
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )

    return token


# ==========================================
# Verify Access Token
# ==========================================

def verify_access_token(
    token: str,
) -> dict:

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )

        return payload

    except jwt.ExpiredSignatureError:

        raise ValueError(
            "Access token has expired."
        )

    except jwt.InvalidTokenError:

        raise ValueError(
            "Invalid access token."
        )


# ==========================================
# Get Current Student
# ==========================================

def get_current_student(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
) -> dict:

    token = credentials.credentials

    try:

        payload = verify_access_token(token)

    except ValueError as error:

        raise HTTPException(
            status_code=401,
            detail=str(error),
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    if payload.get("role") != "student":

        raise HTTPException(
            status_code=403,
            detail="Student access required.",
        )

    student_id = payload.get("sub")

    if not student_id:

        raise HTTPException(
            status_code=401,
            detail="Invalid student token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    try:
        student_id = int(student_id)

    except (TypeError, ValueError):

        raise HTTPException(
            status_code=401,
            detail="Invalid student ID in token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    return {
        "student_id": student_id,
        "email": payload.get("email"),
        "role": payload.get("role"),
    }


# ==========================================
# Get Current Admin
# ==========================================

def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
) -> dict:

    token = credentials.credentials

    try:

        payload = verify_access_token(token)

    except ValueError as error:

        raise HTTPException(
            status_code=401,
            detail=str(error),
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # ------------------------------------------
    # Check Admin Role
    # ------------------------------------------

    if payload.get("role") != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin access required.",
        )

    admin_id = payload.get("sub")

    if not admin_id:

        raise HTTPException(
            status_code=401,
            detail="Invalid admin token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    try:
        admin_id = int(admin_id)

    except (TypeError, ValueError):

        raise HTTPException(
            status_code=401,
            detail="Invalid admin ID in token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    return {
        "admin_id": admin_id,
        "email": payload.get("email"),
        "role": payload.get("role"),
    }