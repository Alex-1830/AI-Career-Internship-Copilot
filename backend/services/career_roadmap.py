def generate_career_roadmap(missing_skills):

    roadmap = []

    learning_resources = {
        "Python": "Learn Python basics and practice coding",
        "Machine Learning": "Learn ML algorithms and build projects",
        "Pandas": "Learn data cleaning and analysis",
        "NumPy": "Learn numerical computing",
        "Scikit-learn": "Practice ML model development",
        "FastAPI": "Learn API development using FastAPI",
        "SQL": "Practice database queries",
        "Git": "Learn Git and GitHub"
    }

    for skill in missing_skills:
        roadmap.append({
            "skill": skill,
            "recommendation": learning_resources.get(
                skill,
                f"Study {skill} and build a small project"
            )
        })

    return roadmap