
import re

SKILLS = [
    "Python",
    "Java",
    "C",
    "C++",
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "FastAPI",
    "Flask",
    "MySQL",
    "MongoDB",
    "Machine Learning",
    "Deep Learning",
    "Data Science",
    "Artificial Intelligence",
    "Generative AI",
    "LangChain",
    "Git",
    "GitHub",
    "SQL",
    "Pandas",
    "NumPy",
    "Scikit-learn"
]


def extract_skills(resume_text):

    found_skills = []

    for skill in SKILLS:

        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

        if re.search(pattern, resume_text, re.IGNORECASE):
            found_skills.append(skill)

    return found_skills
