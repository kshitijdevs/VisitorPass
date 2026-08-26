const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const createPassPDF = (pass) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        const chunks = [];

        doc.on("data", (chunk) => {
            chunks.push(chunk);
        });

        doc.on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        doc.on("error", reject);

        const {
            visitor,
            visitorPhoto,
            passNumber,
            appointment,
            host,
            purpose,
            date,
            time,
            validFrom,
            validUntil,
            status,
            qrCode
        } = pass;

        doc.fontSize(24).text("VISITOR PASS", {
            align: "center"
        });

        doc.moveDown(1);

        // Visitor photo
        if (visitorPhoto) {
            try {
                const photoPath = path.join(
                    __dirname,
                    "..",
                    visitorPhoto.replace(/^\/+/, "")
                );

                if (fs.existsSync(photoPath)) {
                    const photoSize = 100;
                    const photoX =
                        (doc.page.width - photoSize) / 2;

                    doc.image(
                        photoPath,
                        photoX,
                        doc.y,
                        {
                            width: photoSize,
                            height: photoSize
                        }
                    );

                    doc.y += photoSize + 20;
                }
            } catch (error) {
                console.error(
                    "Visitor photo error:",
                    error
                );
            }
        }

        doc.fontSize(16);

        doc.text(`Visitor: ${visitor || "-"}`);
        doc.text(`Pass Number: ${passNumber || "-"}`);
        doc.text(`Host: ${host || "-"}`);
        doc.text(`Purpose: ${purpose || "-"}`);
        doc.text(`Appointment: ${appointment || "-"}`);

        if (date) {
            doc.text(`Date: ${date}`);
        }

        if (time) {
            doc.text(`Time: ${time}`);
        }

        doc.text(`Valid From: ${validFrom || "-"}`);
        doc.text(`Valid Until: ${validUntil || "-"}`);
        doc.text(`Status: ${status || "-"}`);

        doc.moveDown(1);

        // QR code
        if (qrCode) {
            try {
                const base64Data = qrCode.replace(
                    /^data:image\/png;base64,/,
                    ""
                );

                const qrBuffer = Buffer.from(
                    base64Data,
                    "base64"
                );

                const qrSize = 180;

                const qrX =
                    (doc.page.width - qrSize) / 2;

                doc.fontSize(14).text(
                    "Scan QR Code:",
                    {
                        align: "center"
                    }
                );

                doc.moveDown(0.5);

                doc.image(
                    qrBuffer,
                    qrX,
                    doc.y,
                    {
                        width: qrSize,
                        height: qrSize
                    }
                );

                doc.y += qrSize + 20;

            } catch (error) {
                console.error(
                    "QR code error:",
                    error
                );
            }
        }

        doc.fontSize(12).text(
            "Please present this pass at the security desk.",
            {
                align: "center"
            }
        );

        doc.end();
    });
};


const generatePassPDF = async (req, res) => {
    try {
        const pdfBuffer =
            await createPassPDF(req.body);

        const passNumber =
            req.body.passNumber || "visitor-pass";

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${passNumber}.pdf"`
        );

        res.send(pdfBuffer);

    } catch (error) {
        console.error(
            "PDF GENERATION ERROR:",
            error
        );

        res.status(500).json({
            message: "Unable to generate PDF"
        });
    }
};


module.exports = {
    createPassPDF,
    generatePassPDF
};