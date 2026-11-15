
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append("email", email);
            formData.append("password", password);

            const response = await axios.post(
                "/api/auth/login",
                formData
            );

            localStorage.setItem(
                "access_token",
                response.data.access_token
            );

            localStorage.setItem(
                "user_id",
                response.data.user_id
            );

            setMessage("Login successful!");
            navigate("/dashboard");

        } catch (error) {
            setMessage(
                error.response?.data?.detail || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-left">
                <div className="login-brand">
                    <span className="brand-icon">✦</span>
                    CAREER COPILOT
                </div>

                <div className="login-intro">
                    <span className="intro-label">
                        YOUR AI CAREER ASSISTANT
                    </span>

                    <h1>
                        Build your future.
                        <br />
                        <span>One skill at a time.</span>
                    </h1>

                    <p>
                        Analyze your resume, discover career
                        opportunities, build skills, and take
                        control of your professional journey
                        with AI.
                    </p>

                    <div className="feature-list">
                        <div>✦ AI-powered career planning</div>
                        <div>✦ Smart resume analysis</div>
                        <div>✦ Personalized skill tracking</div>
                    </div>
                </div>

                <div className="login-footer">
                    AI CAREER & INTERNSHIP COPILOT
                </div>
            </div>

            <div className="login-right">
                <div className="login-card">

                    <div className="login-card-icon">✦</div>

                    <h2>Welcome back!</h2>

                    <p className="login-subtitle">
                        Sign in to continue your career journey.
                    </p>

                    <form onSubmit={handleLogin}>

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In →"}
                        </button>

                    </form>

                    {message && (
                        <p className="login-message" role="alert">
                            {message}
                        </p>
                    )}

                    <div className="login-bottom">
                        Secure Student Login
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Login;
