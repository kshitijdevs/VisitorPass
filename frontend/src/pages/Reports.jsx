import "../style/reports.css";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL, apiUrl } from "../config/api";

function Reports() {
    const [stats, setStats] = useState({
        totalVisitors: 0,
        activePasses: 0,
        currentlyCheckedIn: 0,
        totalAppointments: 0
    });

    const [visitors, setVisitors] = useState([]);
    const [checkLogs, setCheckLogs] = useState([]);

    const [search, setSearch] = useState("");
    const [companyFilter, setCompanyFilter] = useState("all");
    const [purposeFilter, setPurposeFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshingRef = useRef(false);


    // ==========================================
    // FETCH REPORT DATA
    // ==========================================

    const fetchReports = async () => {
        if (refreshingRef.current) {
            return;
        }

        refreshingRef.current = true;
        setIsRefreshing(true);

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");


            // -------------------------------
            // Dashboard statistics
            // -------------------------------

            const dashboardResponse =
                await fetch(
                    apiUrl("/api/dashboard"),
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const dashboardData =
                await dashboardResponse.json();

            if (dashboardResponse.ok) {
                setStats(dashboardData);
            }


            // -------------------------------
            // Visitors
            // -------------------------------

            const visitorsResponse =
                await fetch(
                    apiUrl("/api/visitors"),
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const visitorsData =
                await visitorsResponse.json();

            if (visitorsResponse.ok) {
                setVisitors(visitorsData);
            }


            // -------------------------------
            // Check Logs
            // -------------------------------

            const logsResponse =
                await fetch(
                    apiUrl("/api/checklogs"),
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const logsData =
                await logsResponse.json();

            if (logsResponse.ok) {
                setCheckLogs(logsData);
            }

        } catch (error) {

            console.error(
                "Reports error:",
                error
            );

        } finally {

            setLoading(false);
            refreshingRef.current = false;
            setIsRefreshing(false);

        }
    };


    useEffect(() => {

        // State is updated after the asynchronous API request completes.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchReports();

    }, []);


    // ==========================================
    // FILTER OPTIONS
    // ==========================================

    const companies = [
        ...new Set(
            visitors
                .map(
                    (visitor) =>
                        visitor.company
                )
                .filter(Boolean)
        )
    ];


    const purposes = [
        ...new Set(
            visitors
                .map(
                    (visitor) =>
                        visitor.purpose
                )
                .filter(Boolean)
        )
    ];


    // ==========================================
    // FILTER VISITORS
    // ==========================================

    const filteredVisitors =
        visitors.filter((visitor) => {

            const text =
                search.toLowerCase();


            const matchesSearch =
                visitor.name
                    ?.toLowerCase()
                    .includes(text) ||

                visitor.email
                    ?.toLowerCase()
                    .includes(text) ||

                visitor.phone
                    ?.toLowerCase()
                    .includes(text) ||

                visitor.company
                    ?.toLowerCase()
                    .includes(text) ||

                visitor.purpose
                    ?.toLowerCase()
                    .includes(text);


            const matchesCompany =
                companyFilter === "all" ||
                visitor.company ===
                companyFilter;


            const matchesPurpose =
                purposeFilter === "all" ||
                visitor.purpose ===
                purposeFilter;


            return (
                matchesSearch &&
                matchesCompany &&
                matchesPurpose
            );

        });


    // ==========================================
    // FIND CURRENTLY CHECKED-IN VISITORS
    // ==========================================

    /*
     * Logs are sorted newest first from backend.
     *
     * We keep only the latest action for each pass.
     *
     * Latest action:
     * check-in  -> currently inside
     * check-out -> currently outside
     */

    const latestLogsByPass = {};

    checkLogs.forEach((log) => {

        if (
            !latestLogsByPass[
            log.passNumber
            ]
        ) {
            latestLogsByPass[
                log.passNumber
            ] = log;
        }

    });


    const currentlyInside =
        Object.values(
            latestLogsByPass
        ).filter(
            (log) =>
                log.action === "check-in"
        );


    // ==========================================
    // ACTIVITY DATA
    // ==========================================

    const visitorActivity =
        checkLogs.map((log) => {

            const visitor =
                visitors.find(
                    (item) =>
                        item.name
                            ?.toLowerCase() ===
                        log.visitor
                            ?.toLowerCase()
                );


            return {
                ...log,

                email:
                    visitor?.email ||
                    "",

                phone:
                    visitor?.phone ||
                    "",

                company:
                    visitor?.company ||
                    "",

                purpose:
                    visitor?.purpose ||
                    ""
            };

        });


    // ==========================================
    // EXPORT VISITOR CSV
    // ==========================================

    const exportCSV = () => {

        if (
            filteredVisitors.length === 0
        ) {

            alert(
                "No visitor data to export."
            );

            return;
        }


        const headers = [
            "Name",
            "Email",
            "Phone",
            "Company",
            "Purpose"
        ];


        const rows =
            filteredVisitors.map(
                (visitor) => [
                    visitor.name,
                    visitor.email,
                    visitor.phone,
                    visitor.company,
                    visitor.purpose
                ]
            );


        const csv = [
            headers,
            ...rows
        ]
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(
                            value || ""
                        ).replace(
                            /"/g,
                            '""'
                        )}"`
                    )
                    .join(",")
            )
            .join("\n");


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;

        link.download =
            "visitor-report.csv";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );
    };


    // ==========================================
    // EXPORT ACTIVITY CSV
    // ==========================================

    const exportActivityCSV = () => {

        if (
            visitorActivity.length === 0
        ) {

            alert(
                "No check-in/check-out data to export."
            );

            return;
        }


        const headers = [
            "Visitor",
            "Pass Number",
            "Company",
            "Action",
            "Date & Time"
        ];


        const rows =
            visitorActivity.map(
                (log) => [

                    log.visitor,

                    log.passNumber,

                    log.company,

                    log.action,

                    log.createdAt
                        ? new Date(
                            log.createdAt
                        ).toLocaleString()
                        : ""

                ]
            );


        const csv = [
            headers,
            ...rows
        ]
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(
                            value || ""
                        ).replace(
                            /"/g,
                            '""'
                        )}"`
                    )
                    .join(",")
            )
            .join("\n");


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href = url;

        link.download =
            "visitor-activity-report.csv";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );
    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(
            date
        ).toLocaleString(
            [],
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <main className="reports-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="reports-header">

                <div>

                    <p className="reports-eyebrow">
                        ANALYTICS
                    </p>

                    <h1>
                        Reports
                    </h1>

                    <p className="reports-description">
                        Monitor visitors, passes and
                        check-in activity from one place.
                    </p>

                </div>


                <button
                    className="reports-export-btn"
                    onClick={fetchReports}
                    disabled={isRefreshing}
                >
                    {isRefreshing ? "Refreshing..." : "↻ Refresh"}
                </button>

            </div>


            {/* ==================================
                STATISTICS
            ================================== */}

            <div className="reports-stats">


                <div className="report-stat-card">

                    <div className="report-stat-top">

                        <span>
                            Total Visitors
                        </span>

                        <span className="report-stat-icon">
                            ◉
                        </span>

                    </div>

                    <h2>
                        {stats.totalVisitors}
                    </h2>

                    <p>
                        Registered visitors
                    </p>

                </div>


                <div className="report-stat-card">

                    <div className="report-stat-top">

                        <span>
                            Active Passes
                        </span>

                        <span className="report-stat-icon">
                            ▣
                        </span>

                    </div>

                    <h2>
                        {stats.activePasses}
                    </h2>

                    <p>
                        Currently active
                    </p>

                </div>


                <div className="report-stat-card">

                    <div className="report-stat-top">

                        <span>
                            Currently Inside
                        </span>

                        <span className="report-stat-icon">
                            ✓
                        </span>

                    </div>

                    <h2>
                        {currentlyInside.length}
                    </h2>

                    <p>
                        Visitors on site
                    </p>

                </div>


                <div className="report-stat-card">

                    <div className="report-stat-top">

                        <span>
                            Appointments
                        </span>

                        <span className="report-stat-icon">
                            ◷
                        </span>

                    </div>

                    <h2>
                        {stats.totalAppointments}
                    </h2>

                    <p>
                        Total appointments
                    </p>

                </div>

            </div>


            {/* ==================================
                CURRENTLY ON-SITE
            ================================== */}

            <section className="reports-card">


                <div className="reports-results-header">

                    <div>

                        <h2>
                            Currently On-Site
                        </h2>

                        <p>
                            Visitors who are currently
                            inside the premises.
                        </p>

                    </div>


                    <span className="reports-result-count">
                        {currentlyInside.length}
                        {" "}
                        inside
                    </span>

                </div>


                <div className="reports-table-wrapper">

                    <table className="reports-table">

                        <thead>

                            <tr>

                                <th>
                                    Visitor
                                </th>

                                <th>
                                    Pass
                                </th>

                                <th>
                                    Company
                                </th>

                                <th>
                                    Check-In
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {currentlyInside.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="reports-empty"
                                    >
                                        No visitors are currently
                                        inside.
                                    </td>

                                </tr>

                            ) : (

                                currentlyInside.map(
                                    (log) => {

                                        const visitor =
                                            visitors.find(
                                                (item) =>
                                                    item.name
                                                        ?.toLowerCase() ===
                                                    log.visitor
                                                        ?.toLowerCase()
                                            );


                                        return (

                                            <tr
                                                key={
                                                    log._id
                                                }
                                            >

                                                <td>

                                                    <strong className="report-name">
                                                        {
                                                            log.visitor
                                                        }
                                                    </strong>

                                                </td>


                                                <td>
                                                    {
                                                        log.passNumber
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        visitor?.company ||
                                                        "—"
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        formatDate(
                                                            log.createdAt
                                                        )
                                                    }
                                                </td>


                                                <td>

                                                    <span className="activity-status inside">
                                                        ● Inside
                                                    </span>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* ==================================
                CHECK-IN / CHECK-OUT HISTORY
            ================================== */}

            <section className="reports-card">


                <div className="reports-results-header">

                    <div>

                        <h2>
                            Visitor Activity
                        </h2>

                        <p>
                            Complete check-in and
                            check-out history.
                        </p>

                    </div>


                    <div
                        style={{
                            display: "flex",
                            gap: "10px"
                        }}
                    >

                        <span className="reports-result-count">
                            {visitorActivity.length}
                            {" "}
                            records
                        </span>


                        <button
                            className="reports-export-btn"
                            onClick={
                                exportActivityCSV
                            }
                        >
                            ↓ Export Activity
                        </button>

                    </div>

                </div>


                <div className="reports-table-wrapper">

                    <table className="reports-table">

                        <thead>

                            <tr>

                                <th>
                                    Visitor
                                </th>

                                <th>
                                    Pass
                                </th>

                                <th>
                                    Company
                                </th>

                                <th>
                                    Action
                                </th>

                                <th>
                                    Date & Time
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {visitorActivity.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="reports-empty"
                                    >
                                        No check-in or
                                        check-out records yet.
                                    </td>

                                </tr>

                            ) : (

                                visitorActivity.map(
                                    (log) => {

                                        const isCheckIn =
                                            log.action ===
                                            "check-in";


                                        return (

                                            <tr
                                                key={
                                                    log._id
                                                }
                                            >

                                                <td>

                                                    <strong className="report-name">
                                                        {
                                                            log.visitor
                                                        }
                                                    </strong>

                                                </td>


                                                <td>
                                                    {
                                                        log.passNumber
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        log.company ||
                                                        "—"
                                                    }
                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            isCheckIn
                                                                ? "activity-badge check-in"
                                                                : "activity-badge check-out"
                                                        }
                                                    >
                                                        {
                                                            isCheckIn
                                                                ? "Check In"
                                                                : "Check Out"
                                                        }
                                                    </span>

                                                </td>


                                                <td>
                                                    {
                                                        formatDate(
                                                            log.createdAt
                                                        )
                                                    }
                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            isCheckIn
                                                                ? "activity-status inside"
                                                                : "activity-status outside"
                                                        }
                                                    >
                                                        {
                                                            isCheckIn
                                                                ? "Inside"
                                                                : "Outside"
                                                        }
                                                    </span>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* ==================================
                VISITOR FILTERS
            ================================== */}

            <section className="reports-card">


                <div className="reports-card-header">

                    <div>

                        <h2>
                            Visitor Report
                        </h2>

                        <p>
                            Search and filter registered
                            visitors.
                        </p>

                    </div>


                    <button
                        className="reports-export-btn"
                        onClick={exportCSV}
                    >
                        ↓ Export CSV
                    </button>

                </div>


                <div className="reports-filters">


                    <div className="report-input-wrapper">

                        <span className="report-input-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            className="report-input"
                            placeholder="Search name, email, phone..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        className="report-select"
                        value={companyFilter}
                        onChange={(e) =>
                            setCompanyFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Companies
                        </option>

                        {companies.map(
                            (company) => (

                                <option
                                    key={company}
                                    value={company}
                                >
                                    {company}
                                </option>

                            )
                        )}

                    </select>


                    <select
                        className="report-select"
                        value={purposeFilter}
                        onChange={(e) =>
                            setPurposeFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Purposes
                        </option>

                        {purposes.map(
                            (purpose) => (

                                <option
                                    key={purpose}
                                    value={purpose}
                                >
                                    {purpose}
                                </option>

                            )
                        )}

                    </select>

                </div>

            </section>


            {/* ==================================
                VISITORS
            ================================== */}

            <section className="reports-card">


                <div className="reports-results-header">

                    <div>

                        <h2>
                            Visitors
                        </h2>

                        <p>
                            Registered visitor records.
                        </p>

                    </div>


                    <span className="reports-result-count">
                        {filteredVisitors.length}
                        {" "}
                        results
                    </span>

                </div>


                <div className="reports-table-wrapper">

                    <table className="reports-table">

                        <thead>

                            <tr>

                                <th>
                                    Photo
                                </th>

                                <th>
                                    Name
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

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="reports-empty"
                                    >
                                        Loading reports...
                                    </td>

                                </tr>

                            ) : filteredVisitors.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="reports-empty"
                                    >
                                        No visitors found.
                                    </td>

                                </tr>

                            ) : (

                                filteredVisitors.map(
                                    (visitor) => (

                                        <tr
                                            key={
                                                visitor._id
                                            }
                                        >

                                            <td>

                                                {visitor.photo ? (

                                                    <img
                                                        src={
                                                            `${API_BASE_URL}${visitor.photo}`
                                                        }
                                                        alt={
                                                            visitor.name
                                                        }
                                                        className="report-photo"
                                                    />

                                                ) : (

                                                    <div className="report-avatar">

                                                        {visitor.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}

                                                    </div>

                                                )}

                                            </td>


                                            <td>

                                                <strong className="report-name">
                                                    {
                                                        visitor.name
                                                    }
                                                </strong>

                                            </td>


                                            <td>
                                                {
                                                    visitor.email
                                                }
                                            </td>


                                            <td>
                                                {
                                                    visitor.phone
                                                }
                                            </td>


                                            <td>
                                                {
                                                    visitor.company
                                                }
                                            </td>


                                            <td>

                                                <span className="report-purpose">
                                                    {
                                                        visitor.purpose
                                                    }
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </section>


        </main>
    );
}

export default Reports;
