import re

from database import get_connection


# ==========================================
# Stop Words
# ==========================================

STOP_WORDS = {
    "a",
    "an",
    "the",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "am",
    "to",
    "of",
    "in",
    "on",
    "at",
    "for",
    "from",
    "by",
    "with",
    "about",
    "and",
    "or",
    "but",
    "if",
    "then",
    "than",
    "that",
    "this",
    "these",
    "those",
    "it",
    "its",
    "as",
    "into",
    "can",
    "could",
    "should",
    "would",
    "may",
    "might",
    "will",
    "do",
    "does",
    "did",
    "have",
    "has",
    "had",
    "i",
    "me",
    "my",
    "we",
    "our",
    "you",
    "your",
    "they",
    "their",
    "what",
    "which",
    "who",
    "where",
    "when",
    "how",
}


# ==========================================
# Normalize Text
# ==========================================

def normalize_text(text: str) -> str:
    """
    Normalize text for better keyword matching.
    """

    if not text:
        return ""

    text = text.lower()

    # Replace punctuation with spaces
    text = re.sub(
        r"[^a-z0-9%]+",
        " ",
        text,
    )

    # Remove extra spaces
    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text.strip()


# ==========================================
# Extract Question Keywords
# ==========================================

def extract_keywords(text: str) -> list[str]:
    """
    Extract meaningful keywords from the question.
    """

    normalized_text = normalize_text(text)

    if not normalized_text:
        return []

    words = normalized_text.split()

    keywords = []

    for word in words:

        # Ignore very short words
        if len(word) <= 2:
            continue

        # Ignore common English stop words
        if word in STOP_WORDS:
            continue

        # Avoid duplicate keywords
        if word not in keywords:
            keywords.append(word)

    return keywords


# ==========================================
# Get Knowledge Context
# ==========================================

def get_knowledge_context() -> str:
    """
    Retrieve all knowledge documents from the database
    and combine their content into one context string.
    """

    connection = get_connection()
    cursor = connection.cursor()

    try:

        documents = cursor.execute(
            """
            SELECT
                title,
                content
            FROM knowledge_documents
            ORDER BY id ASC
            """
        ).fetchall()

    finally:
        connection.close()

    if not documents:
        return ""

    context_parts = []

    for document in documents:

        title = document["title"] or ""
        content = document["content"] or ""

        if not content.strip():
            continue

        context_parts.append(
            f"DOCUMENT: {title}\n"
            f"{content}"
        )

    return "\n\n".join(context_parts)


# ==========================================
# Calculate Document Relevance
# ==========================================

def calculate_relevance(
    question_keywords: list[str],
    title: str,
    content: str,
) -> int:
    """
    Calculate a relevance score for a document.

    Title matches receive a higher score than
    normal content matches.
    """

    if not question_keywords:
        return 0

    normalized_title = normalize_text(
        title
    )

    normalized_content = normalize_text(
        content
    )

    score = 0

    for keyword in question_keywords:

        # --------------------------------------
        # Title Match
        # --------------------------------------

        if keyword in normalized_title:
            score += 5

        # --------------------------------------
        # Content Match
        # --------------------------------------

        if keyword in normalized_content:
            score += 1

    return score


# ==========================================
# Find Relevant Information
# ==========================================

def search_knowledge(
    question: str,
) -> str:
    """
    Search the knowledge base using keyword
    matching and document relevance scoring.

    The function searches the existing
    knowledge_documents table and returns the
    top three most relevant documents.
    """

    question = question.strip()

    if not question:
        return ""

    # ------------------------------------------
    # Extract Meaningful Keywords
    # ------------------------------------------

    question_keywords = extract_keywords(
        question
    )

    if not question_keywords:
        return ""

    # ------------------------------------------
    # Get Knowledge Documents
    # ------------------------------------------

    connection = get_connection()
    cursor = connection.cursor()

    try:

        documents = cursor.execute(
            """
            SELECT
                id,
                title,
                content
            FROM knowledge_documents
            ORDER BY id ASC
            """
        ).fetchall()

    finally:
        connection.close()

    if not documents:
        return ""

    # ------------------------------------------
    # Find Relevant Documents
    # ------------------------------------------

    relevant_documents = []

    for document in documents:

        document_id = document["id"]

        title = document["title"] or ""

        content = document["content"] or ""

        if not content.strip():
            continue

        score = calculate_relevance(
            question_keywords=question_keywords,
            title=title,
            content=content,
        )

        if score > 0:

            relevant_documents.append(
                (
                    score,
                    document_id,
                    title,
                    content,
                )
            )

    # ------------------------------------------
    # No Relevant Information
    # ------------------------------------------

    if not relevant_documents:
        return ""

    # ------------------------------------------
    # Sort Documents by Relevance
    # ------------------------------------------

    relevant_documents.sort(
        key=lambda item: (
            item[0],
            item[1],
        ),
        reverse=True,
    )

    # ------------------------------------------
    # Select Top 3 Documents
    # ------------------------------------------

    top_documents = (
        relevant_documents[:3]
    )

    # ------------------------------------------
    # Build AI Context
    # ------------------------------------------

    context_parts = []

    for (
        score,
        document_id,
        title,
        content,
    ) in top_documents:

        context_parts.append(
            f"DOCUMENT: {title}\n"
            f"{content}"
        )

    return "\n\n".join(
        context_parts
    )