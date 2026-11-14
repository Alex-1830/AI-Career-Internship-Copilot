
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
    Home,
    FileText,
    Brain,
    BriefcaseBusiness,
    ClipboardList,
    LogOut,
    Sparkles,
    Upload,
    ArrowRight,
    Target,
    GraduationCap,
    Clock,
    CheckCircle2,
    Plus
} from "lucide-react";

import "./Dashboard.css";

const API_URL = "http://127.0.0.1:8000";

function Dashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        resumes: 0,
        careerPlans: 0,
        applications: 0
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [careerGoal, setCareerGoal] = useState(null);

    const [mySkills, setMySkills] = useState([]);
    const [completedSkills, setCompletedSkills] = useState([]);

    const [newSkill, setNewSkill] = useState("");
    const [addingSkill, setAddingSkill] = useState(false);

    const [loading, setLoading] = useState(true);

    const getConfig = () => {
        const token = localStorage.getItem("access_token");

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = getConfig();

                const [
                    resumes,
                    plans,
                    applications,
                    skills
                ] = await Promise.all([
                    axios.get(`${API_URL}/dashboard/resumes`, config),
                    axios.get(`${API_URL}/dashboard/career-plans`, config),
                    axios.get(`${API_URL}/dashboard/internships`, config),
                    axios.get(`${API_URL}/dashboard/skills`, config)
                ]);

                // Load all skills saved in MySQL.
                const savedSkills = (skills.data.skills || []).map(item => ({
                    skill_name: item.skill_name,
                    is_completed: Boolean(item.is_completed)
                }));

                setMySkills(savedSkills);

                setCompletedSkills(
                    savedSkills
                        .filter(item => item.is_completed)
                        .map(item => item.skill_name)
                );

                // Dashboard statistics.
                setStats({
                    resumes: resumes.data.total_resumes || 0,
                    careerPlans: plans.data.total_career_plans || 0,
                    applications: applications.data.total_applications || 0
                });

                // Resume activities.
                const resumeActivities = (resumes.data.resumes || []).map(item => ({
                    id: `resume-${item.id}`,
                    type: "resume",
                    title: "Resume Analyzed",
                    description: item.skills || "Resume analysis completed",
                    date: item.analyzed_at
                }));

                // Career plan activities.
                const planActivities = (plans.data.career_plans || []).map(item => ({
                    id: `plan-${item.id}`,
                    type: "career",
                    title: "Career Plan Created",
                    description: `Recommended role: ${item.recommended_role}`,
                    date: item.created_at
                }));

                // Internship activities.
                const applicationActivities =
                    (applications.data.applications || []).map(item => ({
                        id: `application-${item.id}`,
                        type: "application",
                        title: "Internship Application",
                        description: `${item.company} - ${item.role} (${item.application_status})`,
                        date: item.applied_at
                    }));

                const allActivities = [
                    ...resumeActivities,
                    ...planActivities,
                    ...applicationActivities
                ];

                allActivities.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );

                setRecentActivity(allActivities);

                // Latest career plan and resume.
                const latestPlan = plans.data.career_plans?.[0];
                const latestResume = resumes.data.resumes?.[0];

                setCareerGoal({
                    role: latestPlan?.recommended_role || "Not available",

                    existingSkills: latestResume?.skills
                        ? latestResume.skills
                            .split(",")
                            .map(skill => skill.trim())
                            .filter(Boolean)
                        : [],

                    learningPlan: Array.isArray(latestPlan?.learning_plan)
                        ? latestPlan.learning_plan
                        : []
                });

            } catch (error) {
                console.log("Dashboard data error:", error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user_id");
                    navigate("/");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    // Combine AI roadmap skills and manually added skills.
    // This prevents the same skill from appearing twice.
    const roadmapSkills = (careerGoal?.learningPlan || [])
        .map(item => item.skill)
        .filter(Boolean);

    const savedSkillNames = mySkills.map(item => item.skill_name);

    const allSkills = [
        ...new Map(
            [...roadmapSkills, ...savedSkillNames].map(skill => [
                skill.trim().toLowerCase(),
                skill.trim()
            ])
        ).values()
    ];

    const completedCount = allSkills.filter(skill =>
        completedSkills.some(
            completed => completed.toLowerCase() === skill.toLowerCase()
        )
    ).length;

    const progressPercentage = allSkills.length > 0
        ? Math.round((completedCount / allSkills.length) * 100)
        : 0;

    // Logout.
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        navigate("/");
    };

    // Add a new skill to MySQL.
    const handleAddSkill = async (event) => {
        event.preventDefault();

        const skillName = newSkill.trim();

        if (!skillName) {
            alert("Please enter a skill name.");
            return;
        }

        const alreadyExists = allSkills.some(
            skill => skill.toLowerCase() === skillName.toLowerCase()
        );

        if (alreadyExists) {
            alert("This skill is already in your Skill Tracker.");
            return;
        }

        try {
            setAddingSkill(true);

            await axios.post(
                `${API_URL}/dashboard/skills`,
                {
                    skill_name: skillName
                },
                getConfig()
            );

            setMySkills(previousSkills => [
                ...previousSkills,
                {
                    skill_name: skillName,
                    is_completed: false
                }
            ]);

            setNewSkill("");

        } catch (error) {
            console.log("Add skill error:", error);

            alert(
                error.response?.data?.detail ||
                "Unable to add skill. Please try again."
            );
        } finally {
            setAddingSkill(false);
        }
    };

    // Save completed / incomplete status in MySQL.
    const toggleSkill = async (skill) => {
        const isCurrentlyCompleted = completedSkills.some(
            item => item.toLowerCase() === skill.toLowerCase()
        );

        const newStatus = !isCurrentlyCompleted;

        try {
            await axios.post(
                `${API_URL}/dashboard/skill-progress`,
                {
                    skill_name: skill,
                    is_completed: newStatus
                },
                getConfig()
            );

            if (newStatus) {
                setCompletedSkills(previousSkills => [
                    ...previousSkills.filter(
                        item => item.toLowerCase() !== skill.toLowerCase()
                    ),
                    skill
                ]);
            } else {
                setCompletedSkills(previousSkills =>
                    previousSkills.filter(
                        item => item.toLowerCase() !== skill.toLowerCase()
                    )
                );
            }

            setMySkills(previousSkills => {
                const exists = previousSkills.some(
                    item => item.skill_name.toLowerCase() === skill.toLowerCase()
                );

                if (!exists) {
                    return [
                        ...previousSkills,
                        {
                            skill_name: skill,
                            is_completed: newStatus
                        }
                    ];
                }

                return previousSkills.map(item =>
                    item.skill_name.toLowerCase() === skill.toLowerCase()
                        ? { ...item, is_completed: newStatus }
                        : item
                );
            });

        } catch (error) {
            console.log("Skill progress update error:", error);
            alert("Unable to save skill progress. Please try again.");
        }
    };

    // Format date.
    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    // Find the AI roadmap details for a skill.
    const getSkillDetails = (skill) => {
        return (careerGoal?.learningPlan || []).find(
            item =>
                item.skill?.toLowerCase() === skill.toLowerCase()
        );
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading your dashboard...
            </div>
        );
    }

    return (
        <div className="dashboard-container">

            {/* Sidebar */}
            <aside className="sidebar">
                <h2><Sparkles size={26} /></h2>

                <Link to="/dashboard" title="Dashboard">
                    <Home size={21} />
                </Link>

                <Link to="/resume-analysis" title="Resume Analysis">
                    <FileText size={21} />
                </Link>

                <Link to="/career-plan" title="AI Career Plan">
                    <Brain size={21} />
                </Link>

                <Link to="/internships" title="Internships">
                    <BriefcaseBusiness size={21} />
                </Link>

                <Link to="/my-applications" title="My Applications">
                    <ClipboardList size={21} />
                </Link>
            </aside>

            {/* Main Dashboard */}
            <main className="dashboard-main">

                {/* Header */}
                <header className="dashboard-header">
                    <div>
                        <h1>
                            Good to see you! <Sparkles size={24} />
                        </h1>

                        <p>
                            Your personal AI career assistant.
                            Let's build your future!
                        </p>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </header>

                {/* Statistics */}
                <section className="dashboard-stats">

                    <div className="stat-card">
                        <p>Resumes Analyzed</p>
                        <h2>{stats.resumes}</h2>
                    </div>

                    <div className="stat-card">
                        <p>Career Plans Created</p>
                        <h2>{stats.careerPlans}</h2>
                    </div>

                    <div className="stat-card">
                        <p>Internship Applications</p>
                        <h2>{stats.applications}</h2>
                    </div>

                    <div className="stat-card">
                        <p>Career Tools</p>
                        <h2>04</h2>
                    </div>

                </section>

                {/* Main Workspace */}
                <section className="dashboard-workspace">

                    <div className="workspace-panel">
                        <Upload size={27} color="#a78bfa" />

                        <h3>Resume Analysis</h3>

                        <p>
                            Upload your resume and let AI analyze
                            your skills and identify improvement areas.
                        </p>

                        <Link to="/resume-analysis">
                            <button>
                                Upload Resume <ArrowRight size={15} />
                            </button>
                        </Link>
                    </div>

                    <div className="workspace-panel">
                        <Brain size={27} color="#22d3ee" />

                        <h3>Your Career Tools</h3>

                        <p>
                            Use intelligent AI tools to plan
                            and improve your career journey.
                        </p>

                        <p>
                            <GraduationCap size={16} />
                            AI-powered career guidance
                        </p>

                        <p>
                            <Target size={16} />
                            Personalized learning roadmap
                        </p>

                        <Link to="/career-plan">
                            <button>
                                Generate Career Plan
                                <ArrowRight size={15} />
                            </button>
                        </Link>
                    </div>

                    <div className="workspace-panel">
                        <Sparkles size={27} color="#f472b6" />

                        <h3>Quick Actions</h3>

                        <p>Jump directly into your career activities.</p>

                        <Link to="/resume-analysis">
                            <button>
                                <FileText size={15} />
                                Analyze Resume
                            </button>
                        </Link>

                        <Link to="/career-plan">
                            <button>
                                <Brain size={15} />
                                Generate Career Plan
                            </button>
                        </Link>

                        <Link to="/internships">
                            <button>
                                <BriefcaseBusiness size={15} />
                                Apply for Internship
                            </button>
                        </Link>

                        <Link to="/my-applications">
                            <button>
                                <ClipboardList size={15} />
                                Track Applications
                            </button>
                        </Link>
                    </div>

                </section>

                {/* Career Progress */}
                <section className="workspace-panel career-progress">

                    <h3>
                        <Target size={22} /> Career Progress
                    </h3>

                    <p>Track your activity towards your starter goals.</p>

                    <div className="progress-item">
                        <div className="progress-heading">
                            <span>Resume Analysis</span>
                            <span>{stats.resumes}/5</span>
                        </div>

                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${Math.min(stats.resumes / 5 * 100, 100)}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="progress-item">
                        <div className="progress-heading">
                            <span>Career Plans</span>
                            <span>{stats.careerPlans}/5</span>
                        </div>

                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${Math.min(stats.careerPlans / 5 * 100, 100)}%`
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="progress-item">
                        <div className="progress-heading">
                            <span>Internship Applications</span>
                            <span>{stats.applications}/10</span>
                        </div>

                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${Math.min(stats.applications / 10 * 100, 100)}%`
                                }}
                            ></div>
                        </div>
                    </div>

                </section>

                {/* Career Goal & Skill Tracker */}
                <section className="workspace-panel skill-tracker">

                    <h3>
                        <GraduationCap size={22} />
                        Career Goal & Skill Progress
                    </h3>

                    <h4>Recommended Career Role</h4>

                    <p>{careerGoal?.role || "Generate a career plan to see your recommended role."}</p>

                    <h4>Existing Skills</h4>

                    <div className="skill-list">
                        {careerGoal?.existingSkills?.length > 0 ? (
                            careerGoal.existingSkills.map((skill, index) => (
                                <span className="skill-tag" key={index}>
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p>No existing skills found. Analyze your resume to see them here.</p>
                        )}
                    </div>

                    <h4>My Skill Tracker</h4>

                    <p>
                        Add your own skills or track skills from your AI learning roadmap.
                        Your progress is saved automatically.
                    </p>

                    <form className="add-skill-form" onSubmit={handleAddSkill}>
                        <input
                            type="text"
                            value={newSkill}
                            onChange={event => setNewSkill(event.target.value)}
                            placeholder="Enter a skill (e.g. Python, Java, SQL)"
                            maxLength={255}
                        />

                        <button type="submit" disabled={addingSkill}>
                            <Plus size={17} />
                            {addingSkill ? "Adding..." : "Add Skill"}
                        </button>
                    </form>

                    {allSkills.length > 0 ? (
                        <>
                            <div className="skill-progress-summary">
                                <div className="progress-heading">
                                    <span>Overall Skill Progress</span>
                                    <strong>
                                        {completedCount}/{allSkills.length} completed ({progressPercentage}%)
                                    </strong>
                                </div>

                                <div className="progress-track">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${progressPercentage}%`
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="skill-learning-list">
                                {allSkills.map(skill => {
                                    const details = getSkillDetails(skill);

                                    const isCompleted = completedSkills.some(
                                        item => item.toLowerCase() === skill.toLowerCase()
                                    );

                                    return (
                                        <div className="learning-item" key={skill}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={isCompleted}
                                                    onChange={() => toggleSkill(skill)}
                                                />

                                                <span>
                                                    <strong>{skill}</strong>

                                                    <small>
                                                        {details
                                                            ? `${details.duration || "Learning"} — ${details.task || "Practice this skill"}`
                                                            : "Personal skill"}
                                                    </small>
                                                </span>
                                            </label>

                                            {isCompleted && (
                                                <span className="skill-completed-label">
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <p className="empty-skills-message">
                            No skills added yet. Add your first skill above or generate an AI career plan.
                        </p>
                    )}

                </section>

                {/* Recent Activity */}
                <section className="workspace-panel recent-activity">

                    <h3>
                        <Clock size={22} /> Recent Activity
                    </h3>

                    <p>Your latest career activities and updates.</p>

                    {recentActivity.length === 0 ? (
                        <p>No recent activity available.</p>
                    ) : (
                        <div className="activity-list">

                            {recentActivity.slice(0, 10).map(item => (
                                <div
                                    className="activity-item"
                                    key={item.id}
                                >
                                    <div className="activity-icon">

                                        {item.type === "resume" && (
                                            <FileText size={20} />
                                        )}

                                        {item.type === "career" && (
                                            <Brain size={20} />
                                        )}

                                        {item.type === "application" && (
                                            <BriefcaseBusiness size={20} />
                                        )}

                                    </div>

                                    <div className="activity-details">
                                        <h4>{item.title}</h4>

                                        <p>{item.description}</p>

                                        <span>
                                            {formatDate(item.date)}
                                        </span>
                                    </div>

                                    <CheckCircle2
                                        size={19}
                                        className="activity-status"
                                    />
                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default Dashboard;
