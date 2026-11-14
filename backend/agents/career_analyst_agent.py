
CAREER_ROLES = {
    "Machine Learning Engineer": [
        "Python", "Machine Learning", "NumPy",
        "Pandas", "Scikit-learn"
    ],
    "AI Engineer": [
        "Python", "Generative AI", "Machine Learning",
        "FastAPI", "Git"
    ],
    "Data Scientist": [
        "Python", "SQL", "Pandas",
        "NumPy", "Machine Learning"
    ],
    "Full Stack Developer": [
        "HTML", "CSS", "JavaScript",
        "React", "FastAPI", "MySQL"
    ],
    "Python Backend Developer": [
        "Python", "FastAPI", "SQL",
        "MySQL", "Git"
    ]
}


def analyze_career_paths(student_skills):

    results = []

    student_skills_lower = [
        skill.lower() for skill in student_skills
    ]

    for role, required_skills in CAREER_ROLES.items():

        matched = []
        missing = []

        for skill in required_skills:
            if skill.lower() in student_skills_lower:
                matched.append(skill)
            else:
                missing.append(skill)

        score = round(
            len(matched) / len(required_skills) * 100, 2
        )

        results.append({
            "career": role,
            "match_percentage": score,
            "matched_skills": matched,
            "missing_skills": missing
        })

    results.sort(
        key=lambda item: item["match_percentage"],
        reverse=True
    )

    return results
