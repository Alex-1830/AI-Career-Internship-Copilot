
from backend.database.connection import get_connection


def create_user(name, email):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
        INSERT INTO users (name, email)
        VALUES (%s, %s)
        """

        cursor.execute(query, (name, email))
        connection.commit()

        return cursor.lastrowid

    finally:
        cursor.close()
        connection.close()


def register_user(name, email, password_hash):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
        INSERT INTO users (name, email, password_hash)
        VALUES (%s, %s, %s)
        """

        cursor.execute(
            query,
            (name, email, password_hash)
        )

        connection.commit()
        return cursor.lastrowid

    finally:
        cursor.close()
        connection.close()


def get_user_by_email(email):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = "SELECT * FROM users WHERE email = %s"
        cursor.execute(query, (email,))

        return cursor.fetchone()

    finally:
        cursor.close()
        connection.close()
