import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import CareerPlan from "./pages/CareerPlan";
import Internships from "./pages/Internships";
import MyApplications from "./pages/MyApplications";
import ProtectedRoute from "./ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>
                <Route
    path="/resume-analysis"
    element={
        <ProtectedRoute>
            <ResumeAnalysis />
        </ProtectedRoute>
    }
/>
                <Route
    path="/career-plan"
    element={
        <ProtectedRoute>
            <CareerPlan />
        </ProtectedRoute>
    }
/>
                <Route
    path="/internships"
    element={
        <ProtectedRoute>
            <Internships />
        </ProtectedRoute>
    }
/>
                <Route
    path="/my-applications"
    element={
        <ProtectedRoute>
            <MyApplications />
        </ProtectedRoute>
    }
/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;