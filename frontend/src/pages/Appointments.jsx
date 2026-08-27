import "../style/appointments.css";
import { useEffect, useState } from "react";
import { API_BASE_URL, apiUrl } from "../config/api";

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [visitors, setVisitors] = useState([]);

    const [visitor, setVisitor] = useState("");
    const [host, setHost] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [purpose, setPurpose] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [updatingAppointmentId, setUpdatingAppointmentId] = useState(null);

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                apiUrl("/api/appointments"),
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setAppointments(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchVisitors = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                apiUrl("/api/visitors"),
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setVisitors(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // These functions update state after their asynchronous API requests.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAppointments();
        fetchVisitors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isCreating) {
            return;
        }

        const token = localStorage.getItem("token");

        // Find the selected visitor
        const selectedVisitor = visitors.find(
            (item) =>
                item.name?.toLowerCase() === visitor?.toLowerCase()
        );

        if (!selectedVisitor) {
            alert("Please select a valid visitor");
            return;
        }

        setIsCreating(true);

        try {
            const response = await fetch(
                apiUrl("/api/appointments"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        visitor: selectedVisitor.name,
                        visitorEmail: selectedVisitor.email,
                        host,
                        date,
                        time,
                        purpose
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Appointment created successfully!");

                setVisitor("");
                setHost("");
                setDate("");
                setTime("");
                setPurpose("");

                fetchAppointments();
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            alert("Unable to create appointment");
        } finally {
            setIsCreating(false);
        }
    };

    const updateStatus = async (id, status) => {
        if (updatingAppointmentId) {
            return;
        }

        const token = localStorage.getItem("token");
        setUpdatingAppointmentId(id);

        try {
            const response = await fetch(
                apiUrl(`/api/appointments/${id}/status`),
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert(`Appointment ${status}!`);
                setAppointments((currentAppointments) =>
                    currentAppointments.map((appointment) =>
                        appointment._id === data._id
                            ? data
                            : appointment
                    )
                );
            } else {
                alert(data.message || "Unable to update appointment");
            }
        } catch (error) {
            console.error(error);
            alert("Unable to update appointment");
        } finally {
            setUpdatingAppointmentId(null);
        }
    };

    const getVisitor = (visitorName) => {
        return visitors.find(
            (item) =>
                item.name?.toLowerCase() ===
                visitorName?.toLowerCase()
        );
    };

    return (
        <div className="appointments-page">

            {/* Page Header */}

            <div className="page-header">

                <div>
                    <h1>Appointments</h1>

                    <p>
                        Schedule, approve and manage visitor appointments.
                    </p>
                </div>

                <div className="page-header-count">
                    {appointments.length} appointments
                </div>

            </div>


            {/* Create Appointment */}

            <div className="appointment-form-card">

                <div className="form-card-header">

                    <div>
                        <h2>Create Appointment</h2>

                        <p>
                            Schedule a visit with a visitor and host.
                        </p>
                    </div>

                    <div className="form-card-icon">
                        ◷
                    </div>

                </div>


                <form onSubmit={handleSubmit}>

                    <div className="appointment-form-grid">

                        <div className="form-field">

                            <label>
                                Visitor
                            </label>

                            <select
                                value={visitor}
                                onChange={(e) =>
                                    setVisitor(e.target.value)
                                }
                                required
                            >
                                <option value="">
                                    Select visitor
                                </option>

                                {visitors.map((item) => (
                                    <option
                                        key={item._id}
                                        value={item.name}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                        </div>


                        <div className="form-field">

                            <label>
                                Host / Employee
                            </label>

                            <input
                                type="text"
                                placeholder="Enter host name"
                                value={host}
                                onChange={(e) =>
                                    setHost(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Date
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Time
                            </label>

                            <input
                                type="time"
                                value={time}
                                onChange={(e) =>
                                    setTime(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="form-field appointment-purpose">

                            <label>
                                Purpose of Visit
                            </label>

                            <input
                                type="text"
                                placeholder="Enter purpose of visit"
                                value={purpose}
                                onChange={(e) =>
                                    setPurpose(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>


                    <div className="form-actions">

                        <button
                            type="submit"
                            className="appointment-submit-btn"
                            disabled={isCreating}
                        >
                            {isCreating
                                ? "Creating Appointment..."
                                : "Create Appointment"}
                        </button>

                    </div>

                </form>

            </div>


            {/* Appointment List */}

            <div className="appointment-list-card">

                <div className="visitor-list-header">

                    <div>
                        <h2>Appointments</h2>

                        <p>
                            Review and manage scheduled visits.
                        </p>
                    </div>

                    <span className="visitor-result-count">
                        {appointments.length} results
                    </span>

                </div>


                <div className="visitor-table-wrapper">

                    <table className="visitor-table appointment-table">

                        <thead>

                            <tr>
                                <th>Visitor</th>
                                <th>Host</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Purpose</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>

                        </thead>


                        <tbody>

                            {appointments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="visitor-empty-cell"
                                    >

                                        <div className="visitor-empty">

                                            <div className="empty-icon">
                                                ◷
                                            </div>

                                            <strong>
                                                No appointments found
                                            </strong>

                                            <p>
                                                Create an appointment to
                                                get started.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                appointments.map((appointment) => {

                                    const visitorData =
                                        getVisitor(appointment.visitor);

                                    return (
                                        <tr key={appointment._id}>

                                            {/* Visitor */}

                                            <td>

                                                <div className="visitor-cell">

                                                    {visitorData?.photo ? (

                                                        <img
                                                            src={`${API_BASE_URL}${visitorData.photo}`}
                                                            alt={
                                                                appointment.visitor
                                                            }
                                                        />

                                                    ) : (

                                                        <div className="visitor-avatar">

                                                            {appointment.visitor
                                                                ?.charAt(0)
                                                                .toUpperCase()}

                                                        </div>

                                                    )}

                                                    <strong>
                                                        {appointment.visitor}
                                                    </strong>

                                                </div>

                                            </td>


                                            {/* Host */}

                                            <td>
                                                {appointment.host}
                                            </td>


                                            {/* Date */}

                                            <td>
                                                {appointment.date}
                                            </td>


                                            {/* Time */}

                                            <td>
                                                {appointment.time}
                                            </td>


                                            {/* Purpose */}

                                            <td>
                                                {appointment.purpose}
                                            </td>


                                            {/* Status */}

                                            <td>

                                                <span
                                                    className={`appointment-status ${appointment.status ===
                                                        "approved"
                                                        ? "approved"
                                                        : appointment.status ===
                                                            "rejected"
                                                            ? "rejected"
                                                            : "pending"
                                                        }`}
                                                >
                                                    {appointment.status}
                                                </span>

                                            </td>


                                            {/* Action */}

                                            <td>

                                                {appointment.status ===
                                                    "pending" ? (

                                                    <div className="appointment-actions">

                                                        <button
                                                            className="appointment-approve"
                                                            disabled={
                                                                updatingAppointmentId ===
                                                                appointment._id
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    appointment._id,
                                                                    "approved"
                                                                )
                                                            }
                                                        >
                                                            {updatingAppointmentId ===
                                                            appointment._id
                                                                ? "Updating..."
                                                                : "Approve"}
                                                        </button>

                                                        <button
                                                            className="appointment-reject"
                                                            disabled={
                                                                updatingAppointmentId ===
                                                                appointment._id
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    appointment._id,
                                                                    "rejected"
                                                                )
                                                            }
                                                        >
                                                            {updatingAppointmentId ===
                                                            appointment._id
                                                                ? "Updating..."
                                                                : "Reject"}
                                                        </button>

                                                    </div>

                                                ) : (

                                                    <span className="appointment-no-action">
                                                        Completed
                                                    </span>

                                                )}

                                            </td>

                                        </tr>
                                    );
                                })

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Appointments;
