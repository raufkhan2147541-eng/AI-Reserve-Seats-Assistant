import shutil
from pathlib import Path

import fitz
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from backend.auth_utils import get_current_admin
from backend.database import get_connection


router = APIRouter(
    prefix="/knowledge",
    tags=["Knowledge Base"],
)


# ==========================================
# Allowed File Types
# ==========================================

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".txt",
}


# ==========================================
# Upload Knowledge Document
# ==========================================

@router.post("/upload")
async def upload_knowledge_document(
    file: UploadFile = File(...),
    current_admin: dict = Depends(get_current_admin),
):
    # ------------------------------------------
    # Check File
    # ------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected.",
        )

    file_extension = Path(
        file.filename
    ).suffix.lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT files are supported.",
        )

    # ------------------------------------------
    # Create Data Directory
    # ------------------------------------------

    data_directory = Path("data")

    data_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    # ------------------------------------------
    # Safe File Name
    # ------------------------------------------

    original_file_name = Path(
        file.filename
    ).name

    safe_file_name = original_file_name

    file_path = (
        data_directory / safe_file_name
    )

    # ------------------------------------------
    # Avoid Duplicate File Names
    # ------------------------------------------

    if file_path.exists():

        file_stem = Path(
            safe_file_name
        ).stem

        file_suffix = Path(
            safe_file_name
        ).suffix

        counter = 1

        while file_path.exists():

            safe_file_name = (
                f"{file_stem}_{counter}"
                f"{file_suffix}"
            )

            file_path = (
                data_directory / safe_file_name
            )

            counter += 1

    try:

        # --------------------------------------
        # Save Uploaded File
        # --------------------------------------

        with file_path.open("wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )

        # --------------------------------------
        # Extract Content
        # --------------------------------------

        extracted_text = ""

        if file_extension == ".pdf":

            document = fitz.open(
                str(file_path)
            )

            try:

                for page in document:

                    extracted_text += (
                        page.get_text()
                    )

            finally:

                document.close()

        elif file_extension == ".txt":

            extracted_text = file_path.read_text(
                encoding="utf-8"
            )

        extracted_text = (
            extracted_text.strip()
        )

        # --------------------------------------
        # Check Extracted Text
        # --------------------------------------

        if not extracted_text:

            file_path.unlink(
                missing_ok=True
            )

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract text "
                    "from the uploaded file."
                ),
            )

        # --------------------------------------
        # Save Knowledge in Database
        # --------------------------------------

        connection = get_connection()

        cursor = connection.cursor()

        title = Path(
            safe_file_name
        ).stem

        file_type = file_extension.replace(
            ".",
            "",
        )

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
                safe_file_name,
                file_type,
                extracted_text,
            ),
        )

        connection.commit()

        document_id = cursor.lastrowid

        connection.close()

        # --------------------------------------
        # Response
        # --------------------------------------

        return {
            "success": True,
            "message": (
                "Knowledge document uploaded "
                "successfully."
            ),
            "document": {
                "id": document_id,
                "title": title,
                "file_name": safe_file_name,
                "file_type": file_type,
                "characters": len(
                    extracted_text
                ),
            },
            "uploaded_by": {
                "admin_id": current_admin[
                    "admin_id"
                ],
                "email": current_admin[
                    "email"
                ],
            },
        }

    except HTTPException:
        raise

    except Exception as error:

        if file_path.exists():

            file_path.unlink(
                missing_ok=True
            )

        raise HTTPException(
            status_code=500,
            detail=(
                "Knowledge processing failed: "
                f"{str(error)}"
            ),
        )


# ==========================================
# Get Knowledge Documents
# ==========================================

@router.get("/documents")
async def get_knowledge_documents(
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
                "file_name": document[
                    "file_name"
                ],
                "file_type": document[
                    "file_type"
                ],
                "created_at": document[
                    "created_at"
                ],
            }
            for document in documents
        ],
    }


# ==========================================
# Get Single Knowledge Document
# ==========================================

@router.get("/documents/{document_id}")
async def get_knowledge_document(
    document_id: int,
    current_admin: dict = Depends(
        get_current_admin
    ),
):
    connection = get_connection()

    cursor = connection.cursor()

    document = cursor.execute(
        """
        SELECT
            id,
            title,
            file_name,
            file_type,
            content,
            created_at
        FROM knowledge_documents
        WHERE id = ?
        """,
        (document_id,),
    ).fetchone()

    connection.close()

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Knowledge document not found.",
        )

    return {
        "success": True,
        "document": {
            "id": document["id"],
            "title": document["title"],
            "file_name": document[
                "file_name"
            ],
            "file_type": document[
                "file_type"
            ],
            "content": document["content"],
            "created_at": document[
                "created_at"
            ],
        },
    }


# ==========================================
# Delete Knowledge Document
# ==========================================

@router.delete("/documents/{document_id}")
async def delete_knowledge_document(
    document_id: int,
    current_admin: dict = Depends(
        get_current_admin
    ),
):
    connection = get_connection()

    cursor = connection.cursor()

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

        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Knowledge document not found.",
        )

    # ------------------------------------------
    # Delete Database Record
    # ------------------------------------------

    cursor.execute(
        """
        DELETE FROM knowledge_documents
        WHERE id = ?
        """,
        (document_id,),
    )

    connection.commit()

    connection.close()

    # ------------------------------------------
    # Delete Physical File
    # ------------------------------------------

    data_directory = Path("data")

    file_path = (
        data_directory
        / document["file_name"]
    )

    if file_path.exists():

        file_path.unlink(
            missing_ok=True
        )

    return {
        "success": True,
        "message": (
            "Knowledge document deleted "
            "successfully."
        ),
        "document_id": document_id,
    }