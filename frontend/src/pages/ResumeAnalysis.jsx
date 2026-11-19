
import { useState } from "react";
import axios from "axios";
import {
    UploadCloud,
    FileText,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    LoaderCircle
} from "lucide-react";
import "./ResumeAnalysis.css";

function ResumeAnalysis() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        if (selectedFile.type !== "application/pdf") {
            setFile(null);
            setMessage("Please select a PDF file only.");
            setResult(null);
            return;
        }

        setFile(selectedFile);
        setMessage("");
        setResult(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage("Please select a PDF resume.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        setMessage("");
        setResult(null);

        try {
            const token = localStorage.getItem("access_token");

            const response = await axios.post(
                "/api/resume/analyze",
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
                error.response?.data?.detail ||
                "Resume analysis failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const extractedText = result?.extracted_text;

    const otherResults = result
        ? Object.entries(result).filter(
            ([key]) => key !== "extracted_text"
        )
        : [];

    return (
        <div className="resume-page">
            <div className="resume-header">
                <div>
                    <span className="resume-eyebrow">
                        <Sparkles size={15} /> AI POWERED TOOL
                    </span>
                    <h1>Resume Analysis</h1>
                    <p>
                        Upload your resume and let AI help you understand
                        the information in it.
                    </p>
                </div>
            </div>

            <div className="resume-content">
                <div className="resume-upload-card">
                    <div className="resume-card-heading">
                        <div className="resume-heading-icon">
                            <FileText size={23} />
                        </div>
                        <div>
                            <h2>Upload Your Resume</h2>
                            <p>Choose your resume in PDF format</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpload}>
                        <label
                            htmlFor="resume-file"
                            className={`resume-dropzone ${file ? "file-selected" : ""}`}
                        >
                            <div className="resume-upload-icon">
                                <UploadCloud size={34} />
                            </div>

                            <h3>
                                {file
                                    ? "Your resume is ready!"
                                    : "Upload your resume"}
                            </h3>

                            <p>
                                {file
                                    ? file.name
                                    : "Click here to browse and select your PDF file"}
                            </p>

                            <span className="resume-file-hint">
                                PDF files only
                            </span>

                            <input
                                id="resume-file"
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleFileChange}
                            />
                        </label>

                        {file && (
                            <div className="selected-file">
                                <FileText size={20} />
                                <div>
                                    <strong>{file.name}</strong>
                                    <span>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                </div>
                                <CheckCircle2
                                    className="file-check"
                                    size={21}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="resume-analyze-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle size={19} className="spin" />
                                    Analyzing Resume...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={19} />
                                    Analyze Resume
                                </>
                            )}
                        </button>
                    </form>

                    {message && (
                        <div
                            className={`resume-message ${
                                result ? "success" : "error"
                            }`}
                        >
                            {result ? (
                                <CheckCircle2 size={19} />
                            ) : (
                                <AlertCircle size={19} />
                            )}
                            {message}
                        </div>
                    )}
                </div>

                <div className="resume-info-card">
                    <div className="resume-info-icon">
                        <Sparkles size={23} />
                    </div>
                    <h2>What happens next?</h2>
                    <p>
                        Your uploaded resume is processed by the application
                        to extract its text and display the available details.
                    </p>

                    <div className="resume-info-step">
                        <span>01</span>
                        <div>
                            <strong>Upload Resume</strong>
                            <p>Select your PDF resume.</p>
                        </div>
                    </div>

                    <div className="resume-info-step">
                        <span>02</span>
                        <div>
                            <strong>AI Processing</strong>
                            <p>Your resume is sent for processing.</p>
                        </div>
                    </div>

                    <div className="resume-info-step">
                        <span>03</span>
                        <div>
                            <strong>View Results</strong>
                            <p>See the extracted resume information.</p>
                        </div>
                    </div>
                </div>
            </div>

            {result && (
                <div className="resume-results">
                    <div className="results-heading">
                        <div className="results-title-icon">
                            <CheckCircle2 size={23} />
                        </div>
                        <div>
                            <h2>Analysis Results</h2>
                            <p>Your resume has been processed successfully.</p>
                        </div>
                    </div>

                    {otherResults.length > 0 && (
                        <div className="resume-result-details">
                            {otherResults.map(([key, value]) => (
                                <div className="result-detail" key={key}>
                                    <span>
                                        {key.replaceAll("_", " ")}
                                    </span>
                                    <strong>
                                        {typeof value === "object"
                                            ? JSON.stringify(value)
                                            : String(value)}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    )}

                    {extractedText && (
                        <div className="extracted-text-card">
                            <h3>
                                <FileText size={19} />
                                Extracted Resume Text
                            </h3>
                            <pre>{extractedText}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ResumeAnalysis;
