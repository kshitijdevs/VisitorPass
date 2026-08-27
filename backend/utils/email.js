const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendAppointmentEmail = async (appointment) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: appointment.visitorEmail,

        subject: `Appointment ${appointment.status}`,

        html: `
            <div style="font-family: Arial, sans-serif;">

                <h2>VisitorPass Appointment Update</h2>

                <p>
                    Your appointment has been
                    <strong>${appointment.status}</strong>.
                </p>

                <hr>

                <p>
                    <strong>Visitor:</strong>
                    ${appointment.visitor}
                </p>

                <p>
                    <strong>Host:</strong>
                    ${appointment.host}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${appointment.date}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${appointment.time}
                </p>

                <p>
                    <strong>Purpose:</strong>
                    ${appointment.purpose}
                </p>

                <p>
                    ${
                        appointment.status === "approved"
                            ? "Your visit has been approved. A visitor pass will be issued separately."
                            : "Unfortunately, your appointment has been rejected."
                    }
                </p>

                <hr>

                <p>
                    Thank you for using VisitorPass.
                </p>

            </div>
        `
    });
};

const sendPassEmail = async (pass, visitorEmail, pdfBuffer) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: visitorEmail,

        subject: `Your Visitor Pass - ${pass.passNumber}`,

        html: `
            <div style="font-family: Arial, sans-serif;">

                <h2>VisitorPass - Visitor Pass</h2>

                <p>
                    Your visitor pass has been issued successfully.
                </p>

                <hr>

                <p>
                    <strong>Visitor:</strong>
                    ${pass.visitor}
                </p>

                <p>
                    <strong>Host:</strong>
                    ${pass.host || "-"}
                </p>

                <p>
                    <strong>Purpose:</strong>
                    ${pass.purpose || "-"}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${pass.date || "-"}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${pass.time || "-"}
                </p>

                <p>
                    <strong>Pass Number:</strong>
                    ${pass.passNumber}
                </p>

                <p>
                    <strong>Valid From:</strong>
                    ${pass.validFrom}
                </p>

                <p>
                    <strong>Valid Until:</strong>
                    ${pass.validUntil}
                </p>

                <p>
                    Please find your visitor pass PDF attached to this email.
                </p>

                <hr>

                <p>
                    Please present the QR code at the security desk.
                </p>

            </div>
        `,

        attachments: [
            {
                filename: `${pass.passNumber}.pdf`,
                content: pdfBuffer,
                contentType: "application/pdf"
            }
        ]
    });
};

module.exports = {
    sendAppointmentEmail,
    sendPassEmail
};