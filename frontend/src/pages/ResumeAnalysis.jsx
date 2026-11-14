
import { useState } from "react";
import axios from "axios";

function ResumeAnalysis() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage("Please select a PDF resume.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem("access_token");

            const response = await axios.post(
                "http://127.0.0.1:8000/resume/analyze",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setResult(response.data);
            setMessage("Resume analyzed successfully!");
        } catch (error) {
            setMessage(
                error.response?.data?.detail || "Resume analysis failed."
            );
        }
    };

    return (
        <div>
            <h1>Resume Analysis</h1>

            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <br /><br />

                <button type="submit">
                    Analyze Resume
                </button>
            </form>

            <p>{message}</p>

            {result && (
                <div>
                    <h2>Analysis Results</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default ResumeAnalysis;
