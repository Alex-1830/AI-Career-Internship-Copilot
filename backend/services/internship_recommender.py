
INTERNSHIPS = [
    {
        "title": "Python Developer Intern",
        "company": "Tech Solutions",
        "skills": ["Python", "MySQL", "FastAPI", "Git"],
        "location": "Chennai"
    },
    {
        "title": "Machine Learning Intern",
        "company": "AI Innovations",
        "skills": ["Python", "Machine Learning", "Pandas", "NumPy"],
        "location": "Remote"
    },
    {
        "title": "Web Development Intern",
        "company": "Web Creators",
        "skills": ["HTML", "CSS", "JavaScript", "React"],
        "location": "Chennai"
    },
    {
        "title": "Data Science Intern",
        "company": "Data Labs",
        "skills": ["Python", "SQL", "Pandas", "Machine Learning"],
        "location": "Remote"
    },
    {
        "title": "AI Developer Intern",
        "company": "Future AI",
        "skills": ["Python", "Generative AI", "LangChain", "Git"],
        "location": "Remote"
    }
]


def recommend_internships(student_skills):

    recommendations = []

    student_skills_lower = [
        skill.lower() for skill in student_skills
    ]

    for internship in INTERNSHIPS:

        required_skills = internship["skills"]

        matched_skills = []

        for skill in required_skills:

            if skill.lower() in student_skills_lower:
                matched_skills.append(skill)

        score = round(
            len(matched_skills) / len(required_skills) * 100,
            2
        )

        recommendations.append({
            "title": internship["title"],
            "company": internship["company"],
            "location": internship["location"],
            "matched_skills": matched_skills,
            "match_percentage": score
        })

    recommendations.sort(
        key=lambda item: item["match_percentage"],
        reverse=True
    )

    return recommendations
