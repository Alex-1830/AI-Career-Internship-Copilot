
from backend.database.connection import get_connection
import json


def save_career_plan(user_id, recommended_role, learning_plan, project_recommendations):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
        INSERT INTO career_plans
        (user_id, recommended_role, learning_plan, project_recommendations)
        VALUES (%s, %s, %s, %s)
        """

        cursor.execute(
            query,
            (
                user_id,
                recommended_role,
                json.dumps(learning_plan),
                json.dumps(project_recommendations)
            )
        )

        connection.commit()
        return cursor.lastrowid

    finally:
        cursor.close()
        connection.close()


def get_user_career_plans(user_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
        SELECT id, recommended_role, learning_plan,
               project_recommendations, created_at
        FROM career_plans
        WHERE user_id = %s
        ORDER BY created_at DESC
        """

        cursor.execute(query, (user_id,))
        career_plans = cursor.fetchall()

        for plan in career_plans:
            for field in ["learning_plan", "project_recommendations"]:
                value = plan[field]

                if isinstance(value, str):
                    try:
                        plan[field] = json.loads(value)
                    except (json.JSONDecodeError, TypeError):
                        plan[field] = []

        return career_plans

    finally:
        cursor.close()
        connection.close()


def add_skill(user_id, skill_name):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
        INSERT IGNORE INTO skill_progress
        (user_id, skill_name, is_completed)
        VALUES (%s, %s, FALSE)
        """

        cursor.execute(query, (user_id, skill_name.strip()))
        connection.commit()

    finally:
        cursor.close()
        connection.close()


def save_skill_progress(user_id, skill_name, is_completed):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
        INSERT INTO skill_progress
        (user_id, skill_name, is_completed)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE
            is_completed = VALUES(is_completed),
            completed_at = IF(
                VALUES(is_completed) = TRUE,
                CURRENT_TIMESTAMP,
                completed_at
            )
        """

        cursor.execute(
            query,
            (user_id, skill_name.strip(), is_completed)
        )

        connection.commit()

    finally:
        cursor.close()
        connection.close()


def get_user_skills(user_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
        SELECT skill_name, is_completed
        FROM skill_progress
        WHERE user_id = %s
        ORDER BY skill_name ASC
        """

        cursor.execute(query, (user_id,))
        return cursor.fetchall()

    finally:
        cursor.close()
        connection.close()


# Kept for compatibility with the existing main.py import.
def get_completed_skills(user_id):
    skills = get_user_skills(user_id)

    return [
        item["skill_name"]
        for item in skills
        if item["is_completed"]
    ]
