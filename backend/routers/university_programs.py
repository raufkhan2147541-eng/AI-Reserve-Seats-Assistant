from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from database import get_connection


router = APIRouter(
    prefix="/university-programs",
    tags=["University Programs"],
)


# ==========================================
# Program Create Request
# ==========================================

class ProgramCreateRequest(BaseModel):
    university_id: int

    program_name: str = Field(
        ...,
        min_length=2,
    )

    degree_level: Optional[str] = None
    department: Optional[str] = None
    campus: Optional[str] = None
    duration: Optional[str] = None
    study_mode: Optional[str] = None
    eligibility: Optional[str] = None

    entry_test_required: bool = False

    admission_status: Optional[str] = None
    academic_session: Optional[str] = None
    source_url: Optional[str] = None


# ==========================================
# Program Update Request
# ==========================================

class ProgramUpdateRequest(BaseModel):
    program_name: Optional[str] = None
    degree_level: Optional[str] = None
    department: Optional[str] = None
    campus: Optional[str] = None
    duration: Optional[str] = None
    study_mode: Optional[str] = None
    eligibility: Optional[str] = None

    entry_test_required: Optional[bool] = None

    admission_status: Optional[str] = None
    academic_session: Optional[str] = None
    source_url: Optional[str] = None


# ==========================================
# Create University Program
# ==========================================

