
import { useState } from "react";
import axios from "axios";

function CareerPlan() {
    const [skills, setSkills] = useState("");
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");

    const handleGenerate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("skills", skills);

        try {
            const token = localStorage.getItem("access_token");

            const response = await axios.post(
                "http://127.0.0.1:8000/agents/full-career-plan",
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
        }
    };

    return (
        <div>
            <h1>AI Career Plan Generator</h1>

            <form onSubmit={handleGenerate}>
                <input
                    type="text"
                    placeholder="Enter skills separated by commas"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    required
                />

                <br /><br />

                <button type="submit">
                    Generate Career Plan
                </button>
            </form>

            <p>{message}</p>

            {result && (
                <div>
                    <h2>Recommended Career</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default CareerPlan;
