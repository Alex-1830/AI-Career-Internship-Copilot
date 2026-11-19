
import { useState } from "react";
import axios from "axios";
import {
    BriefcaseBusiness,
    Building2,
    Target,
    Send,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    LoaderCircle
} from "lucide-react";
import "./Internships.css";

function Internships() {
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [skills, setSkills] = useState("");
    const [predictedRole, setPredictedRole] = useState("");
    const [predictionMessage, setPredictionMessage] = useState("");
    const [predicting, setPredicting] = useState(false);

    const handleApply = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("company", company);
        formData.append("role", role);

        setLoading(true);
        setMessage("");
        setSuccess(false);

        try {
            const token = localStorage.getItem("access_token");

            const response = await axios.post(
                "/api/internships/apply",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message);
            setSuccess(true);
            setCompany("");
            setRole("");

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Application submission failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();

        if (!skills.trim()) {
            setPredictionMessage("Please enter your skills.");
            return;
        }

        const formData = new FormData();
        formData.append("skills", skills);

        setPredicting(true);
        setPredictedRole("");
        setPredictionMessage("");

        try {
            const token = localStorage.getItem("access_token");

            const response = await axios.post(
                "/api/internships/predict-role",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setPredictedRole(
                response.data.predicted_internship_role
            );
            setPredictionMessage(response.data.message);

        } catch (error) {
            setPredictionMessage(
                error.response?.data?.detail ||
                "Role prediction failed."
            );
        } finally {
            setPredicting(false);
        }
    };

    return (
        <div className="internship-page">

            <div className="internship-header">
                <span className="internship-eyebrow">
                    <Sparkles size={15} /> CAREER OPPORTUNITIES
                </span>

                <h1>Internship Applications</h1>

                <p>
                    Track your internship applications and take the next
                    step towards your professional career.
                </p>
            </div>

            <div className="internship-main-grid">

                <div className="internship-form-card">

                    <div className="internship-card-heading">
                        <div className="internship-heading-icon">
                            <BriefcaseBusiness size={23} />
                        </div>

                        <div>
                            <h2>Add Internship Application</h2>
                            <p>Enter the details of the internship you applied for.</p>
                        </div>
                    </div>

                    <form onSubmit={handleApply}>

                        <label htmlFor="company-name">
                            Company Name
                        </label>

                        <div className="internship-input-wrapper">
                            <Building2 size={19} />
                            <input
                                id="company-name"
                                type="text"
                                placeholder="Example: Google, Microsoft, TCS"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                            />
                        </div>

                        <label htmlFor="internship-role">
                            Internship Role
                        </label>

                        <div className="internship-input-wrapper">
                            <Target size={19} />
                            <input
                                id="internship-role"
                                type="text"
                                placeholder="Example: Python Developer Intern"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="internship-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={19}
                                        className="internship-spin"
                                    />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Submit Application
                                </>
                            )}
                        </button>

                    </form>

                    {message && (
                        <div className={`internship-message ${
                            success ? "success" : "error"
                        }`}>
                            {success ? (
                                <CheckCircle2 size={19} />
                            ) : (
                                <AlertCircle size={19} />
                            )}
                            {message}
                        </div>
                    )}

                </div>

                <div className="internship-info-card">

                    <div className="internship-info-icon">
                        <BriefcaseBusiness size={24} />
                    </div>

                    <h2>Application Tracker</h2>

                    <p>
                        Keep your internship applications organized
                        and stay focused on your career goals.
                    </p>

                    <div className="internship-info-step">
                        <span>01</span>
                        <div>
                            <strong>Find Opportunities</strong>
                            <p>Explore internships that match your skills.</p>
                        </div>
                    </div>

                    <div className="internship-info-step">
                        <span>02</span>
                        <div>
                            <strong>Submit Applications</strong>
                            <p>Record the company and internship role.</p>
                        </div>
                    </div>

                    <div className="internship-info-step">
                        <span>03</span>
                        <div>
                            <strong>Track Your Progress</strong>
                            <p>Keep a record of your applications.</p>
                        </div>
                    </div>

                </div>

            </div>

            {/* ML Internship Role Predictor */}

            <div className="internship-form-card">

                <div className="internship-card-heading">
                    <div className="internship-heading-icon">
                        <Sparkles size={23} />
                    </div>

                    <div>
                        <h2>ML Internship Role Predictor</h2>
                        <p>Enter your skills to predict a suitable internship role.</p>
                    </div>
                </div>

                <form onSubmit={handlePredict}>

                    <label htmlFor="student-skills">
                        Your Skills
                    </label>

                    <div className="internship-input-wrapper">
                        <Target size={19} />
                        <input
                            id="student-skills"
                            type="text"
                            placeholder="Example: Python, Machine Learning, Pandas"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="internship-submit-btn"
                        disabled={predicting}
                    >
                        {predicting ? (
                            <>
                                <LoaderCircle
                                    size={19}
                                    className="internship-spin"
                                />
                                Predicting...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Predict Role
                            </>
                        )}
                    </button>

                </form>

                {predictionMessage && (
                    <div className={`internship-message ${
                        predictedRole ? "success" : "error"
                    }`}>
                        {predictedRole ? (
                            <CheckCircle2 size={19} />
                        ) : (
                            <AlertCircle size={19} />
                        )}
                        {predictionMessage}
                    </div>
                )}

                {predictedRole && (
                    <div>
                        <h3>Predicted Internship Role</h3>
                        <h2>{predictedRole}</h2>
                    </div>
                )}

            </div>

        </div>
    );
}

export default Internships;
