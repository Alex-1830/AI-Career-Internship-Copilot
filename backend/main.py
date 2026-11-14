from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Depends
from pydantic import BaseModel
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.services.resume_parser import extract_resume_text
from backend.services.skill_extractor import extract_skills
from backend.services.skill_gap import analyze_skill_gap
from backend.services.internship_recommender import recommend_internships
from backend.services.career_roadmap import generate_career_roadmap
from backend.services.gemini_service import ask_gemini
from backend.agents.career_analyst_agent import analyze_career_paths
from backend.agents.learning_planner_agent import create_learning_plan
from backend.agents.project_recommender_agent import recommend_projects
from backend.agents.career_orchestrator import run_career_planner
from backend.database.user_repository import create_user
from backend.database.resume_repository import (
    save_resume_analysis,
    get_user_resume_analyses
)
from backend.database.career_repository import (
    save_career_plan,
    get_user_career_plans,
    save_skill_progress,
    get_completed_skills,
    add_skill,
    get_user_skills
)
from backend.database.internship_repository import (
    save_internship_application,
    get_user_internship_applications
)
from backend.services.auth_service import hash_password
from backend.database.user_repository import register_user, get_user_by_email
from backend.services.auth_service import verify_password
from backend.services.auth_service import  create_access_token
from backend.services.auth_service import  verify_access_token

app = FastAPI(
    title="AI Career & Internship Copilot",
    description="An intelligent AI-powered career assistant",
    version="1.0.0"
)


class SkillProgressRequest(BaseModel):
    skill_name: str
    is_completed: bool

class AddSkillRequest(BaseModel):
    skill_name: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return int(payload["sub"])

@app.get("/")
def home():
    return {
        "message": "Welcome to AI Career & Internship Copilot!",
        "status": "Application is running successfully"
    }


@app.post("/resume/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
     current_user_id: int = Depends(get_current_user)
):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file"
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty"
        )

    try:
        resume_text = extract_resume_text(content)

        skills = extract_skills(resume_text)

        
        # Use the logged-in student's ID
        user_id = current_user_id

        # Save resume analysis in MySQL
        resume_id = save_resume_analysis(
            user_id,
            resume_text,
            skills
        )

        return {
            "filename": file.filename,
            "extracted_text": resume_text,
            "skills": skills,
            "user_id": user_id,
            "resume_id": resume_id,
            "message": "Resume analyzed and saved successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume processing failed: {str(e)}"
        )


@app.post("/resume/skills")
async def identify_skills(file: UploadFile = File(...)):

    content = await file.read()

    resume_text = extract_resume_text(content)

    skills = extract_skills(resume_text)

    return {
        "identified_skills": skills,
        "total_skills": len(skills)
    }


@app.post("/resume/skill-gap")
async def check_skill_gap(
    file: UploadFile = File(...),
    required_skills: str = Form(...)
):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file"
        )

    content = await file.read()

    resume_text = extract_resume_text(content)

    student_skills = extract_skills(resume_text)

    internship_skills = [
        skill.strip()
        for skill in required_skills.split(",")
        if skill.strip()
    ]

    result = analyze_skill_gap(
        student_skills,
        internship_skills
    )

    return {
        "student_skills": student_skills,
        "required_skills": internship_skills,
        **result
    }


@app.post("/internships/recommend")
async def get_recommendations(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file"
        )

    content = await file.read()

    resume_text = extract_resume_text(content)

    student_skills = extract_skills(resume_text)

    recommendations = recommend_internships(student_skills)

    return {
        "student_skills": student_skills,
        "recommended_internships": recommendations
    }

@app.post("/career/roadmap")
async def get_career_roadmap(
    file: UploadFile = File(...),
    required_skills: str = Form(...)
):
    content = await file.read()
    resume_text = extract_resume_text(content)
    student_skills = extract_skills(resume_text)

    required = [
        skill.strip()
        for skill in required_skills.split(",")
        if skill.strip()
    ]

    gap = analyze_skill_gap(student_skills, required)

    roadmap = generate_career_roadmap(gap["missing_skills"])

    return {
        "missing_skills": gap["missing_skills"],
        "career_roadmap": roadmap
    }


