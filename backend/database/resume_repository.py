
from backend.database.connection import get_connection


def save_resume_analysis(user_id, resume_text, skills):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        skills_text = ", ".join(skills)

        query = """
        INSERT INTO resume_analysis
        (user_id, resume_text, skills)
        VALUES (%s, %s, %s)
        """

        cursor.execute(
            query,
            (user_id, resume_text, skills_text)
        )

        connection.commit()

        return cursor.lastrowid

    finally:
        cursor.close()
        connection.close()

def get_user_resume_analyses(user_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
        SELECT id, resume_text, skills, analyzed_at
        FROM resume_analysis
        WHERE user_id = %s
        ORDER BY analyzed_at DESC
        """

        cursor.execute(query, (user_id,))

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()