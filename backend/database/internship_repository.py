
from backend.database.connection import get_connection


def save_internship_application(user_id, company, role):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
        INSERT INTO internship_applications
        (user_id, company, role)
        VALUES (%s, %s, %s)
        """

        cursor.execute(
            query,
            (user_id, company, role)
        )

        connection.commit()

        return cursor.lastrowid

    finally:
        cursor.close()
        connection.close()

def get_user_internship_applications(user_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
        SELECT id, company, role, application_status, applied_at
        FROM internship_applications
        WHERE user_id = %s
        ORDER BY applied_at DESC
        """

        cursor.execute(query, (user_id,))

        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()