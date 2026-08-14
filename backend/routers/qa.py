from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth_utils import get_current_student
from database import get_connection
from services.qa_service import search_knowledge
from services.gemini_service import generate_answer


router = APIRouter(
    prefix="/qa",
    tags=["Question Answering"],
)


# ==========================================
# Request Model
# ==========================================

class QuestionRequest(BaseModel):
    question: str


# ==========================================
# Ask Question
# ==========================================

@router.post("/ask")
async def ask_question(
    request: QuestionRequest,
    current_student: dict = Depends(get_current_student),
):
    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question is required.",
        )

    student_id = current_student["student_id"]

    # ------------------------------------------
    # Search Knowledge Base
    # ------------------------------------------

    context = search_knowledge(question)

    if not context:

        answer = (
            "I could not find relevant information "
            "in the current knowledge base."
        )

        return {
            "success": True,
            "question": question,
            "answer": answer,
            "source_found": False,
        }

    # ------------------------------------------
    # Generate Gemini AI Answer
    # ------------------------------------------

    try:

        answer = generate_answer(
            question=question,
            context=context,
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"AI response generation failed: {str(error)}",
        )

    # ------------------------------------------
    # Save Chat History
    # ------------------------------------------

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO chat_history (
            student_id,
            question,
            answer
        )
        VALUES (?, ?, ?)
        """,
        (
            student_id,
            question,
            answer,
        ),
    )

    connection.commit()

    history_id = cursor.lastrowid

    connection.close()

    # ------------------------------------------
    # Final Response
    # ------------------------------------------

    return {
        "success": True,
        "question": question,
        "answer": answer,
        "source_found": True,
        "history_id": history_id,
    }


# ==========================================
# Get Student Chat History
# ==========================================

@router.get("/history")
async def get_chat_history(
    current_student: dict = Depends(get_current_student),
):
    student_id = current_student["student_id"]

    connection = get_connection()
    cursor = connection.cursor()

    history = cursor.execute(
        """
        SELECT
            id,
            student_id,
            question,
            answer,
            created_at
        FROM chat_history
        WHERE student_id = ?
        ORDER BY id DESC
        """,
        (student_id,),
    ).fetchall()

    connection.close()

    return {
        "success": True,
        "count": len(history),
        "history": [
            {
                "id": item["id"],
                "student_id": item["student_id"],
                "question": item["question"],
                "answer": item["answer"],
                "created_at": item["created_at"],
            }
            for item in history
        ],
    }