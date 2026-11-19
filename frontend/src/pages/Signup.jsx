
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage("");

        if (password.length < 8) {
            setMessage("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);

            const response = await axios.post(
                "/api/auth/signup",
                formData
            );

            setMessage(
                response.data.message || "Registration successful!"
            );

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Registration failed."
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
                        START YOUR CAREER JOURNEY
                    </span>

                    <h1>
                        Your future.
                        <br />
                        <span>Starts here.</span>
                    </h1>

                    <p>
                        Create your account and explore AI-powered
                        career planning, resume analysis, and
                        internship opportunities.
                    </p>

                    <div className="feature-list">
                        <div>✦ Personalized career planning</div>
                        <div>✦ Smart resume analysis</div>
                        <div>✦ Internship recommendations</div>
                    </div>
                </div>

                <div className="login-footer">
                    AI CAREER & INTERNSHIP COPILOT
                </div>
            </div>

            <div className="login-right">
                <div className="login-card">

                    <div className="login-card-icon">✦</div>

                    <h2>Create Account</h2>

                    <p className="login-subtitle">
                        Register to start your career journey.
                    </p>

                    <form onSubmit={handleSignup}>

                        <label htmlFor="signup-name">
                            Full Name
                        </label>

                        <input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <label htmlFor="signup-email">
                            Email Address
                        </label>

                        <input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label htmlFor="signup-password">
                            Password
                        </label>

                        <input
                            id="signup-password"
                            type="password"
                            placeholder="Minimum 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Creating Account..." : "Sign Up →"}
                        </button>

                    </form>

                    {message && (
                        <p className="login-message" role="alert">
                            {message}
                        </p>
                    )}

                    <div className="login-bottom">
                        Already have an account?{" "}
                        <Link to="/login">Sign In</Link>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Signup;
