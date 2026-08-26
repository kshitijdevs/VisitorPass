import "../style/passes.css";
import { useEffect, useState } from "react";

function Passes() {
    const [appointments, setAppointments] = useState([]);
    const [createdPass, setCreatedPass] = useState(null);
    const [passForms, setPassForms] = useState({});

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/appointments",
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

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleChange = (appointmentId, field, value) => {
        setPassForms((prev) => ({
            ...prev,
            [appointmentId]: {
                ...prev[appointmentId],
                [field]: value
            }
        }));
    };

    const issuePass = async (appointment) => {
        const token = localStorage.getItem("token");

        const form = passForms[appointment._id];

        if (!form?.validFrom || !form?.validUntil) {
            alert(
                "Please select Valid From and Valid Until."
            );
            return;
        }

        const response = await fetch(
            "http://localhost:5000/api/passes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    visitor: appointment.visitor,

                    appointment:
                        `${appointment.purpose} with ${appointment.host}`,

                    host: appointment.host,

                    purpose: appointment.purpose,

                    date: appointment.date,

                    time: appointment.time,

                    validFrom: form.validFrom,

                    validUntil: form.validUntil,

                    status: "active"
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert(
                `Pass ${data.passNumber} issued successfully!`
            );

            setCreatedPass(data);

            setPassForms((prev) => ({
                ...prev,
                [appointment._id]: {
                    validFrom: "",
                    validUntil: ""
                }
            }));
        } else {
            alert(
                data.message ||
                "Something went wrong"
            );
        }
    };

    const downloadPDF = async () => {
        if (!createdPass) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/pdf",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(createdPass)
                }
            );

            if (!response.ok) {
                const data =
                    await response
                        .json()
                        .catch(() => ({}));

                alert(
                    data.message ||
                    "Unable to generate PDF"
                );

                return;
            }

            const blob = await response.blob();

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `${createdPass.passNumber}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);

            alert(
                "Unable to generate PDF"
            );
        }
    };

    const approvedAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status === "approved"
        );

    return (
        <main className="passes-page">

            {/* ================= HEADER ================= */}

            <div className="passes-header">

                <div>

                    <p className="passes-eyebrow">
                        PASS MANAGEMENT
                    </p>

                    <h1>
                        Visitor Passes
                    </h1>

                    <p className="passes-description">
                        Issue digital visitor passes for
                        approved appointments.
                    </p>

                </div>

                <div className="passes-count">
                    {approvedAppointments.length} approved
                </div>

            </div>


            {/* ================= APPROVED APPOINTMENTS ================= */}

            <section className="passes-card">

                <div className="passes-card-header">

                    <div>

                        <h2>
                            Approved Appointments
                        </h2>

                        <p>
                            Create a visitor pass for an
                            approved appointment.
                        </p>

                    </div>

                </div>


                {approvedAppointments.length === 0 ? (

                    <div className="passes-empty">

                        <div className="passes-empty-icon">
                            ✓
                        </div>

                        <h3>
                            No approved appointments
                        </h3>

                        <p>
                            Approved appointments will
                            appear here when they are ready
                            for pass issuance.
                        </p>

                    </div>

                ) : (

                    <div className="appointment-list">

                        {approvedAppointments.map(
                            (appointment) => {

                                const form =
                                    passForms[
                                        appointment._id
                                    ] || {};

                                return (
                                    <div
                                        key={appointment._id}
                                        className="appointment-card"
                                    >

                                        {/* ================= APPOINTMENT INFO ================= */}

                                        <div className="appointment-info">

                                            <div className="visitor-heading">

                                                <div className="visitor-avatar">

                                                    {appointment.visitor
                                                        ?.charAt(0)
                                                        .toUpperCase()}

                                                </div>

                                                <div>

                                                    <h3>
                                                        {appointment.visitor}
                                                    </h3>

                                                    <span className="approved-badge">
                                                        ✓ Approved
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="appointment-details">

                                                <div>

                                                    <span>
                                                        HOST
                                                    </span>

                                                    <strong>
                                                        {appointment.host}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        DATE
                                                    </span>

                                                    <strong>
                                                        {appointment.date}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        TIME
                                                    </span>

                                                    <strong>
                                                        {appointment.time}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span>
                                                        PURPOSE
                                                    </span>

                                                    <strong>
                                                        {appointment.purpose}
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>


                                        {/* ================= PASS FORM ================= */}

                                        <div className="pass-form">

                                            <div className="pass-form-title">
                                                Issue Pass
                                            </div>


                                            {/* Automatic Pass Number */}

                                            <div className="automatic-pass-number">

                                                <div>
                                                    <span>
                                                        PASS NUMBER
                                                    </span>

                                                    <strong>
                                                        AUTO GENERATED
                                                    </strong>
                                                </div>

                                                <p>
                                                    The system will automatically
                                                    generate a unique pass number
                                                    such as VP-0001.
                                                </p>

                                            </div>


                                            <div className="pass-form-grid">

                                                <div>

                                                    <label>
                                                        Valid From
                                                    </label>

                                                    <input
                                                        type="datetime-local"
                                                        value={
                                                            form.validFrom ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                appointment._id,
                                                                "validFrom",
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                </div>


                                                <div>

                                                    <label>
                                                        Valid Until
                                                    </label>

                                                    <input
                                                        type="datetime-local"
                                                        value={
                                                            form.validUntil ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                appointment._id,
                                                                "validUntil",
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                </div>

                                            </div>


                                            <button
                                                className="issue-pass-btn"
                                                onClick={() =>
                                                    issuePass(
                                                        appointment
                                                    )
                                                }
                                            >
                                                Issue Visitor Pass
                                            </button>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                )}

            </section>


            {/* ================= GENERATED PASS ================= */}

            {createdPass && (

                <section className="generated-pass">

                    <div className="generated-pass-header">

                        <div>

                            <p className="passes-eyebrow">
                                PASS CREATED
                            </p>

                            <h2>
                                Visitor Pass
                            </h2>

                            <p>
                                The digital visitor pass is
                                ready.
                            </p>

                        </div>

                        <span className="active-badge">
                            ● {createdPass.status}
                        </span>

                    </div>


                    <div className="generated-pass-content">

                        <div className="generated-pass-info">

                            {/* PASS NUMBER */}

                            <div className="pass-number">

                                <span>
                                    PASS NUMBER
                                </span>

                                <strong>
                                    {createdPass.passNumber}
                                </strong>

                            </div>


                            <div className="generated-info-grid">

                                <div>

                                    <span>
                                        VISITOR
                                    </span>

                                    <strong>
                                        {createdPass.visitor}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        APPOINTMENT
                                    </span>

                                    <strong>
                                        {createdPass.appointment}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        VALID FROM
                                    </span>

                                    <strong>
                                        {new Date(
                                            createdPass.validFrom
                                        ).toLocaleString()}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        VALID UNTIL
                                    </span>

                                    <strong>
                                        {new Date(
                                            createdPass.validUntil
                                        ).toLocaleString()}
                                    </strong>

                                </div>

                            </div>


                            <button
                                className="download-pdf-btn"
                                onClick={downloadPDF}
                            >
                                ↓ Download Visitor Pass PDF
                            </button>

                        </div>


                        {/* QR CODE */}

                        {createdPass.qrCode && (

                            <div className="qr-section">

                                <div className="qr-box">

                                    <img
                                        src={
                                            createdPass.qrCode
                                        }
                                        alt="Visitor Pass QR Code"
                                    />

                                </div>

                                <p>
                                    Scan this QR code at
                                    security.
                                </p>

                            </div>

                        )}

                    </div>

                </section>

            )}

        </main>
    );
}

export default Passes;