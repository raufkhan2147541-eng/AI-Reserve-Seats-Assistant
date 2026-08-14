from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import bcrypt
import secrets
from datetime import datetime, timedelta

from auth_utils import (
    create_access_token,
    create_admin_access_token,
    get_current_student,
)
from database import get_connection


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ==========================================
# Student Registration Model
# ==========================================

class StudentRegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str


# ==========================================
# Student Login Model
# ==========================================

class StudentLoginRequest(BaseModel):
    email: str
    password: str


# ==========================================
# Admin Login Model
# ==========================================

class AdminLoginRequest(BaseModel):
    email: str
    password: str


# ==========================================
# Forgot Password Model
# ==========================================

class ForgotPasswordRequest(BaseModel):
    email: str


# ==========================================
# Reset Password Model
# ==========================================

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# ==========================================
# Student Registration
# ==========================================

@router.post("/student/register")
async def register_student(
    request: StudentRegisterRequest,
):
    full_name = request.full_name.strip()
    email = request.email.strip().lower()
    password = request.password

    # ------------------------------------------
    # Validate Input
    # ------------------------------------------

    if not full_name:
        raise HTTPException(
            status_code=400,
            detail="Full name is required.",
        )

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required.",
        )

    if not password:
        raise HTTPException(
            status_code=400,
            detail="Password is required.",
        )

    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters long.",
        )

    if len(password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password cannot be longer than 72 bytes.",
        )

    connection = get_connection()
    cursor = connection.cursor()

    # ------------------------------------------
    # Check Existing Student
    # ------------------------------------------

    existing_student = cursor.execute(
        """
        SELECT id
        FROM students
        WHERE email = ?
        """,
        (email,),
    ).fetchone()

    if existing_student:
        connection.close()

        raise HTTPException(
            status_code=409,
            detail="A student with this email already exists.",
        )

    # ------------------------------------------
    # Hash Password
    # ------------------------------------------

    password_hash = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")

    # ------------------------------------------
    # Create Student
    # ------------------------------------------

    cursor.execute(
        """
        INSERT INTO students (
            full_name,
            email,
            password_hash
        )
        VALUES (?, ?, ?)
        """,
        (
            full_name,
            email,
            password_hash,
        ),
    )

    connection.commit()

    student_id = cursor.lastrowid

    connection.close()

    return {
        "success": True,
        "message": "Student registered successfully.",
        "student": {
            "id": student_id,
            "full_name": full_name,
            "email": email,
        },
    }


# ==========================================
# Student Login
# ==========================================

@router.post("/student/login")
async def login_student(
    request: StudentLoginRequest,
):
    email = request.email.strip().lower()
    password = request.password

    # ------------------------------------------
    # Validate Input
    # ------------------------------------------

    if not email or not password:
        raise HTTPException(
            status_code=400,
            detail="Email and password are required.",
        )

    connection = get_connection()
    cursor = connection.cursor()

    # ------------------------------------------
    # Find Student
    # ------------------------------------------

    student = cursor.execute(
        """
        SELECT
            id,
            full_name,
            email,
            password_hash
        FROM students
        WHERE email = ?
        """,
        (email,),
    ).fetchone()

    connection.close()

    if not student:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    # ------------------------------------------
    # Verify Password
    # ------------------------------------------

    password_valid = bcrypt.checkpw(
        password.encode("utf-8"),
        student["password_hash"].encode("utf-8"),
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    # ------------------------------------------
    # Create Student JWT Token
    # ------------------------------------------

    access_token = create_access_token(
        student_id=student["id"],
        email=student["email"],
    )

    return {
        "success": True,
        "message": "Student login successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "student": {
            "id": student["id"],
            "full_name": student["full_name"],
            "email": student["email"],
        },
    }


# ==========================================
# Get Current Student Profile
# ==========================================

@router.get("/student/me")
async def get_current_student_profile(
    current_student: dict = Depends(
        get_current_student
    ),
):
    student_id = current_student["student_id"]

    connection = get_connection()
    cursor = connection.cursor()

    student = cursor.execute(
        """
        SELECT
            id,
            full_name,
            email,
            created_at
        FROM students
        WHERE id = ?
        """,
        (student_id,),
    ).fetchone()

    connection.close()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found.",
        )

    return {
        "success": True,
        "student": {
            "id": student["id"],
            "full_name": student["full_name"],
            "email": student["email"],
            "created_at": student["created_at"],
        },
    }


# ==========================================
# Student Forgot Password
# ==========================================

