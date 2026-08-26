import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

function getUserRole(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role;
    } catch {
        return null;
    }
}

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    const role = getUserRole(token);

    if (allowedRoles && !allowedRoles.includes(role)) {
        return (
            <>
                <Navbar />

                <main className="app-main">
                    <div className="container py-5">
                        <div className="alert alert-danger text-center">
                            <h3>Access Denied</h3>
                            <p className="mb-0">
                                You do not have permission to access this page.
                            </p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="app-main">
                {children}
            </main>
        </>
    );
}

export default ProtectedRoute;