@app.post("/ai/test")
async def test_gemini(prompt: str = Form(...)):

    try:
        answer = ask_gemini(prompt)

        return {
            "success": True,
            "ai_response": answer
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agents/career-analysis")
async def career_analysis(skills: str = Form(...)):

    student_skills = [
        skill.strip()
        for skill in skills.split(",")
        if skill.strip()
    ]

    results = analyze_career_paths(student_skills)

    return {
        "student_skills": student_skills,
        "career_recommendations": results
    }

@app.post("/agents/learning-plan")
async def learning_plan(skills: str = Form(...)):

    missing_skills = [
        skill.strip()
        for skill in skills.split(",")
        if skill.strip()
    ]

    plan = create_learning_plan(missing_skills)

    return {
        "missing_skills": missing_skills,
        "learning_plan": plan
    }

@app.post("/agents/project-recommendations")
async def project_recommendations(skills: str = Form(...)):

    missing_skills = [
        skill.strip()
        for skill in skills.split(",")
        if skill.strip()
    ]

    projects = recommend_projects(missing_skills)

    return {
        "skills_to_improve": missing_skills,
        "project_recommendations": projects
    }



@app.post("/agents/full-career-plan")
async def full_career_plan(
    skills: str = Form(...),
    current_user_id: int = Depends(get_current_user)
):
    student_skills = [
        skill.strip()
        for skill in skills.split(",")
        if skill.strip()
    ]

    result = run_career_planner(student_skills)

    # Use the logged-in user's ID
    user_id = current_user_id

    # Save career plan in MySQL
    career_id = save_career_plan(
        user_id,
        result["recommended_career"],
        result["learning_plan"],
        result["project_recommendations"]
    )

    result["career_plan_id"] = career_id
    result["message"] = "Career plan generated and saved successfully"

    return result




@app.post("/internships/apply")
async def apply_for_internship(
    company: str = Form(...),
    role: str = Form(...),
    current_user_id: int = Depends(get_current_user)
):
    # Use the logged-in student's ID
    user_id = current_user_id

    application_id = save_internship_application(
        user_id,
        company,
        role
    )

    return {
        "application_id": application_id,
        "company": company,
        "role": role,
        "user_id": user_id,
        "status": "Applied",
        "message": "Internship application saved successfully"
    }



@app.post("/auth/signup")
async def signup(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...)
):
    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 8 characters"
        )

    existing_user = get_user_by_email(email)

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered"
        )

    hashed_password = hash_password(password)

    user_id = register_user(
        name,
        email,
        hashed_password
    )

    return {
        "user_id": user_id,
        "name": name,
        "email": email,
        "message": "Student registered successfully"
    }


@app.post("/auth/login")
async def login(
    email: str = Form(...),
    password: str = Form(...)
):
    user = get_user_by_email(email)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        password,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    access_token = create_access_token(user["id"])
    return {
        "user_id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "access_token": access_token,
        "token_type": "bearer",
        "message": "Login successful"
    }
    
@app.get("/dashboard/internships")
async def get_my_internships(
    current_user_id: int = Depends(get_current_user)
):
    applications = get_user_internship_applications(
        current_user_id
    )

    return {
        "user_id": current_user_id,
        "total_applications": len(applications),
        "applications": applications
    }


@app.get("/dashboard/career-plans")
async def get_my_career_plans(
    current_user_id: int = Depends(get_current_user)
):
    career_plans = get_user_career_plans(current_user_id)

    return {
        "user_id": current_user_id,
        "total_career_plans": len(career_plans),
        "career_plans": career_plans
    }



@app.get("/dashboard/resumes")
async def get_my_resumes(
    current_user_id: int = Depends(get_current_user)
):
    resumes = get_user_resume_analyses(current_user_id)

    return {
        "user_id": current_user_id,
        "total_resumes": len(resumes),
        "resumes": resumes
    }



@app.post("/dashboard/skill-progress")
async def update_skill_progress(
    request: SkillProgressRequest,
    current_user_id: int = Depends(get_current_user)
):
    save_skill_progress(
        current_user_id,
        request.skill_name,
        request.is_completed
    )

    return {
        "message": "Skill progress updated successfully",
        "skill": request.skill_name,
        "completed": request.is_completed
    }


@app.get("/dashboard/skill-progress")
async def read_skill_progress(
    current_user_id: int = Depends(get_current_user)
):
    skills = get_user_skills(current_user_id)

    completed_skills = [
        item["skill_name"]
        for item in skills
        if item["is_completed"]
    ]

    return {
        "completed_skills": completed_skills
    }

@app.post("/dashboard/skills")
async def create_skill(
    request: AddSkillRequest,
    current_user_id: int = Depends(get_current_user)
):
    skill_name = request.skill_name.strip()

    if not skill_name:
        raise HTTPException(
            status_code=400,
            detail="Skill name cannot be empty"
        )

    add_skill(current_user_id, skill_name)

    return {
        "message": "Skill added successfully",
        "skill": skill_name
    }


@app.get("/dashboard/skills")
async def read_user_skills(
    current_user_id: int = Depends(get_current_user)
):
    skills = get_user_skills(current_user_id)

    return {
        "skills": skills
    }