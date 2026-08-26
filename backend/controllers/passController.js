const QRCode = require("qrcode");
const Pass = require("../models/pass");
const Visitor = require("../models/Visitor");

const {
    createPassPDF
} = require("./pdfController");

const {
    sendPassEmail
} = require("../utils/email");


const createPass = async (req, res) => {
    try {

        // Find the highest existing pass number
        const passes = await Pass.find(
            { passNumber: { $regex: /^VP-\d+$/ } },
            { passNumber: 1 }
        );

        let highestNumber = 0;

        for (const existingPass of passes) {

            const match =
                existingPass.passNumber.match(/(\d+)$/);

            if (match) {

                const number =
                    parseInt(match[1], 10);

                if (number > highestNumber) {
                    highestNumber = number;
                }
            }
        }

        // Generate next pass number
        const nextNumber = highestNumber + 1;

        const passNumber =
            `VP-${String(nextNumber).padStart(4, "0")}`;


        // Generate QR code
        const qrData = JSON.stringify({
            visitor: req.body.visitor,
            passNumber: passNumber
        });

        const qrCode =
            await QRCode.toDataURL(qrData);


        // Create pass
        const pass = await Pass.create({

            visitor:
                req.body.visitor,

            visitorPhoto:
                req.body.visitorPhoto || "",

            appointment:
                req.body.appointment,

            host:
                req.body.host || "",

            purpose:
                req.body.purpose || "",

            date:
                req.body.date || "",

            time:
                req.body.time || "",

            // Automatically generated
            passNumber: passNumber,

            validFrom:
                req.body.validFrom,

            validUntil:
                req.body.validUntil,

            status:
                req.body.status || "active",

            qrCode: qrCode
        });


        // Generate PDF
        const pdfBuffer =
            await createPassPDF(pass);


        // Find visitor
        const visitor =
            await Visitor.findOne({
                name: pass.visitor
            });


        // Email PDF
        if (visitor && visitor.email) {

            try {

                await sendPassEmail(
                    pass,
                    visitor.email,
                    pdfBuffer
                );

                console.log(
                    `Pass PDF emailed to ${visitor.email}`
                );

            } catch (emailError) {

                console.error(
                    "PASS EMAIL ERROR:",
                    emailError.message
                );
            }

        } else {

            console.log(
                "Visitor email not found. Pass created without email."
            );
        }


        // Return created pass
        res.status(201).json(pass);

    } catch (error) {

        console.error(
            "CREATE PASS ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createPass
};