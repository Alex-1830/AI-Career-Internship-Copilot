
import { useState } from "react";
import axios from "axios";

function Internships() {
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [message, setMessage] = useState("");

    const handleApply = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("company", company);
        formData.append("role", role);

        try {
            const token = localStorage.getItem("access_token");

            const response = await axios.post(
                "http://127.0.0.1:8000/internships/apply",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message);
            setCompany("");
            setRole("");

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Application submission failed."
            );
        }
    };

    return (
        <div>
            <h1>Internship Application</h1>

            <form onSubmit={handleApply}>
                <input
                    type="text"
                    placeholder="Company Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    placeholder="Internship Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                />

                <br /><br />

                <button type="submit">
                    Submit Application
                </button>
            </form>

            <p>{message}</p>
        </div>
    );
}

export default Internships;