@router.post("/")
async def create_program(
    request: ProgramCreateRequest,
):
    program_name = request.program_name.strip()

    if not program_name:
        raise HTTPException(
            status_code=400,
            detail="Program name is required.",
        )

    connection = get_connection()
    cursor = connection.cursor()

    # --------------------------------------
    # Check University
    # --------------------------------------

    university = cursor.execute(
        """
        SELECT id, name
        FROM universities
        WHERE id = ?
        """,
        (request.university_id,),
    ).fetchone()

    if not university:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="University not found.",
        )

    # --------------------------------------
    # Check Duplicate Program
    # --------------------------------------

    existing = cursor.execute(
        """
        SELECT id
        FROM university_programs
        WHERE university_id = ?
        AND LOWER(program_name) = LOWER(?)
        """,
        (
            request.university_id,
            program_name,
        ),
    ).fetchone()

    if existing:
        connection.close()

        raise HTTPException(
            status_code=409,
            detail=(
                "This program already exists "
                "for this university."
            ),
        )

    # --------------------------------------
    # Insert Program
    # --------------------------------------

    cursor.execute(
        """
        INSERT INTO university_programs (
            university_id,
            program_name,
            degree_level,
            department,
            campus,
            duration,
            study_mode,
            eligibility,
            entry_test_required,
            admission_status,
            academic_session,
            source_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            request.university_id,
            program_name,
            request.degree_level,
            request.department,
            request.campus,
            request.duration,
            request.study_mode,
            request.eligibility,
            int(request.entry_test_required),
            request.admission_status,
            request.academic_session,
            request.source_url,
        ),
    )

    connection.commit()

    program_id = cursor.lastrowid

    # --------------------------------------
    # Get Created Program
    # --------------------------------------

    program = cursor.execute(
        """
        SELECT
            p.*,
            u.name AS university_name
        FROM university_programs p
        INNER JOIN universities u
            ON p.university_id = u.id
        WHERE p.id = ?
        """,
        (program_id,),
    ).fetchone()

    connection.close()

    return {
        "success": True,
        "message": "University program added successfully.",
        "program": dict(program),
    }


# ==========================================
# Get All Programs
# ==========================================

@router.get("/")
async def get_programs():
    connection = get_connection()
    cursor = connection.cursor()

    programs = cursor.execute(
        """
        SELECT
            p.*,
            u.name AS university_name
        FROM university_programs p
        INNER JOIN universities u
            ON p.university_id = u.id
        ORDER BY
            u.name ASC,
            p.program_name ASC
        """
    ).fetchall()

    connection.close()

    return {
        "success": True,
        "count": len(programs),
        "programs": [
            dict(program)
            for program in programs
        ],
    }


# ==========================================
# Get Programs By University
# ==========================================

@router.get("/university/{university_id}")
async def get_university_programs(
    university_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    # --------------------------------------
    # Check University
    # --------------------------------------

    university = cursor.execute(
        """
        SELECT id, name
        FROM universities
        WHERE id = ?
        """,
        (university_id,),
    ).fetchone()

    if not university:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="University not found.",
        )

    # --------------------------------------
    # Get Programs
    # --------------------------------------

    programs = cursor.execute(
        """
        SELECT *
        FROM university_programs
        WHERE university_id = ?
        ORDER BY program_name ASC
        """,
        (university_id,),
    ).fetchall()

    connection.close()

    return {
        "success": True,
        "university": dict(university),
        "count": len(programs),
        "programs": [
            dict(program)
            for program in programs
        ],
    }


# ==========================================
# Get Single Program
# ==========================================

@router.get("/{program_id}")
async def get_program(
    program_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    program = cursor.execute(
        """
        SELECT
            p.*,
            u.name AS university_name
        FROM university_programs p
        INNER JOIN universities u
            ON p.university_id = u.id
        WHERE p.id = ?
        """,
        (program_id,),
    ).fetchone()

    connection.close()

    if not program:
        raise HTTPException(
            status_code=404,
            detail="University program not found.",
        )

    return {
        "success": True,
        "program": dict(program),
    }


# ==========================================
# Update University Program
# ==========================================

@router.put("/{program_id}")
async def update_program(
    program_id: int,
    request: ProgramUpdateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    # --------------------------------------
    # Get Existing Program
    # --------------------------------------

    existing = cursor.execute(
        """
        SELECT *
        FROM university_programs
        WHERE id = ?
        """,
        (program_id,),
    ).fetchone()

    if not existing:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="University program not found.",
        )

    # --------------------------------------
    # Prepare Updated Values
    # --------------------------------------

    program_name = (
        request.program_name.strip()
        if request.program_name is not None
        else existing["program_name"]
    )

    if not program_name:
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="Program name cannot be empty.",
        )

    degree_level = (
        request.degree_level
        if request.degree_level is not None
        else existing["degree_level"]
    )

    department = (
        request.department
        if request.department is not None
        else existing["department"]
    )

    campus = (
        request.campus
        if request.campus is not None
        else existing["campus"]
    )

    duration = (
        request.duration
        if request.duration is not None
        else existing["duration"]
    )

    study_mode = (
        request.study_mode
        if request.study_mode is not None
        else existing["study_mode"]
    )

    eligibility = (
        request.eligibility
        if request.eligibility is not None
        else existing["eligibility"]
    )

    entry_test_required = (
        int(request.entry_test_required)
        if request.entry_test_required is not None
        else existing["entry_test_required"]
    )

    admission_status = (
        request.admission_status
        if request.admission_status is not None
        else existing["admission_status"]
    )

    academic_session = (
        request.academic_session
        if request.academic_session is not None
        else existing["academic_session"]
    )

    source_url = (
        request.source_url
        if request.source_url is not None
        else existing["source_url"]
    )

    # --------------------------------------
    # Check Duplicate Program
    # --------------------------------------

    duplicate = cursor.execute(
        """
        SELECT id
        FROM university_programs
        WHERE university_id = ?
        AND LOWER(program_name) = LOWER(?)
        AND id != ?
        """,
        (
            existing["university_id"],
            program_name,
            program_id,
        ),
    ).fetchone()

    if duplicate:
        connection.close()

        raise HTTPException(
            status_code=409,
            detail=(
                "Another program with this name "
                "already exists for this university."
            ),
        )

    # --------------------------------------
    # Update Program
    # --------------------------------------

    cursor.execute(
        """
        UPDATE university_programs
        SET
            program_name = ?,
            degree_level = ?,
            department = ?,
            campus = ?,
            duration = ?,
            study_mode = ?,
            eligibility = ?,
            entry_test_required = ?,
            admission_status = ?,
            academic_session = ?,
            source_url = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        """,
        (
            program_name,
            degree_level,
            department,
            campus,
            duration,
            study_mode,
            eligibility,
            entry_test_required,
            admission_status,
            academic_session,
            source_url,
            program_id,
        ),
    )

    connection.commit()

    # --------------------------------------
    # Get Updated Program
    # --------------------------------------

    updated_program = cursor.execute(
        """
        SELECT
            p.*,
            u.name AS university_name
        FROM university_programs p
        INNER JOIN universities u
            ON p.university_id = u.id
        WHERE p.id = ?
        """,
        (program_id,),
    ).fetchone()

    connection.close()

    return {
        "success": True,
        "message": "University program updated successfully.",
        "program": dict(updated_program),
    }


# ==========================================
# Delete University Program
# ==========================================

@router.delete("/{program_id}")
async def delete_program(
    program_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    existing = cursor.execute(
        """
        SELECT id, program_name
        FROM university_programs
        WHERE id = ?
        """,
        (program_id,),
    ).fetchone()

    if not existing:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="University program not found.",
        )

    cursor.execute(
        """
        DELETE FROM university_programs
        WHERE id = ?
        """,
        (program_id,),
    )

    connection.commit()

    connection.close()

    return {
        "success": True,
        "message": "University program deleted successfully.",
        "program_id": program_id,
        "program_name": existing["program_name"],
    }