@router.post("/student/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
):
    email = request.email.strip().lower()

    # ------------------------------------------
    # Validate Email
    # ------------------------------------------

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required.",
        )

    connection = get_connection()
    cursor = connection.cursor()

    # ------------------------------------------
    # Find Student
    # ------------------------------------------

    student = cursor.execute(
        """
        SELECT
            id,
            email
        FROM students
        WHERE email = ?
        """,
        (email,),
    ).fetchone()

    if not student:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="No student account found with this email.",
        )

    # ------------------------------------------
    # Invalidate Previous Reset Tokens
    # ------------------------------------------

    cursor.execute(
        """
        UPDATE password_reset_tokens
        SET used = 1
        WHERE student_id = ?
        AND used = 0
        """,
        (student["id"],),
    )

    # ------------------------------------------
    # Generate New Reset Token
    # ------------------------------------------

    reset_token = secrets.token_urlsafe(32)

    expires_at = datetime.utcnow() + timedelta(
        minutes=15
    )

    cursor.execute(
        """
        INSERT INTO password_reset_tokens (
            student_id,
            token,
            expires_at,
            used
        )
        VALUES (?, ?, ?, 0)
        """,
        (
            student["id"],
            reset_token,
            expires_at.isoformat(),
        ),
    )

    connection.commit()
    connection.close()

    # ------------------------------------------
    # Development Response
    # ------------------------------------------
    #
    # For now token is returned directly so that
    # we can test password reset functionality.
    #
    # In production this token should be sent
    # through the student's email.
    # ------------------------------------------

    return {
        "success": True,
        "message": "Password reset token generated successfully.",
        "reset_token": reset_token,
        "expires_in_minutes": 15,
    }


# ==========================================
# Student Reset Password
# ==========================================

@router.post("/student/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
):
    token = request.token.strip()
    new_password = request.new_password

    # ------------------------------------------
    # Validate Input
    # ------------------------------------------

    if not token:
        raise HTTPException(
            status_code=400,
            detail="Reset token is required.",
        )

    if not new_password:
        raise HTTPException(
            status_code=400,
            detail="New password is required.",
        )

    if len(new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 6 characters long.",
        )

    if len(new_password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="Password cannot be longer than 72 bytes.",
        )

    connection = get_connection()
    cursor = connection.cursor()

    # ------------------------------------------
    # Find Reset Token
    # ------------------------------------------

    reset_record = cursor.execute(
        """
        SELECT
            id,
            student_id,
            token,
            expires_at,
            used
        FROM password_reset_tokens
        WHERE token = ?
        """,
        (token,),
    ).fetchone()

    if not reset_record:
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="Invalid password reset token.",
        )

    # ------------------------------------------
    # Check If Token Was Already Used
    # ------------------------------------------

    if reset_record["used"] == 1:
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="This password reset token has already been used.",
        )

    # ------------------------------------------
    # Check Token Expiry
    # ------------------------------------------

    try:
        expires_at = datetime.fromisoformat(
            reset_record["expires_at"]
        )
    except ValueError:
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="Invalid reset token expiration.",
        )

    if datetime.utcnow() > expires_at:
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="This password reset token has expired.",
        )

    # ------------------------------------------
    # Hash New Password
    # ------------------------------------------

    password_hash = bcrypt.hashpw(
        new_password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")

    # ------------------------------------------
    # Update Student Password
    # ------------------------------------------

    cursor.execute(
        """
        UPDATE students
        SET password_hash = ?
        WHERE id = ?
        """,
        (
            password_hash,
            reset_record["student_id"],
        ),
    )

    # ------------------------------------------
    # Mark Token As Used
    # ------------------------------------------

    cursor.execute(
        """
        UPDATE password_reset_tokens
        SET used = 1
        WHERE id = ?
        """,
        (reset_record["id"],),
    )

    connection.commit()
    connection.close()

    return {
        "success": True,
        "message": (
            "Password reset successfully. "
            "You can now login with your new password."
        ),
    }


# ==========================================
# Admin Login
# ==========================================

@router.post("/admin/login")
async def login_admin(
    request: AdminLoginRequest,
):
    email = request.email.strip().lower()
    password = request.password

    # ------------------------------------------
    # Validate Input
    # ------------------------------------------

    if not email or not password:
        raise HTTPException(
            status_code=400,
            detail="Email and password are required.",
        )

    connection = get_connection()
    cursor = connection.cursor()

    # ------------------------------------------
    # Find Admin
    # ------------------------------------------

    admin = cursor.execute(
        """
        SELECT
            id,
            full_name,
            email,
            password_hash
        FROM admins
        WHERE email = ?
        """,
        (email,),
    ).fetchone()

    connection.close()

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin email or password.",
        )

    # ------------------------------------------
    # Verify Admin Password
    # ------------------------------------------

    password_valid = bcrypt.checkpw(
        password.encode("utf-8"),
        admin["password_hash"].encode("utf-8"),
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin email or password.",
        )

    # ------------------------------------------
    # Create Admin JWT Token
    # ------------------------------------------

    access_token = create_admin_access_token(
        admin_id=admin["id"],
        email=admin["email"],
    )

    return {
        "success": True,
        "message": "Admin login successful.",
        "access_token": access_token,
        "token_type": "bearer",
        "admin": {
            "id": admin["id"],
            "full_name": admin["full_name"],
            "email": admin["email"],
        },
    }