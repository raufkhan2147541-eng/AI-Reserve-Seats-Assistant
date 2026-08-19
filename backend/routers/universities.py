from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from backend.database import get_connection


router = APIRouter(
    prefix="/universities",
    tags=["Universities"],
)


# ============================================================
# UNIVERSITY MODELS
# ============================================================

class UniversityCreateRequest(BaseModel):
    name: str = Field(..., min_length=2)

    university_type: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    campus: Optional[str] = None

    official_website: Optional[str] = None
    admission_portal: Optional[str] = None

    hec_recognized: bool = False
    hec_recognition_source: Optional[str] = None

    description: Optional[str] = None
    academic_session: Optional[str] = None


class UniversityUpdateRequest(BaseModel):
    name: Optional[str] = None

    university_type: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    campus: Optional[str] = None

    official_website: Optional[str] = None
    admission_portal: Optional[str] = None

    hec_recognized: Optional[bool] = None
    hec_recognition_source: Optional[str] = None

    description: Optional[str] = None
    academic_session: Optional[str] = None
    is_active: Optional[bool] = None


# ============================================================
# PROGRAM MODELS
# ============================================================

class ProgramCreateRequest(BaseModel):
    university_id: int

    program_name: str = Field(..., min_length=2)

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
    last_verified: Optional[str] = None


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
    last_verified: Optional[str] = None


# ============================================================
# FEE MODELS
# ============================================================

class FeeCreateRequest(BaseModel):
    university_id: int
    program_id: Optional[int] = None

    program_name: Optional[str] = None

    admission_fee: Optional[float] = None
    tuition_fee: Optional[float] = None
    semester_fee: Optional[float] = None
    examination_fee: Optional[float] = None
    hostel_fee: Optional[float] = None
    transport_fee: Optional[float] = None
    other_fee: Optional[float] = None

    total_fee: Optional[float] = None

    fee_frequency: Optional[str] = None
    academic_session: Optional[str] = None

    currency: str = "PKR"

    source_url: Optional[str] = None
    last_verified: Optional[str] = None


class FeeUpdateRequest(BaseModel):
    program_id: Optional[int] = None
    program_name: Optional[str] = None

    admission_fee: Optional[float] = None
    tuition_fee: Optional[float] = None
    semester_fee: Optional[float] = None
    examination_fee: Optional[float] = None
    hostel_fee: Optional[float] = None
    transport_fee: Optional[float] = None
    other_fee: Optional[float] = None

    total_fee: Optional[float] = None

    fee_frequency: Optional[str] = None
    academic_session: Optional[str] = None

    currency: Optional[str] = None

    source_url: Optional[str] = None
    last_verified: Optional[str] = None


# ============================================================
# DEADLINE MODELS
# ============================================================

class DeadlineCreateRequest(BaseModel):
    university_id: int
    program_id: Optional[int] = None

    admission_title: Optional[str] = None
    admission_session: Optional[str] = None

    application_open_date: Optional[str] = None
    application_deadline: Optional[str] = None

    entry_test_date: Optional[str] = None
    interview_date: Optional[str] = None

    merit_list_date: Optional[str] = None
    fee_submission_deadline: Optional[str] = None

    admission_status: Optional[str] = None

    source_url: Optional[str] = None
    last_verified: Optional[str] = None


class DeadlineUpdateRequest(BaseModel):
    program_id: Optional[int] = None

    admission_title: Optional[str] = None
    admission_session: Optional[str] = None

    application_open_date: Optional[str] = None
    application_deadline: Optional[str] = None

    entry_test_date: Optional[str] = None
    interview_date: Optional[str] = None

    merit_list_date: Optional[str] = None
    fee_submission_deadline: Optional[str] = None

    admission_status: Optional[str] = None

    source_url: Optional[str] = None
    last_verified: Optional[str] = None


# ============================================================
# REQUIREMENT MODELS
# ============================================================

class RequirementCreateRequest(BaseModel):
    university_id: int
    program_id: Optional[int] = None

    requirement_type: Optional[str] = None
    requirement_title: Optional[str] = None
    requirement_description: Optional[str] = None

    minimum_percentage: Optional[float] = None

    required_subjects: Optional[str] = None
    required_documents: Optional[str] = None

    domicile_required: bool = False
    entry_test_required: bool = False

    source_url: Optional[str] = None
    last_verified: Optional[str] = None


