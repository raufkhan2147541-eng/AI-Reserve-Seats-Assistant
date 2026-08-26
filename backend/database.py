import sqlite3

from config import DATABASE_URL


# ============================================================
# DATABASE PATH
# ============================================================

def get_database_path() -> str:
    """
    Convert SQLite database URL into a local database file path.
    """

    prefix = "sqlite:///"

    if DATABASE_URL.startswith(prefix):
        return DATABASE_URL.replace(prefix, "", 1)

    return DATABASE_URL


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_connection():
    """
    Create and return a SQLite database connection.
    """

    connection = sqlite3.connect(
        get_database_path(),
        check_same_thread=False,
    )

    # Return rows like dictionaries
    connection.row_factory = sqlite3.Row

    # Enable foreign key support
    connection.execute("PRAGMA foreign_keys = ON")

    return connection


# ============================================================
# INITIALIZE DATABASE
# ============================================================

def initialize_database():
    """
    Create all application database tables.
    """

    connection = get_connection()
    cursor = connection.cursor()

    try:

        # ====================================================
        # STUDENTS TABLE
        # ====================================================

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

        # ====================================================
        # ADMINS TABLE
        # ====================================================

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

        # ====================================================
        # KNOWLEDGE DOCUMENTS TABLE
        # ====================================================

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

        # ====================================================
        # CHAT HISTORY TABLE
        # ====================================================

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

        # ====================================================
        # PASSWORD RESET TOKENS TABLE
        # ====================================================

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

        # ====================================================
        # UNIVERSITIES TABLE
        # ====================================================

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

        # ====================================================
        # UNIVERSITY PROGRAMS TABLE
        # ====================================================

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

        # ====================================================
        # UNIVERSITY FEE STRUCTURES TABLE
        # ====================================================

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

        # ====================================================
        # ADMISSION DEADLINES TABLE
        # ====================================================

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

        # ====================================================
        # ADMISSION REQUIREMENTS TABLE
        # ====================================================

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

        # ====================================================
        # UNIVERSITY SOURCES TABLE
        # ====================================================

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

        # ====================================================
        # INDEXES
        # ====================================================

        cursor.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_university_programs_university
            ON university_programs(university_id)
            """
        )

        cursor.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_fee_structures_university
            ON university_fee_structures(university_id)
            """
        )

        cursor.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_admission_deadlines_university
            ON admission_deadlines(university_id)
            """
        )

        cursor.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_admission_requirements_university
            ON admission_requirements(university_id)
            """
        )

        cursor.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_university_sources_university
            ON university_sources(university_id)
            """
        )

        # ====================================================
        # COMMIT
        # ====================================================

        connection.commit()

        print("Database initialized successfully.")

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()