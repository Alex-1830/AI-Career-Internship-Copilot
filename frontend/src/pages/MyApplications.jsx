
import { useEffect, useState } from "react";
import axios from "axios";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [message, setMessage] = useState("Loading applications...");

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await axios.get(
                    "/api/dashboard/internships",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setApplications(response.data.applications);
                setMessage("");
            } catch (error) {
                setMessage(
                    error.response?.data?.detail ||
                    "Unable to load applications."
                );
            }
        };

        fetchApplications();
    }, []);

    return (
        <div>
            <h1>My Internship Applications</h1>

            {message && <p>{message}</p>}

            {applications.length > 0 ? (
                applications.map((application, index) => (
                    <div key={application.id || index}>
                        <h3>{application.company}</h3>
                        <p>Role: {application.role}</p>
                        <p>Status: {application.application_status}</p>
                        <hr />
                    </div>
                ))
            ) : (
                !message && <p>No applications found.</p>
            )}
        </div>
    );
}

export default MyApplications;