class RequirementUpdateRequest(BaseModel):
    program_id: Optional[int] = None

    requirement_type: Optional[str] = None
    requirement_title: Optional[str] = None
    requirement_description: Optional[str] = None

    minimum_percentage: Optional[float] = None

    required_subjects: Optional[str] = None
    required_documents: Optional[str] = None

    domicile_required: Optional[bool] = None
    entry_test_required: Optional[bool] = None

    source_url: Optional[str] = None
    last_verified: Optional[str] = None


# ============================================================
# SOURCE MODELS
# ============================================================

class SourceCreateRequest(BaseModel):
    university_id: int

    source_title: str = Field(..., min_length=2)
    source_url: str = Field(..., min_length=5)

    source_type: Optional[str] = None
    academic_session: Optional[str] = None

    verification_status: str = "pending"

    last_checked: Optional[str] = None
    notes: Optional[str] = None


class SourceUpdateRequest(BaseModel):
    source_title: Optional[str] = None
    source_url: Optional[str] = None

    source_type: Optional[str] = None
    academic_session: Optional[str] = None

    verification_status: Optional[str] = None

    last_checked: Optional[str] = None
    notes: Optional[str] = None


# ============================================================
# CREATE UNIVERSITY
# ============================================================

@router.post("/")
async def create_university(
    request: UniversityCreateRequest,
):
    name = request.name.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="University name is required.",
        )

    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE LOWER(name) = LOWER(?)
            """,
            (name,),
        ).fetchone()

        if existing:
            raise HTTPException(
                status_code=409,
                detail="This university already exists.",
            )

        cursor.execute(
            """
            INSERT INTO universities (
                name,
                university_type,
                province,
                city,
                campus,
                official_website,
                admission_portal,
                hec_recognized,
                hec_recognition_source,
                description,
                academic_session
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                name,
                request.university_type,
                request.province,
                request.city,
                request.campus,
                request.official_website,
                request.admission_portal,
                int(request.hec_recognized),
                request.hec_recognition_source,
                request.description,
                request.academic_session,
            ),
        )

        connection.commit()

        university_id = cursor.lastrowid

        university = cursor.execute(
            """
            SELECT *
            FROM universities
            WHERE id = ?
            """,
            (university_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "University added successfully.",
            "university": dict(university),
        }

    finally:
        connection.close()


# ============================================================
# SEARCH UNIVERSITIES
# ============================================================

@router.get("/search")
async def search_universities(
    query: str = "",
    province: Optional[str] = None,
    city: Optional[str] = None,
    university_type: Optional[str] = None,
):
    query = query.strip()

    connection = get_connection()
    cursor = connection.cursor()

    try:
        sql = """
            SELECT *
            FROM universities
            WHERE is_active = 1
        """

        parameters = []

        if query:
            sql += """
                AND (
                    LOWER(name) LIKE LOWER(?)
                    OR LOWER(city) LIKE LOWER(?)
                    OR LOWER(province) LIKE LOWER(?)
                )
            """

            search_value = f"%{query}%"

            parameters.extend(
                [
                    search_value,
                    search_value,
                    search_value,
                ]
            )

        if province:
            sql += """
                AND LOWER(province) = LOWER(?)
            """
            parameters.append(province.strip())

        if city:
            sql += """
                AND LOWER(city) = LOWER(?)
            """
            parameters.append(city.strip())

        if university_type:
            sql += """
                AND LOWER(university_type) = LOWER(?)
            """
            parameters.append(university_type.strip())

        sql += """
            ORDER BY name ASC
        """

        universities = cursor.execute(
            sql,
            parameters,
        ).fetchall()

        return {
            "success": True,
            "count": len(universities),
            "universities": [
                dict(university)
                for university in universities
            ],
        }

    finally:
        connection.close()


# ============================================================
# GET ALL UNIVERSITIES
# ============================================================

@router.get("/")
async def get_universities():
    connection = get_connection()
    cursor = connection.cursor()

    try:
        universities = cursor.execute(
            """
            SELECT *
            FROM universities
            WHERE is_active = 1
            ORDER BY name ASC
            """
        ).fetchall()

        return {
            "success": True,
            "count": len(universities),
            "universities": [
                dict(university)
                for university in universities
            ],
        }

    finally:
        connection.close()


# ============================================================
# GET COMPLETE UNIVERSITY PROFILE
# ============================================================

@router.get("/{university_id}/details")
async def get_university_details(
    university_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT *
            FROM universities
            WHERE id = ?
            """,
            (university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        programs = cursor.execute(
            """
            SELECT *
            FROM university_programs
            WHERE university_id = ?
            ORDER BY program_name ASC
            """,
            (university_id,),
        ).fetchall()

        fees = cursor.execute(
            """
            SELECT *
            FROM university_fee_structures
            WHERE university_id = ?
            ORDER BY program_name ASC
            """,
            (university_id,),
        ).fetchall()

        deadlines = cursor.execute(
            """
            SELECT *
            FROM admission_deadlines
            WHERE university_id = ?
            ORDER BY application_deadline ASC
            """,
            (university_id,),
        ).fetchall()

        requirements = cursor.execute(
            """
            SELECT *
            FROM admission_requirements
            WHERE university_id = ?
            ORDER BY requirement_title ASC
            """,
            (university_id,),
        ).fetchall()

        sources = cursor.execute(
            """
            SELECT *
            FROM university_sources
            WHERE university_id = ?
            ORDER BY last_checked DESC
            """,
            (university_id,),
        ).fetchall()

        return {
            "success": True,
            "university": dict(university),
            "programs": [dict(item) for item in programs],
            "fees": [dict(item) for item in fees],
            "deadlines": [dict(item) for item in deadlines],
            "requirements": [dict(item) for item in requirements],
            "sources": [dict(item) for item in sources],
        }

    finally:
        connection.close()


# ============================================================
# GET SINGLE UNIVERSITY
# ============================================================

@router.get("/{university_id}")
async def get_university(
    university_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT *
            FROM universities
            WHERE id = ?
            """,
            (university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        return {
            "success": True,
            "university": dict(university),
        }

    finally:
        connection.close()


# ============================================================
# UPDATE UNIVERSITY
# ============================================================

@router.put("/{university_id}")
async def update_university(
    university_id: int,
    request: UniversityUpdateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT *
            FROM universities
            WHERE id = ?
            """,
            (university_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        name = (
            request.name.strip()
            if request.name is not None
            else existing["name"]
        )

        if not name:
            raise HTTPException(
                status_code=400,
                detail="University name cannot be empty.",
            )

        duplicate = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE LOWER(name) = LOWER(?)
            AND id != ?
            """,
            (
                name,
                university_id,
            ),
        ).fetchone()

        if duplicate:
            raise HTTPException(
                status_code=409,
                detail="Another university with this name already exists.",
            )

        cursor.execute(
            """
            UPDATE universities
            SET
                name = ?,
                university_type = ?,
                province = ?,
                city = ?,
                campus = ?,
                official_website = ?,
                admission_portal = ?,
                hec_recognized = ?,
                hec_recognition_source = ?,
                description = ?,
                academic_session = ?,
                is_active = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (
                name,
                request.university_type
                if request.university_type is not None
                else existing["university_type"],
                request.province
                if request.province is not None
                else existing["province"],
                request.city
                if request.city is not None
                else existing["city"],
                request.campus
                if request.campus is not None
                else existing["campus"],
                request.official_website
                if request.official_website is not None
                else existing["official_website"],
                request.admission_portal
                if request.admission_portal is not None
                else existing["admission_portal"],
                int(request.hec_recognized)
                if request.hec_recognized is not None
                else existing["hec_recognized"],
                request.hec_recognition_source
                if request.hec_recognition_source is not None
                else existing["hec_recognition_source"],
                request.description
                if request.description is not None
                else existing["description"],
                request.academic_session
                if request.academic_session is not None
                else existing["academic_session"],
                int(request.is_active)
                if request.is_active is not None
                else existing["is_active"],
                university_id,
            ),
        )

        connection.commit()

        updated = cursor.execute(
            """
            SELECT *
            FROM universities
            WHERE id = ?
            """,
            (university_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "University updated successfully.",
            "university": dict(updated),
        }

    finally:
        connection.close()


# ============================================================
# DELETE UNIVERSITY
# ============================================================

@router.delete("/{university_id}")
async def delete_university(
    university_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT id, name
            FROM universities
            WHERE id = ?
            """,
            (university_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        cursor.execute(
            """
            DELETE FROM universities
            WHERE id = ?
            """,
            (university_id,),
        )

        connection.commit()

        return {
            "success": True,
            "message": "University deleted successfully.",
            "university_id": university_id,
        }

    finally:
        connection.close()


# ============================================================
# CREATE PROGRAM
# ============================================================

@router.post("/programs")
async def create_program(
    request: ProgramCreateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE id = ?
            """,
            (request.university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        program_name = request.program_name.strip()

        if not program_name:
            raise HTTPException(
                status_code=400,
                detail="Program name is required.",
            )

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
                source_url,
                last_verified
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                request.last_verified,
            ),
        )

        connection.commit()

        program_id = cursor.lastrowid

        program = cursor.execute(
            """
            SELECT *
            FROM university_programs
            WHERE id = ?
            """,
            (program_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "University program added successfully.",
            "program": dict(program),
        }

    finally:
        connection.close()


# ============================================================
# GET UNIVERSITY PROGRAMS
# ============================================================

@router.get("/{university_id}/programs")
async def get_university_programs(
    university_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE id = ?
            """,
            (university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        programs = cursor.execute(
            """
            SELECT *
            FROM university_programs
            WHERE university_id = ?
            ORDER BY program_name ASC
            """,
            (university_id,),
        ).fetchall()

        return {
            "success": True,
            "count": len(programs),
            "programs": [
                dict(program)
                for program in programs
            ],
        }

    finally:
        connection.close()


# ============================================================
# UPDATE PROGRAM
# ============================================================

@router.put("/programs/{program_id}")
async def update_program(
    program_id: int,
    request: ProgramUpdateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT *
            FROM university_programs
            WHERE id = ?
            """,
            (program_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Program not found.",
            )

        program_name = (
            request.program_name.strip()
            if request.program_name is not None
            else existing["program_name"]
        )

        if not program_name:
            raise HTTPException(
                status_code=400,
                detail="Program name cannot be empty.",
            )

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
                last_verified = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (
                program_name,
                request.degree_level
                if request.degree_level is not None
                else existing["degree_level"],
                request.department
                if request.department is not None
                else existing["department"],
                request.campus
                if request.campus is not None
                else existing["campus"],
                request.duration
                if request.duration is not None
                else existing["duration"],
                request.study_mode
                if request.study_mode is not None
                else existing["study_mode"],
                request.eligibility
                if request.eligibility is not None
                else existing["eligibility"],
                int(request.entry_test_required)
                if request.entry_test_required is not None
                else existing["entry_test_required"],
                request.admission_status
                if request.admission_status is not None
                else existing["admission_status"],
                request.academic_session
                if request.academic_session is not None
                else existing["academic_session"],
                request.source_url
                if request.source_url is not None
                else existing["source_url"],
                request.last_verified
                if request.last_verified is not None
                else existing["last_verified"],
                program_id,
            ),
        )

        connection.commit()

        updated = cursor.execute(
            """
            SELECT *
            FROM university_programs
            WHERE id = ?
            """,
            (program_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "Program updated successfully.",
            "program": dict(updated),
        }

    finally:
        connection.close()


# ============================================================
# DELETE PROGRAM
# ============================================================

@router.delete("/programs/{program_id}")
async def delete_program(
    program_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT id
            FROM university_programs
            WHERE id = ?
            """,
            (program_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Program not found.",
            )

        cursor.execute(
            """
            DELETE FROM university_programs
            WHERE id = ?
            """,
            (program_id,),
        )

        connection.commit()

        return {
            "success": True,
            "message": "Program deleted successfully.",
        }

    finally:
        connection.close()


# ============================================================
# CREATE FEE STRUCTURE
# ============================================================

@router.post("/fees")
async def create_fee(
    request: FeeCreateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE id = ?
            """,
            (request.university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        if request.program_id is not None:
            program = cursor.execute(
                """
                SELECT id
                FROM university_programs
                WHERE id = ?
                AND university_id = ?
                """,
                (
                    request.program_id,
                    request.university_id,
                ),
            ).fetchone()

            if not program:
                raise HTTPException(
                    status_code=404,
                    detail="Program not found for this university.",
                )

        cursor.execute(
            """
            INSERT INTO university_fee_structures (
                university_id,
                program_id,
                program_name,
                admission_fee,
                tuition_fee,
                semester_fee,
                examination_fee,
                hostel_fee,
                transport_fee,
                other_fee,
                total_fee,
                fee_frequency,
                academic_session,
                currency,
                source_url,
                last_verified
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                request.university_id,
                request.program_id,
                request.program_name,
                request.admission_fee,
                request.tuition_fee,
                request.semester_fee,
                request.examination_fee,
                request.hostel_fee,
                request.transport_fee,
                request.other_fee,
                request.total_fee,
                request.fee_frequency,
                request.academic_session,
                request.currency,
                request.source_url,
                request.last_verified,
            ),
        )

        connection.commit()

        fee_id = cursor.lastrowid

        fee = cursor.execute(
            """
            SELECT *
            FROM university_fee_structures
            WHERE id = ?
            """,
            (fee_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "Fee structure added successfully.",
            "fee": dict(fee),
        }

    finally:
        connection.close()


# ============================================================
# GET UNIVERSITY FEES
# ============================================================

@router.get("/{university_id}/fees")
async def get_university_fees(
    university_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE id = ?
            """,
            (university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        fees = cursor.execute(
            """
            SELECT *
            FROM university_fee_structures
            WHERE university_id = ?
            ORDER BY program_name ASC
            """,
            (university_id,),
        ).fetchall()

        return {
            "success": True,
            "count": len(fees),
            "fees": [
                dict(fee)
                for fee in fees
            ],
        }

    finally:
        connection.close()


# ============================================================
# UPDATE FEE STRUCTURE
# ============================================================

@router.put("/fees/{fee_id}")
async def update_fee(
    fee_id: int,
    request: FeeUpdateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT *
            FROM university_fee_structures
            WHERE id = ?
            """,
            (fee_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Fee structure not found.",
            )

        program_id = (
            request.program_id
            if request.program_id is not None
            else existing["program_id"]
        )

        if program_id is not None:
            program = cursor.execute(
                """
                SELECT id
                FROM university_programs
                WHERE id = ?
                AND university_id = ?
                """,
                (
                    program_id,
                    existing["university_id"],
                ),
            ).fetchone()

            if not program:
                raise HTTPException(
                    status_code=404,
                    detail="Program not found for this university.",
                )

        cursor.execute(
            """
            UPDATE university_fee_structures
            SET
                program_id = ?,
                program_name = ?,
                admission_fee = ?,
                tuition_fee = ?,
                semester_fee = ?,
                examination_fee = ?,
                hostel_fee = ?,
                transport_fee = ?,
                other_fee = ?,
                total_fee = ?,
                fee_frequency = ?,
                academic_session = ?,
                currency = ?,
                source_url = ?,
                last_verified = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (
                program_id,
                request.program_name
                if request.program_name is not None
                else existing["program_name"],
                request.admission_fee
                if request.admission_fee is not None
                else existing["admission_fee"],
                request.tuition_fee
                if request.tuition_fee is not None
                else existing["tuition_fee"],
                request.semester_fee
                if request.semester_fee is not None
                else existing["semester_fee"],
                request.examination_fee
                if request.examination_fee is not None
                else existing["examination_fee"],
                request.hostel_fee
                if request.hostel_fee is not None
                else existing["hostel_fee"],
                request.transport_fee
                if request.transport_fee is not None
                else existing["transport_fee"],
                request.other_fee
                if request.other_fee is not None
                else existing["other_fee"],
                request.total_fee
                if request.total_fee is not None
                else existing["total_fee"],
                request.fee_frequency
                if request.fee_frequency is not None
                else existing["fee_frequency"],
                request.academic_session
                if request.academic_session is not None
                else existing["academic_session"],
                request.currency
                if request.currency is not None
                else existing["currency"],
                request.source_url
                if request.source_url is not None
                else existing["source_url"],
                request.last_verified
                if request.last_verified is not None
                else existing["last_verified"],
                fee_id,
            ),
        )

        connection.commit()

        updated = cursor.execute(
            """
            SELECT *
            FROM university_fee_structures
            WHERE id = ?
            """,
            (fee_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "Fee structure updated successfully.",
            "fee": dict(updated),
        }

    finally:
        connection.close()


# ============================================================
# DELETE FEE STRUCTURE
# ============================================================

@router.delete("/fees/{fee_id}")
async def delete_fee(
    fee_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT id
            FROM university_fee_structures
            WHERE id = ?
            """,
            (fee_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Fee structure not found.",
            )

        cursor.execute(
            """
            DELETE FROM university_fee_structures
            WHERE id = ?
            """,
            (fee_id,),
        )

        connection.commit()

        return {
            "success": True,
            "message": "Fee structure deleted successfully.",
        }

    finally:
        connection.close()


# ============================================================
# CREATE ADMISSION DEADLINE
# ============================================================

@router.post("/deadlines")
async def create_deadline(
    request: DeadlineCreateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE id = ?
            """,
            (request.university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        if request.program_id is not None:
            program = cursor.execute(
                """
                SELECT id
                FROM university_programs
                WHERE id = ?
                AND university_id = ?
                """,
                (
                    request.program_id,
                    request.university_id,
                ),
            ).fetchone()

            if not program:
                raise HTTPException(
                    status_code=404,
                    detail="Program not found for this university.",
                )

        cursor.execute(
            """
            INSERT INTO admission_deadlines (
                university_id,
                program_id,
                admission_title,
                admission_session,
                application_open_date,
                application_deadline,
                entry_test_date,
                interview_date,
                merit_list_date,
                fee_submission_deadline,
                admission_status,
                source_url,
                last_verified
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                request.university_id,
                request.program_id,
                request.admission_title,
                request.admission_session,
                request.application_open_date,
                request.application_deadline,
                request.entry_test_date,
                request.interview_date,
                request.merit_list_date,
                request.fee_submission_deadline,
                request.admission_status,
                request.source_url,
                request.last_verified,
            ),
        )

        connection.commit()

        deadline_id = cursor.lastrowid

        deadline = cursor.execute(
            """
            SELECT *
            FROM admission_deadlines
            WHERE id = ?
            """,
            (deadline_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "Admission deadline added successfully.",
            "deadline": dict(deadline),
        }

    finally:
        connection.close()


# ============================================================
# GET UNIVERSITY DEADLINES
# ============================================================

@router.get("/{university_id}/deadlines")
async def get_university_deadlines(
    university_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE id = ?
            """,
            (university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        deadlines = cursor.execute(
            """
            SELECT *
            FROM admission_deadlines
            WHERE university_id = ?
            ORDER BY application_deadline ASC
            """,
            (university_id,),
        ).fetchall()

        return {
            "success": True,
            "count": len(deadlines),
            "deadlines": [
                dict(item)
                for item in deadlines
            ],
        }

    finally:
        connection.close()


# ============================================================
# UPDATE ADMISSION DEADLINE
# ============================================================

@router.put("/deadlines/{deadline_id}")
async def update_deadline(
    deadline_id: int,
    request: DeadlineUpdateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT *
            FROM admission_deadlines
            WHERE id = ?
            """,
            (deadline_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Admission deadline not found.",
            )

        program_id = (
            request.program_id
            if request.program_id is not None
            else existing["program_id"]
        )

        if program_id is not None:
            program = cursor.execute(
                """
                SELECT id
                FROM university_programs
                WHERE id = ?
                AND university_id = ?
                """,
                (
                    program_id,
                    existing["university_id"],
                ),
            ).fetchone()

            if not program:
                raise HTTPException(
                    status_code=404,
                    detail="Program not found for this university.",
                )

        cursor.execute(
            """
            UPDATE admission_deadlines
            SET
                program_id = ?,
                admission_title = ?,
                admission_session = ?,
                application_open_date = ?,
                application_deadline = ?,
                entry_test_date = ?,
                interview_date = ?,
                merit_list_date = ?,
                fee_submission_deadline = ?,
                admission_status = ?,
                source_url = ?,
                last_verified = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (
                program_id,
                request.admission_title
                if request.admission_title is not None
                else existing["admission_title"],
                request.admission_session
                if request.admission_session is not None
                else existing["admission_session"],
                request.application_open_date
                if request.application_open_date is not None
                else existing["application_open_date"],
                request.application_deadline
                if request.application_deadline is not None
                else existing["application_deadline"],
                request.entry_test_date
                if request.entry_test_date is not None
                else existing["entry_test_date"],
                request.interview_date
                if request.interview_date is not None
                else existing["interview_date"],
                request.merit_list_date
                if request.merit_list_date is not None
                else existing["merit_list_date"],
                request.fee_submission_deadline
                if request.fee_submission_deadline is not None
                else existing["fee_submission_deadline"],
                request.admission_status
                if request.admission_status is not None
                else existing["admission_status"],
                request.source_url
                if request.source_url is not None
                else existing["source_url"],
                request.last_verified
                if request.last_verified is not None
                else existing["last_verified"],
                deadline_id,
            ),
        )

        connection.commit()

        updated = cursor.execute(
            """
            SELECT *
            FROM admission_deadlines
            WHERE id = ?
            """,
            (deadline_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "Admission deadline updated successfully.",
            "deadline": dict(updated),
        }

    finally:
        connection.close()


# ============================================================
# DELETE ADMISSION DEADLINE
# ============================================================

@router.delete("/deadlines/{deadline_id}")
async def delete_deadline(
    deadline_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT id
            FROM admission_deadlines
            WHERE id = ?
            """,
            (deadline_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Admission deadline not found.",
            )

        cursor.execute(
            """
            DELETE FROM admission_deadlines
            WHERE id = ?
            """,
            (deadline_id,),
        )

        connection.commit()

        return {
            "success": True,
            "message": "Admission deadline deleted successfully.",
        }

    finally:
        connection.close()


# ============================================================
# CREATE ADMISSION REQUIREMENT
# ============================================================

@router.post("/requirements")
async def create_requirement(
    request: RequirementCreateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE id = ?
            """,
            (request.university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        if request.program_id is not None:
            program = cursor.execute(
                """
                SELECT id
                FROM university_programs
                WHERE id = ?
                AND university_id = ?
                """,
                (
                    request.program_id,
                    request.university_id,
                ),
            ).fetchone()

            if not program:
                raise HTTPException(
                    status_code=404,
                    detail="Program not found for this university.",
                )

        cursor.execute(
            """
            INSERT INTO admission_requirements (
                university_id,
                program_id,
                requirement_type,
                requirement_title,
                requirement_description,
                minimum_percentage,
                required_subjects,
                required_documents,
                domicile_required,
                entry_test_required,
                source_url,
                last_verified
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                request.university_id,
                request.program_id,
                request.requirement_type,
                request.requirement_title,
                request.requirement_description,
                request.minimum_percentage,
                request.required_subjects,
                request.required_documents,
                int(request.domicile_required),
                int(request.entry_test_required),
                request.source_url,
                request.last_verified,
            ),
        )

        connection.commit()

        requirement_id = cursor.lastrowid

        requirement = cursor.execute(
            """
            SELECT *
            FROM admission_requirements
            WHERE id = ?
            """,
            (requirement_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "Admission requirement added successfully.",
            "requirement": dict(requirement),
        }

    finally:
        connection.close()


# ============================================================
# GET UNIVERSITY REQUIREMENTS
# ============================================================

@router.get("/{university_id}/requirements")
async def get_university_requirements(
    university_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE id = ?
            """,
            (university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        requirements = cursor.execute(
            """
            SELECT *
            FROM admission_requirements
            WHERE university_id = ?
            ORDER BY requirement_title ASC
            """,
            (university_id,),
        ).fetchall()

        return {
            "success": True,
            "count": len(requirements),
            "requirements": [
                dict(item)
                for item in requirements
            ],
        }

    finally:
        connection.close()


# ============================================================
# UPDATE ADMISSION REQUIREMENT
# ============================================================

@router.put("/requirements/{requirement_id}")
async def update_requirement(
    requirement_id: int,
    request: RequirementUpdateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT *
            FROM admission_requirements
            WHERE id = ?
            """,
            (requirement_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Admission requirement not found.",
            )

        program_id = (
            request.program_id
            if request.program_id is not None
            else existing["program_id"]
        )

        if program_id is not None:
            program = cursor.execute(
                """
                SELECT id
                FROM university_programs
                WHERE id = ?
                AND university_id = ?
                """,
                (
                    program_id,
                    existing["university_id"],
                ),
            ).fetchone()

            if not program:
                raise HTTPException(
                    status_code=404,
                    detail="Program not found for this university.",
                )

        cursor.execute(
            """
            UPDATE admission_requirements
            SET
                program_id = ?,
                requirement_type = ?,
                requirement_title = ?,
                requirement_description = ?,
                minimum_percentage = ?,
                required_subjects = ?,
                required_documents = ?,
                domicile_required = ?,
                entry_test_required = ?,
                source_url = ?,
                last_verified = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (
                program_id,
                request.requirement_type
                if request.requirement_type is not None
                else existing["requirement_type"],
                request.requirement_title
                if request.requirement_title is not None
                else existing["requirement_title"],
                request.requirement_description
                if request.requirement_description is not None
                else existing["requirement_description"],
                request.minimum_percentage
                if request.minimum_percentage is not None
                else existing["minimum_percentage"],
                request.required_subjects
                if request.required_subjects is not None
                else existing["required_subjects"],
                request.required_documents
                if request.required_documents is not None
                else existing["required_documents"],
                int(request.domicile_required)
                if request.domicile_required is not None
                else existing["domicile_required"],
                int(request.entry_test_required)
                if request.entry_test_required is not None
                else existing["entry_test_required"],
                request.source_url
                if request.source_url is not None
                else existing["source_url"],
                request.last_verified
                if request.last_verified is not None
                else existing["last_verified"],
                requirement_id,
            ),
        )

        connection.commit()

        updated = cursor.execute(
            """
            SELECT *
            FROM admission_requirements
            WHERE id = ?
            """,
            (requirement_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "Admission requirement updated successfully.",
            "requirement": dict(updated),
        }

    finally:
        connection.close()


# ============================================================
# DELETE ADMISSION REQUIREMENT
# ============================================================

@router.delete("/requirements/{requirement_id}")
async def delete_requirement(
    requirement_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT id
            FROM admission_requirements
            WHERE id = ?
            """,
            (requirement_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="Admission requirement not found.",
            )

        cursor.execute(
            """
            DELETE FROM admission_requirements
            WHERE id = ?
            """,
            (requirement_id,),
        )

        connection.commit()

        return {
            "success": True,
            "message": "Admission requirement deleted successfully.",
        }

    finally:
        connection.close()


# ============================================================
# CREATE UNIVERSITY SOURCE
# ============================================================

@router.post("/sources")
async def create_source(
    request: SourceCreateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE id = ?
            """,
            (request.university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        source_title = request.source_title.strip()
        source_url = request.source_url.strip()

        if not source_title:
            raise HTTPException(
                status_code=400,
                detail="Source title is required.",
            )

        if not source_url:
            raise HTTPException(
                status_code=400,
                detail="Source URL is required.",
            )

        cursor.execute(
            """
            INSERT INTO university_sources (
                university_id,
                source_title,
                source_url,
                source_type,
                academic_session,
                verification_status,
                last_checked,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                request.university_id,
                source_title,
                source_url,
                request.source_type,
                request.academic_session,
                request.verification_status,
                request.last_checked,
                request.notes,
            ),
        )

        connection.commit()

        source_id = cursor.lastrowid

        source = cursor.execute(
            """
            SELECT *
            FROM university_sources
            WHERE id = ?
            """,
            (source_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "University source added successfully.",
            "source": dict(source),
        }

    finally:
        connection.close()


# ============================================================
# GET UNIVERSITY SOURCES
# ============================================================

@router.get("/{university_id}/sources")
async def get_university_sources(
    university_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        university = cursor.execute(
            """
            SELECT id
            FROM universities
            WHERE id = ?
            """,
            (university_id,),
        ).fetchone()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="University not found.",
            )

        sources = cursor.execute(
            """
            SELECT *
            FROM university_sources
            WHERE university_id = ?
            ORDER BY last_checked DESC
            """,
            (university_id,),
        ).fetchall()

        return {
            "success": True,
            "count": len(sources),
            "sources": [
                dict(source)
                for source in sources
            ],
        }

    finally:
        connection.close()


# ============================================================
# UPDATE UNIVERSITY SOURCE
# ============================================================

@router.put("/sources/{source_id}")
async def update_source(
    source_id: int,
    request: SourceUpdateRequest,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT *
            FROM university_sources
            WHERE id = ?
            """,
            (source_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="University source not found.",
            )

        source_title = (
            request.source_title.strip()
            if request.source_title is not None
            else existing["source_title"]
        )

        source_url = (
            request.source_url.strip()
            if request.source_url is not None
            else existing["source_url"]
        )

        if not source_title:
            raise HTTPException(
                status_code=400,
                detail="Source title cannot be empty.",
            )

        if not source_url:
            raise HTTPException(
                status_code=400,
                detail="Source URL cannot be empty.",
            )

        cursor.execute(
            """
            UPDATE university_sources
            SET
                source_title = ?,
                source_url = ?,
                source_type = ?,
                academic_session = ?,
                verification_status = ?,
                last_checked = ?,
                notes = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (
                source_title,
                source_url,
                request.source_type
                if request.source_type is not None
                else existing["source_type"],
                request.academic_session
                if request.academic_session is not None
                else existing["academic_session"],
                request.verification_status
                if request.verification_status is not None
                else existing["verification_status"],
                request.last_checked
                if request.last_checked is not None
                else existing["last_checked"],
                request.notes
                if request.notes is not None
                else existing["notes"],
                source_id,
            ),
        )

        connection.commit()

        updated = cursor.execute(
            """
            SELECT *
            FROM university_sources
            WHERE id = ?
            """,
            (source_id,),
        ).fetchone()

        return {
            "success": True,
            "message": "University source updated successfully.",
            "source": dict(updated),
        }

    finally:
        connection.close()


# ============================================================
# DELETE UNIVERSITY SOURCE
# ============================================================

@router.delete("/sources/{source_id}")
async def delete_source(
    source_id: int,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        existing = cursor.execute(
            """
            SELECT id
            FROM university_sources
            WHERE id = ?
            """,
            (source_id,),
        ).fetchone()

        if not existing:
            raise HTTPException(
                status_code=404,
                detail="University source not found.",
            )

        cursor.execute(
            """
            DELETE FROM university_sources
            WHERE id = ?
            """,
            (source_id,),
        )

        connection.commit()

        return {
            "success": True,
            "message": "University source deleted successfully.",
        }

    finally:
        connection.close()