import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    let role = "";

    if (token) {
        try {
            const decoded = jwtDecode(token);
            role = decoded.role;
        } catch (error) {
            console.error("Invalid token");
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const linkClass = ({ isActive }) =>
        `sidebar-link ${isActive ? "active" : ""}`;

    return (
        <aside className="app-sidebar">

            <div className="sidebar-brand">
                <NavLink to="/dashboard">
                    VisitorPass
                </NavLink>
            </div>

            <div className="sidebar-menu">

                <div className="sidebar-section-title">
                    Main
                </div>

                <NavLink
                    to="/dashboard"
                    className={linkClass}
                >
                    <span className="sidebar-icon">▦</span>
                    <span>Dashboard</span>
                </NavLink>


                {role === "admin" && (
                    <>
                        <div className="sidebar-section-title">
                            Management
                        </div>

                        <NavLink
                            to="/visitors"
                            className={linkClass}
                        >
                            <span className="sidebar-icon">◉</span>
                            <span>Visitors</span>
                        </NavLink>

                        <NavLink
                            to="/appointments"
                            className={linkClass}
                        >
                            <span className="sidebar-icon">◷</span>
                            <span>Appointments</span>
                        </NavLink>

                        <NavLink
                            to="/passes"
                            className={linkClass}
                        >
                            <span className="sidebar-icon">▣</span>
                            <span>Passes</span>
                        </NavLink>

                        <NavLink
                            to="/scan"
                            className={linkClass}
                        >
                            <span className="sidebar-icon">⌗</span>
                            <span>Scan QR</span>
                        </NavLink>

                        <NavLink
                            to="/reports"
                            className={linkClass}
                        >
                            <span className="sidebar-icon">▤</span>
                            <span>Reports</span>
                        </NavLink>
                    </>
                )}


                {role === "security" && (
                    <>
                        <div className="sidebar-section-title">
                            Security
                        </div>

                        <NavLink
                            to="/passes"
                            className={linkClass}
                        >
                            <span className="sidebar-icon">▣</span>
                            <span>Passes</span>
                        </NavLink>

                        <NavLink
                            to="/scan"
                            className={linkClass}
                        >
                            <span className="sidebar-icon">⌗</span>
                            <span>Scan QR</span>
                        </NavLink>
                    </>
                )}


                {role === "employee" && (
                    <>
                        <div className="sidebar-section-title">
                            Employee
                        </div>

                        <NavLink
                            to="/visitors"
                            className={linkClass}
                        >
                            <span className="sidebar-icon">◉</span>
                            <span>Visitors</span>
                        </NavLink>

                        <NavLink
                            to="/appointments"
                            className={linkClass}
                        >
                            <span className="sidebar-icon">◷</span>
                            <span>Appointments</span>
                        </NavLink>
                    </>
                )}

            </div>


            <div className="sidebar-bottom">

                <div className="sidebar-user">

                    <strong className="text-capitalize">
                        {role || "User"}
                    </strong>

                    <div className="sidebar-user-role">
                        VisitorPass account
                    </div>

                </div>

                <button
                    className="sidebar-logout"
                    onClick={handleLogout}
                >
                    ⇥ &nbsp; Logout
                </button>

            </div>

        </aside>
    );
}

export default Navbar;