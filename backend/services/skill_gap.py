
def analyze_skill_gap(student_skills, required_skills):

    matched_skills = []
    missing_skills = []

    student_skills_lower = [
        skill.lower() for skill in student_skills
    ]

    for skill in required_skills:

        if skill.lower() in student_skills_lower:
            matched_skills.append(skill)

        else:
            missing_skills.append(skill)

    total_required = len(required_skills)

    if total_required == 0:
        match_percentage = 0
    else:
        match_percentage = round(
            (len(matched_skills) / total_required) * 100,
            2
        )

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "match_percentage": match_percentage
    }
