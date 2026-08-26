import bcrypt

from database import get_connection


# ==========================================
# Admin Account Details
# ==========================================

ADMIN_NAME = "System Administrator"
ADMIN_EMAIL = "admin@directorate.com"
ADMIN_PASSWORD = "Admin@12345"


# ==========================================
# Create Admin
# ==========================================

def create_admin():
    connection = get_connection()
    cursor = connection.cursor()

    # ------------------------------------------
    # Check if admin already exists
    # ------------------------------------------

    existing_admin = cursor.execute(
        """
        SELECT id
        FROM admins
        WHERE email = ?
        """,
        (ADMIN_EMAIL,),
    ).fetchone()

    if existing_admin:
        print("Admin account already exists.")
        connection.close()
        return

    # ------------------------------------------
    # Hash Password
    # ------------------------------------------

    password_hash = bcrypt.hashpw(
        ADMIN_PASSWORD.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")

    # ------------------------------------------
    # Insert Admin
    # ------------------------------------------

    cursor.execute(
        """
        INSERT INTO admins (
            full_name,
            email,
            password_hash
        )
        VALUES (?, ?, ?)
        """,
        (
            ADMIN_NAME,
            ADMIN_EMAIL,
            password_hash,
        ),
    )

    connection.commit()

    admin_id = cursor.lastrowid

    connection.close()

    print("=" * 50)
    print("ADMIN ACCOUNT CREATED SUCCESSFULLY")
    print("=" * 50)
    print(f"Admin ID: {admin_id}")
    print(f"Name: {ADMIN_NAME}")
    print(f"Email: {ADMIN_EMAIL}")
    print(f"Password: {ADMIN_PASSWORD}")
    print("=" * 50)


# ==========================================
# Run Script
# ==========================================

if __name__ == "__main__":
    create_admin()