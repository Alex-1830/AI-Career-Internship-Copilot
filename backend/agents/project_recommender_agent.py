
PROJECTS = {
    "Python": [
        "Python Automation Tool",
        "Personal Expense Tracker"
    ],
    "Machine Learning": [
        "House Price Prediction",
        "Customer Churn Prediction"
    ],
    "Pandas": [
        "Sales Data Analysis Dashboard"
    ],
    "NumPy": [
        "Numerical Data Analysis Tool"
    ],
    "Scikit-learn": [
        "Student Performance Prediction"
    ],
    "Generative AI": [
        "AI Career Chatbot",
        "AI Resume Assistant"
    ],
    "FastAPI": [
        "Job Application Tracking API"
    ],
    "SQL": [
        "Student Management Database"
    ],
    "Git": [
        "Open Source GitHub Project"
    ]
}


def recommend_projects(missing_skills):

    recommendations = []

    for skill in missing_skills:

        projects = PROJECTS.get(
            skill,
            [f"Build a beginner project using {skill}"]
        )

        recommendations.append({
            "skill": skill,
            "projects": projects
        })

    return recommendations
