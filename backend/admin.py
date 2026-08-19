from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import bcrypt

from backend.auth_utils import (
    create_admin_access_token,
    get_current_admin,
)
from backend.database import get_connection


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# ==========================================
# Admin Login Request Model
# ==========================================

class AdminLoginRequest(BaseModel):
    email: str
    password: str


# ==========================================
# Manual Knowledge Information Request Model
# ==========================================

class KnowledgeInformationRequest(BaseModel):
    title: str
    content: str


# ==========================================
# Admin Login
# ==========================================

@router.post("/login")
async def admin_login(
    request: AdminLoginRequest,
):
    email = request.email.strip().lower()
    password = request.password

    # --------------------------------------
    # Validate Input
    # --------------------------------------

    if not email or not password:
        raise HTTPException(
            status_code=400,
            detail="Email and password are required.",
        )

    # --------------------------------------
    # Get Admin From Database
    # --------------------------------------

    connection = get_connection()
    cursor = connection.cursor()

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

    # --------------------------------------
    # Admin Not Found
    # --------------------------------------

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin email or password.",
        )

    # --------------------------------------
    # Verify Password
    # --------------------------------------

    try:
        password_valid = bcrypt.checkpw(
            password.encode("utf-8"),
            admin["password_hash"].encode("utf-8"),
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to verify administrator credentials.",
        )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin email or password.",
        )

    # --------------------------------------
    # Create Admin JWT Token
    # --------------------------------------

    access_token = create_admin_access_token(
        admin_id=admin["id"],
        email=admin["email"],
    )

    # --------------------------------------
    # Response
    # --------------------------------------

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


# ==========================================
# Admin Dashboard Statistics
# ==========================================

@router.get("/dashboard")
async def admin_dashboard(
    current_admin: dict = Depends(
        get_current_admin
    ),
):
    connection = get_connection()
    cursor = connection.cursor()

    # --------------------------------------
    # Total Students
    # --------------------------------------

    total_students = cursor.execute(
        """
        SELECT COUNT(*) AS count
        FROM students
        """
    ).fetchone()["count"]

    # --------------------------------------
    # Total Knowledge Documents
    # --------------------------------------

    total_documents = cursor.execute(
        """
        SELECT COUNT(*) AS count
        FROM knowledge_documents
        """
    ).fetchone()["count"]

    # --------------------------------------
    # Total Questions
    # --------------------------------------

    total_questions = cursor.execute(
        """
        SELECT COUNT(*) AS count
        FROM chat_history
        WHERE question IS NOT NULL
        """
    ).fetchone()["count"]

    # --------------------------------------
    # Knowledge Chunks
    # --------------------------------------

    knowledge_chunks = total_documents

    connection.close()

    return {
        "success": True,
        "admin": {
            "id": current_admin["admin_id"],
            "email": current_admin["email"],
            "role": current_admin["role"],
        },
        "statistics": {
            "total_documents": total_documents,
            "knowledge_chunks": knowledge_chunks,
            "students": total_students,
            "questions_asked": total_questions,
        },
    }


# ==========================================
# Get All Knowledge Documents
# ==========================================

@router.get("/documents")
async def get_documents(
    current_admin: dict = Depends(
        get_current_admin
    ),
):
    connection = get_connection()
    cursor = connection.cursor()

    documents = cursor.execute(
        """
        SELECT
            id,
            title,
            file_name,
            file_type,
            created_at
        FROM knowledge_documents
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    return {
        "success": True,
        "count": len(documents),
        "documents": [
            {
                "id": document["id"],
                "title": document["title"],
                "file_name": document["file_name"],
                "file_type": document["file_type"],
                "created_at": document["created_at"],
            }
            for document in documents
        ],
    }


# ==========================================
# Get All Students
# ==========================================

@router.get("/students")
async def get_students(
    current_admin: dict = Depends(
        get_current_admin
    ),
):
    connection = get_connection()
    cursor = connection.cursor()

    students = cursor.execute(
        """
        SELECT
            id,
            full_name,
            email,
            created_at
        FROM students
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    return {
        "success": True,
        "count": len(students),
        "students": [
            {
                "id": student["id"],
                "full_name": student["full_name"],
                "email": student["email"],
                "created_at": student["created_at"],
            }
            for student in students
        ],
    }


# ==========================================
# Add Manual Knowledge Information
# ==========================================

@router.post("/information")
async def add_knowledge_information(
    request: KnowledgeInformationRequest,
    current_admin: dict = Depends(
        get_current_admin
    ),
):
    # --------------------------------------
    # Clean Input
    # --------------------------------------

    title = request.title.strip()
    content = request.content.strip()

    # --------------------------------------
    # Validate Title
    # --------------------------------------

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Title is required.",
        )

    # --------------------------------------
    # Validate Content
    # --------------------------------------

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Information content is required.",
        )

    # --------------------------------------
    # Save Information
    # --------------------------------------

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO knowledge_documents (
                title,
                file_name,
                file_type,
                content
            )
            VALUES (?, ?, ?, ?)
            """,
            (
                title,
                title,
                "text",
                content,
            ),
        )

        connection.commit()

        document_id = cursor.lastrowid

        return {
            "success": True,
            "message": "Information added successfully.",
            "document": {
                "id": document_id,
                "title": title,
                "file_name": title,
                "file_type": "text",
                "characters": len(content),
            },
        }

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Information saving failed: {str(error)}",
        )

    finally:
        connection.close()


# ==========================================
# Delete Knowledge Document
# ==========================================

@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: int,
    current_admin: dict = Depends(
        get_current_admin
    ),
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        # --------------------------------------
        # Find Document
        # --------------------------------------

        document = cursor.execute(
            """
            SELECT
                id,
                file_name
            FROM knowledge_documents
            WHERE id = ?
            """,
            (document_id,),
        ).fetchone()

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Knowledge document not found.",
            )

        # --------------------------------------
        # Delete Database Record
        # --------------------------------------

        cursor.execute(
            """
            DELETE FROM knowledge_documents
            WHERE id = ?
            """,
            (document_id,),
        )

        connection.commit()

        # --------------------------------------
        # Delete Physical File
        # --------------------------------------

        file_path = (
            Path("data")
            / document["file_name"]
        )

        if file_path.exists():
            file_path.unlink()

        # --------------------------------------
        # Response
        # --------------------------------------

        return {
            "success": True,
            "message": (
                "Knowledge document deleted successfully."
            ),
            "document_id": document_id,
        }

    except HTTPException:
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                f"Document deletion failed: {str(error)}"
            ),
        )

    finally:
        connection.close()