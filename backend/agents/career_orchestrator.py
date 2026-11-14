
from backend.agents.career_analyst_agent import analyze_career_paths
from backend.agents.learning_planner_agent import create_learning_plan
from backend.agents.project_recommender_agent import recommend_projects


def run_career_planner(student_skills):

    # Agent 1: Analyse career paths
    career_results = analyze_career_paths(student_skills)

    if not career_results:
        return {"message": "No career recommendations found"}

    # Select the highest-matching career
    best_career = career_results[0]

    # Get missing skills for the selected career
    missing_skills = best_career["missing_skills"]

    # Agent 2: Create learning plan
    learning_plan = create_learning_plan(missing_skills)

    # Agent 3: Recommend projects
    project_recommendations = recommend_projects(missing_skills)

    # Combine all agent results
    return {
        "recommended_career": best_career["career"],
        "match_percentage": best_career["match_percentage"],
        "matched_skills": best_career["matched_skills"],
        "missing_skills": missing_skills,
        "learning_plan": learning_plan,
        "project_recommendations": project_recommendations
    }
