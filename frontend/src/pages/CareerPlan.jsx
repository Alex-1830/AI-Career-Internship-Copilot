
import { useState } from "react";
import axios from "axios";
import {
    Sparkles,
    Target,
    Brain,
    BookOpen,
    CheckCircle2,
    AlertCircle,
    LoaderCircle,
    GraduationCap
} from "lucide-react";
import "./CareerPlan.css";

function CareerPlan() {
    const [skills, setSkills] = useState("");
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();

        if (!skills.trim()) {
            setMessage("Please enter your skills.");
            return;
        }

        const formData = new FormData();
        formData.append("skills", skills);

        setLoading(true);
        setMessage("");
        setResult(null);

        try {
            const token = localStorage.getItem("access_token");

            const response = await axios.post(
                "/api/agents/full-career-plan",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setResult(response.data);
            setMessage("Career plan generated successfully!");
        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Career plan generation failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatValue = (value) => {
        if (typeof value === "string") return value;

        if (Array.isArray(value)) {
            return value.map((item) =>
                typeof item === "object"
                    ? JSON.stringify(item)
                    : String(item)
            );
        }

        if (value && typeof value === "object") {
            return Object.entries(value).map(
                ([key, item]) => `${key.replaceAll("_", " ")}: ${
                    typeof item === "object"
                        ? JSON.stringify(item)
                        : String(item)
                }`
            );
        }

        return String(value ?? "");
    };

    const resultEntries = result
        ? Object.entries(result).filter(
            ([key]) =>
                !["success", "message"].includes(key.toLowerCase())
        )
        : [];

    return (
        <div className="career-page">

            <div className="career-header">
                <span className="career-eyebrow">
                    <Sparkles size={15} /> AI CAREER ASSISTANT
                </span>

                <h1>AI Career Plan Generator</h1>

                <p>
                    Discover your career direction and generate a
                    personalized learning roadmap based on your skills.
                </p>
            </div>

            <div className="career-main-grid">

                <div className="career-form-card">

                    <div className="career-card-heading">
                        <div className="career-heading-icon">
                            <Brain size={23} />
                        </div>

                        <div>
                            <h2>Build Your Career Path</h2>
                            <p>Tell us about your current skills.</p>
                        </div>
                    </div>

                    <form onSubmit={handleGenerate}>

                        <label htmlFor="career-skills">
                            Your Technical Skills
                        </label>

                        <textarea
                            id="career-skills"
                            placeholder="Example: Python, Java, Machine Learning, SQL, HTML, CSS..."
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            required
                            rows={5}
                        />

                        <p className="career-input-hint">
                            Separate multiple skills using commas.
                        </p>

                        <button
                            type="submit"
                            className="career-generate-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={19}
                                        className="career-spin"
                                    />
                                    Generating Your Plan...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={19} />
                                    Generate Career Plan
                                </>
                            )}
                        </button>

                    </form>

                    {message && (
                        <div className={`career-message ${
                            result ? "success" : "error"
                        }`}>
                            {result ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <AlertCircle size={18} />
                            )}
                            {message}
                        </div>
                    )}

                </div>

                <div className="career-info-card">

                    <div className="career-info-icon">
                        <Target size={24} />
                    </div>

                    <h2>Your Career Journey</h2>

                    <p>
                        Turn your existing knowledge into a clear
                        career development roadmap.
                    </p>

                    <div className="career-info-step">
                        <span>01</span>
                        <div>
                            <strong>Enter Your Skills</strong>
                            <p>Share your technical knowledge.</p>
                        </div>
                    </div>

                    <div className="career-info-step">
                        <span>02</span>
                        <div>
                            <strong>AI Career Analysis</strong>
                            <p>Generate recommendations using AI.</p>
                        </div>
                    </div>

                    <div className="career-info-step">
                        <span>03</span>
                        <div>
                            <strong>Follow Your Roadmap</strong>
                            <p>Work towards your career goals.</p>
                        </div>
                    </div>

                </div>

            </div>

            {result && (
                <div className="career-results">

                    <div className="career-results-heading">
                        <div className="career-results-icon">
                            <GraduationCap size={24} />
                        </div>

                        <div>
                            <h2>Your Career Recommendations</h2>
                            <p>
                                Here is the career plan returned by your AI agent.
                            </p>
                        </div>
                    </div>

                    <div className="career-result-grid">

                        {resultEntries.map(([key, value]) => (
                            <div className="career-result-card" key={key}>

                                <div className="career-result-card-icon">
                                    {key.toLowerCase().includes("role") ? (
                                        <Target size={21} />
                                    ) : key.toLowerCase().includes("project") ? (
                                        <Brain size={21} />
                                    ) : (
                                        <BookOpen size={21} />
                                    )}
                                </div>

                                <h3>
                                    {key.replaceAll("_", " ")}
                                </h3>

                                {Array.isArray(formatValue(value)) ? (
                                    <ul>
                                        {formatValue(value).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{formatValue(value)}</p>
                                )}

                            </div>
                        ))}

                    </div>

                </div>
            )}

        </div>
    );
}

export default CareerPlan;
