
LEARNING_PLANS = {
    "Python": {
        "duration": "2 weeks",
        "task": "Learn Python basics and solve coding problems"
    },
    "Machine Learning": {
        "duration": "3 weeks",
        "task": "Study supervised and unsupervised ML algorithms"
    },
    "Pandas": {
        "duration": "1 week",
        "task": "Practice data cleaning and data analysis"
    },
    "NumPy": {
        "duration": "1 week",
        "task": "Learn arrays and numerical operations"
    },
    "Scikit-learn": {
        "duration": "2 weeks",
        "task": "Build and evaluate ML models"
    },
    "SQL": {
        "duration": "1 week",
        "task": "Practice SQL queries and database operations"
    },
    "Git": {
        "duration": "1 week",
        "task": "Learn Git and GitHub version control"
    },
    "FastAPI": {
        "duration": "2 weeks",
        "task": "Build REST APIs using FastAPI"
    },
    "Generative AI": {
        "duration": "2 weeks",
        "task": "Learn LLM basics and build AI applications"
    }
}


def create_learning_plan(missing_skills):

    learning_plan = []

    for skill in missing_skills:

        plan = LEARNING_PLANS.get(
            skill,
            {
                "duration": "1 week",
                "task": f"Learn {skill} and build a small project"
            }
        )

        learning_plan.append({
            "skill": skill,
            "duration": plan["duration"],
            "task": plan["task"]
        })

    return learning_plan
