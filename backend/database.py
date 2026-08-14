import sqlite3

from config import DATABASE_URL


# ==========================================
# Get Database Path
# ==========================================

def get_database_path() -> str:
    """
    Convert the SQLite database URL into a local file path.
    """

    prefix = "sqlite:///"

    if DATABASE_URL.startswith(prefix):
        return DATABASE_URL.replace(prefix, "", 1)

    return DATABASE_URL


# ==========================================
# Get Database Connection
# ==========================================

def get_connection():
    """
    Create and return a SQLite database connection.
    """

    connection = sqlite3.connect(
        get_database_path(),
        check_same_thread=False,
    )

    connection.row_factory = sqlite3.Row

    # Enable foreign key support
    connection.execute("PRAGMA foreign_keys = ON")

    return connection


# ==========================================
# Initialize Database
# ==========================================

def initialize_database():
    """
    Create all application database tables.
    """

    connection = get_connection()
    cursor = connection.cursor()

    # ======================================
    # Students Table
    # ======================================

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    # ======================================
    # Admins Table
    # ======================================

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    # ======================================
    # Knowledge Documents Table
    # ======================================

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS knowledge_documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            file_name TEXT,
            file_type TEXT,
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    # ======================================
    # Chat History Table
    # ======================================

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER,
            question TEXT NOT NULL,
            answer TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id)
            REFERENCES students(id)
            ON DELETE CASCADE
        )
        """
    )

    # ======================================
    # Password Reset Tokens Table
    # ======================================

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id)
            REFERENCES students(id)
            ON DELETE CASCADE
        )
        """
    )

    # ======================================
    # Universities Table
    # ======================================

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS universities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL UNIQUE,

            university_type TEXT,

            province TEXT,

            city TEXT,

            campus TEXT,

            official_website TEXT,

            admission_portal TEXT,

            hec_recognized INTEGER DEFAULT 0,

            hec_recognition_source TEXT,

            description TEXT,

            last_verified TIMESTAMP,

            academic_session TEXT,

            is_active INTEGER DEFAULT 1,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    # ======================================
    # University Programs Table
    # ======================================

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS university_programs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            university_id INTEGER NOT NULL,

            program_name TEXT NOT NULL,

            degree_level TEXT,

            department TEXT,

            campus TEXT,

            duration TEXT,

            study_mode TEXT,

            eligibility TEXT,

            entry_test_required INTEGER DEFAULT 0,

            admission_status TEXT,

            academic_session TEXT,

            source_url TEXT,

            last_verified TIMESTAMP,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (university_id)
            REFERENCES universities(id)
            ON DELETE CASCADE
        )
        """
    )

    # ======================================
    # University Fee Structures Table
    # ======================================

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS university_fee_structures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            university_id INTEGER NOT NULL,

            program_id INTEGER,

            program_name TEXT,

            admission_fee REAL,

            tuition_fee REAL,

            semester_fee REAL,

            examination_fee REAL,

            hostel_fee REAL,

            transport_fee REAL,

            other_fee REAL,

            total_fee REAL,

            fee_frequency TEXT,

            academic_session TEXT,

            currency TEXT DEFAULT 'PKR',

            source_url TEXT,

            last_verified TIMESTAMP,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (university_id)
            REFERENCES universities(id)
            ON DELETE CASCADE,

            FOREIGN KEY (program_id)
            REFERENCES university_programs(id)
            ON DELETE SET NULL
        )
        """
    )

    # ======================================
    # Admission Deadlines Table
    # ======================================

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS admission_deadlines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            university_id INTEGER NOT NULL,

            program_id INTEGER,

            admission_title TEXT,

            admission_session TEXT,

            application_open_date TEXT,

            application_deadline TEXT,

            entry_test_date TEXT,

            interview_date TEXT,

            merit_list_date TEXT,

            fee_submission_deadline TEXT,

            admission_status TEXT,

            source_url TEXT,

            last_verified TIMESTAMP,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (university_id)
            REFERENCES universities(id)
            ON DELETE CASCADE,

            FOREIGN KEY (program_id)
            REFERENCES university_programs(id)
            ON DELETE SET NULL
        )
        """
    )

    # ======================================
    # Admission Requirements Table
    # ======================================

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS admission_requirements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            university_id INTEGER NOT NULL,

            program_id INTEGER,

            requirement_type TEXT,

            requirement_title TEXT,

            requirement_description TEXT,

            minimum_percentage REAL,

            required_subjects TEXT,

            required_documents TEXT,

            domicile_required INTEGER DEFAULT 0,

            entry_test_required INTEGER DEFAULT 0,

            source_url TEXT,

            last_verified TIMESTAMP,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (university_id)
            REFERENCES universities(id)
            ON DELETE CASCADE,

            FOREIGN KEY (program_id)
            REFERENCES university_programs(id)
            ON DELETE SET NULL
        )
        """
    )

    # ======================================
    # University Sources Table
    # ======================================

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS university_sources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            university_id INTEGER NOT NULL,

            source_title TEXT NOT NULL,

            source_url TEXT NOT NULL,

            source_type TEXT,

            academic_session TEXT,

            verification_status TEXT DEFAULT 'pending',

            last_checked TIMESTAMP,

            notes TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (university_id)
            REFERENCES universities(id)
            ON DELETE CASCADE
        )
        """
    )

    # ======================================
    # Save Changes
    # ======================================

    connection.commit()

    # ======================================
    # Close Connection
    # ======================================

    connection.close()