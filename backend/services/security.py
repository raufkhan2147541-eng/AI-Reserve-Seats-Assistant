import bcrypt


# ==========================================
# Hash Password
# ==========================================

def hash_password(password: str) -> str:
    """
    Convert a plain-text password into a secure bcrypt hash.
    """

    password_bytes = password.encode("utf-8")

    # bcrypt supports a maximum of 72 bytes.
    if len(password_bytes) > 72:
        raise ValueError(
            "Password must not exceed 72 bytes."
        )

    hashed_password = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt(),
    )

    return hashed_password.decode("utf-8")


# ==========================================
# Verify Password
# ==========================================

def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plain-text password against its bcrypt hash.
    """

    password_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")

    if len(password_bytes) > 72:
        return False

    return bcrypt.checkpw(
        password_bytes,
        hashed_bytes,
    )