from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import initialize_database

from routers.auth import router as auth_router
from routers.knowledge import router as knowledge_router
from routers.qa import router as qa_router
from routers.universities import router as universities_router

from admin import router as admin_router


# ==========================================
# Create FastAPI Application
# ==========================================

app = FastAPI(
    title="Directorate Reserve Seats AI Assistant",
    description=(
        "AI-powered student assistant and "
        "university information system."
    ),
    version="1.0.0",
)


# ==========================================
# CORS Configuration
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Initialize Database
# ==========================================

initialize_database()


# ==========================================
# Register Routers
# ==========================================


# ------------------------------------------
# Student Authentication
# ------------------------------------------

app.include_router(
    auth_router
)


# ------------------------------------------
# Knowledge Base
# ------------------------------------------

app.include_router(
    knowledge_router
)


# ------------------------------------------
# Question Answering
# ------------------------------------------

app.include_router(
    qa_router
)


# ------------------------------------------
# University Information
# ------------------------------------------

app.include_router(
    universities_router
)


# ------------------------------------------
# Admin Dashboard
# ------------------------------------------

app.include_router(
    admin_router
)


# ==========================================
# Root Endpoint
# ==========================================

@app.get("/")
async def root():
    return {
        "success": True,
        "message": (
            "Directorate Reserve Seats API "
            "is running."
        ),
    }


# ==========================================
# Health Check
# ==========================================

@app.get("/health")
async def health_check():
    return {
        "success": True,
        "status": "healthy",
    }