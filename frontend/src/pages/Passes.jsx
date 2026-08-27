import "../style/passes.css";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { apiUrl } from "../config/api";

function Passes() {
    const [appointments, setAppointments] = useState([]);
    const [passes, setPasses] = useState([]);
    const [createdPass, setCreatedPass] = useState(null);
    const [passForms, setPassForms] = useState({});
    const [issuingAppointmentId, setIssuingAppointmentId] = useState(null);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [passMessage, setPassMessage] = useState(null);
    const [revokingPassId, setRevokingPassId] = useState(null);
    const [isRevokingAll, setIsRevokingAll] = useState(false);
    const issuingAppointmentIdRef = useRef(null);

    let isAdmin = false;

    try {
        const token = localStorage.getItem("token");
        isAdmin = token ? jwtDecode(token).role === "admin" : false;
    } catch {
        isAdmin = false;
    }

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

    const fetchPasses = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                apiUrl("/api/passes"),
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setPasses(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // State is updated after the asynchronous API request completes.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAppointments();
        fetchPasses();
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
        if (issuingAppointmentIdRef.current) {
            return;
        }

        const token = localStorage.getItem("token");

        const form = passForms[appointment._id];

        if (!form?.validFrom || !form?.validUntil) {
            setPassMessage({
                type: "error",
                text: "Please select Valid From and Valid Until."
            });
            return;
        }

        issuingAppointmentIdRef.current = appointment._id;
        setIssuingAppointmentId(appointment._id);
        setPassMessage(null);

        try {
            const response = await fetch(
                apiUrl("/api/passes"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        appointmentId: appointment._id,

                        validFrom: form.validFrom,

                        validUntil: form.validUntil,

                        status: "active"
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setCreatedPass(data);
                setPassMessage({
                    type: "success",
                    text: `Pass ${data.passNumber} issued successfully.`
                });

                setPasses((currentPasses) => [
                    data,
                    ...currentPasses.filter(
                        (pass) => pass.appointmentId !== data.appointmentId
                    )
                ]);

                setPassForms((prev) => ({
                    ...prev,
                    [appointment._id]: {
                        validFrom: "",
                        validUntil: ""
                    }
                }));
            } else {
                setPassMessage({
                    type: "error",
                    text: data.message || "Pass was not issued. Please try again."
                });
            }
        } catch (error) {
            console.error(error);
            setPassMessage({
                type: "error",
                text: "Pass was not issued. Please try again."
            });
        } finally {
            issuingAppointmentIdRef.current = null;
            setIssuingAppointmentId(null);
        }
    };

    const downloadPDF = async () => {
        if (!createdPass || isDownloadingPdf) {
            return;
        }

        setIsDownloadingPdf(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                apiUrl("/api/pdf"),
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
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    const revokePass = async (pass) => {
        if (
            pass.status === "revoked" ||
            revokingPassId ||
            !window.confirm(
                `Revoke pass ${pass.passNumber}? It will no longer be valid for check-in or check-out.`
            )
        ) {
            return;
        }

        setRevokingPassId(pass._id);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                apiUrl(`/api/passes/${pass._id}/revoke`),
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setPasses((currentPasses) =>
                    currentPasses.map((currentPass) =>
                        currentPass._id === data._id
                            ? data
                            : currentPass
                    )
                );

                setCreatedPass((currentPass) =>
                    currentPass?._id === data._id
                        ? data
                        : currentPass
                );

                setPassMessage({
                    type: "success",
                    text: `Pass ${data.passNumber} has been revoked.`
                });
            } else {
                setPassMessage({
                    type: "error",
                    text: data.message || "Pass could not be revoked."
                });
            }
        } catch (error) {
            console.error(error);
            setPassMessage({
                type: "error",
                text: "Pass could not be revoked. Please try again."
            });
        } finally {
            setRevokingPassId(null);
        }
    };

    const revokeAllActivePasses = async () => {
        const activePasses = passes.filter(
            (pass) => pass.status === "active"
        );

        if (activePasses.length === 0) {
            setPassMessage({
                type: "info",
                text: "There are no active passes to revoke."
            });
            return;
        }

        if (
            isRevokingAll ||
            !window.confirm(
                `Revoke all ${activePasses.length} active pass(es)? They will no longer be valid for security scans.`
            )
        ) {
            return;
        }

        setIsRevokingAll(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                apiUrl("/api/passes/revoke-all"),
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setPasses((currentPasses) =>
                    currentPasses.map((pass) =>
                        pass.status === "active"
                            ? { ...pass, status: "revoked" }
                            : pass
                    )
                );

                setCreatedPass((currentPass) =>
                    currentPass?.status === "active"
                        ? { ...currentPass, status: "revoked" }
                        : currentPass
                );

                setPassMessage({
                    type: "success",
                    text: data.message
                });
            } else {
                setPassMessage({
                    type: "error",
                    text: data.message || "Active passes could not be revoked."
                });
            }
        } catch (error) {
            console.error(error);
            setPassMessage({
                type: "error",
                text: "Active passes could not be revoked. Please try again."
            });
        } finally {
            setIsRevokingAll(false);
        }
    };

    const approvedAppointments =
        appointments.filter(
            (appointment) =>
                appointment.status === "approved" &&
                !passes.some(
                    (pass) =>
                        String(pass.appointmentId) ===
                        String(appointment._id)
                )
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


                {passMessage && (
                    <div
                        className={`passes-feedback ${passMessage.type}`}
                        role="status"
                    >
                        {passMessage.text}
                    </div>
                )}


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

                                const isIssuing =
                                    issuingAppointmentId ===
                                    appointment._id;

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
                                                        disabled={isIssuing}
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
                                                        disabled={isIssuing}
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
                                                disabled={isIssuing}
                                                onClick={() =>
                                                    issuePass(
                                                        appointment
                                                    )
                                                }
                                            >
                                                {isIssuing
                                                    ? "Issuing Pass..."
                                                    : "Issue Visitor Pass"}
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
                                        HOST
                                    </span>

                                    <strong>
                                        {createdPass.host || "-"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        DATE & TIME
                                    </span>

                                    <strong>
                                        {createdPass.date || "-"}
                                        {createdPass.time
                                            ? `, ${createdPass.time}`
                                            : ""}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        PURPOSE
                                    </span>

                                    <strong>
                                        {createdPass.purpose || "-"}
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
                                disabled={isDownloadingPdf}
                            >
                                {isDownloadingPdf
                                    ? "Preparing PDF..."
                                    : "↓ Download Visitor Pass PDF"}
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


            {passes.length > 0 && (

                <section className="passes-card issued-passes-card">

                    <div className="passes-card-header">

                        <h2>
                            Issued Passes
                        </h2>

                        <p>
                            Revoke a pass to preserve its history while
                            preventing future security scans.
                        </p>

                        {isAdmin && (
                            <button
                                className="revoke-all-passes-btn"
                                disabled={isRevokingAll}
                                onClick={revokeAllActivePasses}
                            >
                                {isRevokingAll
                                    ? "Revoking..."
                                    : "Revoke All Active Passes"}
                            </button>
                        )}

                    </div>


                    <div className="issued-passes-table-wrapper">

                        <table className="issued-passes-table">

                            <thead>

                                <tr>
                                    <th>Pass</th>
                                    <th>Visitor</th>
                                    <th>Appointment</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>

                            </thead>


                            <tbody>

                                {passes.map((pass) => (

                                    <tr key={pass._id}>

                                        <td>{pass.passNumber}</td>
                                        <td>{pass.visitor}</td>
                                        <td>{pass.appointment}</td>

                                        <td>
                                            <span
                                                className={
                                                    `pass-status ${pass.status}`
                                                }
                                            >
                                                {pass.status}
                                            </span>
                                        </td>

                                        <td>
                                            {pass.status === "revoked" ? (
                                                <span className="pass-revoked-label">
                                                    Revoked
                                                </span>
                                            ) : (
                                                <button
                                                    className="revoke-pass-btn"
                                                    disabled={
                                                        revokingPassId ===
                                                        pass._id
                                                    }
                                                    onClick={() => revokePass(pass)}
                                                >
                                                    {revokingPassId === pass._id
                                                        ? "Revoking..."
                                                        : "Revoke Pass"}
                                                </button>
                                            )}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </section>

            )}

        </main>
    );
}

export default Passes;
