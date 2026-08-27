import "../style/dashboard.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL, apiUrl } from "../config/api";

function Dashboard() {

    const [role] = useState(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return "";
        }

        try {
            return JSON.parse(atob(token.split(".")[1])).role || "";
        } catch (error) {
            console.error("Could not read user role:", error);
            return "";
        }
    });

    const [stats, setStats] = useState({
        totalVisitors: 0,
        activePasses: 0,
        currentlyCheckedIn: 0,
        totalAppointments: 0,
        recentVisitors: []
    });


    // ==========================================
    // GET DASHBOARD DATA
    // ==========================================

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    apiUrl("/api/dashboard"),
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const data =
                    await response.json();

                if (response.ok) {

                    setStats(data);

                }

            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );
            }
        };


        fetchDashboard();

    }, []);


    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    const isAdmin = role === "admin";

    // ==========================================
    // SECURITY DASHBOARD
    // ==========================================

    const isSecurity = role === "security";

    // ==========================================
    // EMPLOYEE DASHBOARD
    // ==========================================

    const isEmployee = role === "employee";


    return (

        <div className="dashboard-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        {isSecurity
                            ? "Security Dashboard"
                            : isEmployee
                                ? "Employee Dashboard"
                                : "Dashboard"
                        }
                    </h1>

                    <p>

                        {isSecurity
                            ? "Manage visitor entry and exit."
                            : isEmployee
                                ? "Overview of your visitor management activity."
                                : "Overview of your visitor management activity."
                        }

                    </p>

                </div>


                {/* Admin + Employee only */}

                {(isAdmin || isEmployee) && (

                    <Link
                        to="/visitors"
                        className="dashboard-primary-button"
                    >
                        + Register Visitor
                    </Link>

                )}

            </div>



            {/* ==================================
                STATISTICS
            ================================== */}

            <div className="dashboard-stats">


                {/* ADMIN */}

                {isAdmin && (

                    <>

                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-label">
                                    Total Visitors
                                </span>

                                <span className="stat-icon">
                                    👥
                                </span>

                            </div>

                            <strong>
                                {stats.totalVisitors}
                            </strong>

                            <span className="stat-description">
                                Registered visitors
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-label">
                                    Active Passes
                                </span>

                                <span className="stat-icon">
                                    🎫
                                </span>

                            </div>

                            <strong>
                                {stats.activePasses}
                            </strong>

                            <span className="stat-description">
                                Currently active
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-label">
                                    Checked In
                                </span>

                                <span className="stat-icon">
                                    ✓
                                </span>

                            </div>

                            <strong>
                                {stats.currentlyCheckedIn}
                            </strong>

                            <span className="stat-description">
                                Visitors currently inside
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-label">
                                    Appointments
                                </span>

                                <span className="stat-icon">
                                    ◷
                                </span>

                            </div>

                            <strong>
                                {stats.totalAppointments}
                            </strong>

                            <span className="stat-description">
                                Scheduled appointments
                            </span>

                        </div>

                    </>

                )}



                {/* SECURITY */}

                {isSecurity && (

                    <>

                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-label">
                                    Active Passes
                                </span>

                                <span className="stat-icon">
                                    🎫
                                </span>

                            </div>

                            <strong>
                                {stats.activePasses}
                            </strong>

                            <span className="stat-description">
                                Currently active
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-label">
                                    Checked In
                                </span>

                                <span className="stat-icon">
                                    ✓
                                </span>

                            </div>

                            <strong>
                                {stats.currentlyCheckedIn}
                            </strong>

                            <span className="stat-description">
                                Visitors currently inside
                            </span>

                        </div>

                    </>

                )}



                {/* EMPLOYEE */}

                {isEmployee && (

                    <>

                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-label">
                                    Total Visitors
                                </span>

                                <span className="stat-icon">
                                    👥
                                </span>

                            </div>

                            <strong>
                                {stats.totalVisitors}
                            </strong>

                            <span className="stat-description">
                                Registered visitors
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-card-top">

                                <span className="stat-label">
                                    Appointments
                                </span>

                                <span className="stat-icon">
                                    ◷
                                </span>

                            </div>

                            <strong>
                                {stats.totalAppointments}
                            </strong>

                            <span className="stat-description">
                                Scheduled appointments
                            </span>

                        </div>

                    </>

                )}

            </div>



            {/* ==================================
                QUICK ACTIONS
            ================================== */}

            <div className="dashboard-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Quick Actions
                        </h2>

                        <p>
                            Common visitor management tasks.
                        </p>

                    </div>

                </div>


                <div className="quick-actions">


                    {/* ADMIN */}

                    {isAdmin && (

                        <>

                            <Link
                                to="/visitors"
                                className="quick-action primary"
                            >

                                <span className="quick-action-icon">
                                    +
                                </span>

                                <span>

                                    <strong>
                                        Register Visitor
                                    </strong>

                                    <small>
                                        Add a new visitor
                                    </small>

                                </span>

                            </Link>


                            <Link
                                to="/appointments"
                                className="quick-action"
                            >

                                <span className="quick-action-icon">
                                    ◷
                                </span>

                                <span>

                                    <strong>
                                        New Appointment
                                    </strong>

                                    <small>
                                        Schedule a visit
                                    </small>

                                </span>

                            </Link>


                            <Link
                                to="/passes"
                                className="quick-action"
                            >

                                <span className="quick-action-icon">
                                    ▣
                                </span>

                                <span>

                                    <strong>
                                        Issue Pass
                                    </strong>

                                    <small>
                                        Create visitor pass
                                    </small>

                                </span>

                            </Link>


                            <Link
                                to="/scan"
                                className="quick-action"
                            >

                                <span className="quick-action-icon">
                                    ⌗
                                </span>

                                <span>

                                    <strong>
                                        Scan QR
                                    </strong>

                                    <small>
                                        Check in or check out
                                    </small>

                                </span>

                            </Link>

                        </>

                    )}



                    {/* SECURITY */}

                    {isSecurity && (

                        <>

                            <Link
                                to="/passes"
                                className="quick-action primary"
                            >

                                <span className="quick-action-icon">
                                    ▣
                                </span>

                                <span>

                                    <strong>
                                        Issue Pass
                                    </strong>

                                    <small>
                                        Create visitor pass
                                    </small>

                                </span>

                            </Link>


                            <Link
                                to="/scan"
                                className="quick-action"
                            >

                                <span className="quick-action-icon">
                                    ⌗
                                </span>

                                <span>

                                    <strong>
                                        Scan QR
                                    </strong>

                                    <small>
                                        Check in or check out
                                    </small>

                                </span>

                            </Link>

                        </>

                    )}



                    {/* EMPLOYEE */}

                    {isEmployee && (

                        <>

                            <Link
                                to="/visitors"
                                className="quick-action primary"
                            >

                                <span className="quick-action-icon">
                                    +
                                </span>

                                <span>

                                    <strong>
                                        Register Visitor
                                    </strong>

                                    <small>
                                        Add a new visitor
                                    </small>

                                </span>

                            </Link>


                            <Link
                                to="/appointments"
                                className="quick-action"
                            >

                                <span className="quick-action-icon">
                                    ◷
                                </span>

                                <span>

                                    <strong>
                                        New Appointment
                                    </strong>

                                    <small>
                                        Schedule a visit
                                    </small>

                                </span>

                            </Link>

                        </>

                    )}

                </div>

            </div>



            {/* ==================================
                RECENT VISITORS
                ADMIN + EMPLOYEE ONLY
            ================================== */}

            {(isAdmin || isEmployee) && (

                <div className="dashboard-section visitors-section">

                    <div className="section-heading visitors-heading">

                        <div>

                            <h2>
                                Recent Visitors
                            </h2>

                            <p>
                                Latest registered visitors.
                            </p>

                        </div>


                        <Link to="/visitors">
                            View all →
                        </Link>

                    </div>


                    {stats.recentVisitors.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                👤
                            </div>

                            <h3>
                                No visitors yet
                            </h3>

                            <p>
                                Registered visitors will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="visitor-table-wrapper">

                            <table className="visitor-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Visitor
                                        </th>

                                        <th>
                                            Email
                                        </th>

                                        <th>
                                            Phone
                                        </th>

                                        <th>
                                            Company
                                        </th>

                                        <th>
                                            Purpose
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {stats.recentVisitors.map(
                                        (visitor) => (

                                            <tr
                                                key={visitor._id}
                                            >

                                                <td>

                                                    <div className="visitor-cell">

                                                        {visitor.photo ? (

                                                            <img
                                                                src={`${API_BASE_URL}${visitor.photo}`}
                                                                alt={visitor.name}
                                                            />

                                                        ) : (

                                                            <div className="visitor-avatar">

                                                                {visitor.name
                                                                    ?.charAt(0)
                                                                    .toUpperCase()}

                                                            </div>

                                                        )}

                                                        <strong>
                                                            {visitor.name}
                                                        </strong>

                                                    </div>

                                                </td>


                                                <td>
                                                    {visitor.email}
                                                </td>


                                                <td>
                                                    {visitor.phone}
                                                </td>


                                                <td>
                                                    {visitor.company || "-"}
                                                </td>


                                                <td>
                                                    {visitor.purpose || "-"}
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}


export default Dashboard;
