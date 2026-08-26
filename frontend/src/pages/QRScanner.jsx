import "../style/qrscanner.css";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function QRScanner() {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [action, setAction] = useState("check-in");
    const [visitorInfo, setVisitorInfo] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);

    const scannerRef = useRef(null);
    const actionRef = useRef("check-in");
    const processingRef = useRef(false);

    useEffect(() => {
        actionRef.current = action;
    }, [action]);

    useEffect(() => {
        let scanner = null;
        let cancelled = false;

        const startScanner = async () => {
            try {
                const reader =
                    document.getElementById("qr-reader");

                if (!reader) {
                    return;
                }

                reader.innerHTML = "";

                const cameras =
                    await Html5Qrcode.getCameras();

                if (cancelled) {
                    return;
                }

                if (!cameras || cameras.length === 0) {
                    throw new Error(
                        "No camera found"
                    );
                }

                let selectedCamera =
                    cameras.find((camera) =>
                        /back|rear|environment/i.test(
                            camera.label
                        )
                    );

                if (!selectedCamera) {
                    selectedCamera = cameras[0];
                }

                scanner = new Html5Qrcode(
                    "qr-reader"
                );

                scannerRef.current = scanner;

                await scanner.start(
                    selectedCamera.id,
                    {
                        fps: 10,

                        qrbox: {
                            width: 250,
                            height: 250
                        }
                    },

                    async (decodedText) => {

                        if (
                            cancelled ||
                            processingRef.current
                        ) {
                            return;
                        }

                        processingRef.current = true;

                        try {

                            // ==================================
                            // READ QR
                            // ==================================

                            let qrData;

                            try {
                                qrData =
                                    JSON.parse(
                                        decodedText
                                    );
                            } catch {
                                throw new Error(
                                    "Invalid QR code"
                                );
                            }


                            if (
                                !qrData.visitor ||
                                !qrData.passNumber
                            ) {
                                throw new Error(
                                    "Invalid visitor pass"
                                );
                            }


                            const token =
                                localStorage.getItem(
                                    "token"
                                );


                            if (!token) {
                                throw new Error(
                                    "Please login again"
                                );
                            }


                            // ==================================
                            // GET VISITORS
                            // ==================================

                            const visitorResponse =
                                await fetch(
                                    "http://localhost:5000/api/visitors",
                                    {
                                        headers: {
                                            Authorization:
                                                `Bearer ${token}`
                                        }
                                    }
                                );


                            const visitorData =
                                await visitorResponse.json();


                            if (!visitorResponse.ok) {
                                throw new Error(
                                    visitorData.message ||
                                    "Unable to load visitors"
                                );
                            }


                            // Handle:
                            //
                            // [ visitor1, visitor2 ]
                            //
                            // OR
                            //
                            // { visitors: [...] }

                            const visitors =
                                Array.isArray(
                                    visitorData
                                )
                                    ? visitorData
                                    : Array.isArray(
                                        visitorData.visitors
                                    )
                                        ? visitorData.visitors
                                        : [];


                            // ==================================
                            // FIND VISITOR
                            // ==================================

                            const visitor =
                                visitors.find(
                                    (item) =>
                                        item.name
                                            ?.trim()
                                            .toLowerCase() ===
                                        qrData.visitor
                                            ?.trim()
                                            .toLowerCase()
                                );


                            if (!visitor) {

                                setVisitorInfo(null);

                                throw new Error(
                                    "Visitor not found"
                                );
                            }


                            // ==================================
                            // SHOW VISITOR
                            // ==================================

                            setVisitorInfo({

                                name:
                                    visitor.name,

                                email:
                                    visitor.email,

                                phone:
                                    visitor.phone,

                                company:
                                    visitor.company,

                                purpose:
                                    visitor.purpose,

                                photo:
                                    visitor.photo,

                                passNumber:
                                    qrData.passNumber

                            });


                            // ==================================
                            // CHECK-IN / CHECK-OUT
                            // ==================================

                            const currentAction =
                                actionRef.current;


                            const checkResponse =
                                await fetch(
                                    "http://localhost:5000/api/checklogs",
                                    {
                                        method: "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json",

                                            Authorization:
                                                `Bearer ${token}`
                                        },

                                        body:
                                            JSON.stringify({

                                                visitor:
                                                    qrData.visitor,

                                                passNumber:
                                                    qrData.passNumber,

                                                action:
                                                    currentAction

                                            })
                                    }
                                );


                            const checkData =
                                await checkResponse.json();


                            if (!checkResponse.ok) {

                                setMessage(
                                    checkData.message ||
                                    "Check action failed"
                                );

                                setMessageType(
                                    "danger"
                                );

                                return;
                            }


                            // ==================================
                            // SUCCESS
                            // ==================================

                            if (
                                currentAction ===
                                "check-in"
                            ) {

                                setMessage(
                                    "Check-in successful!"
                                );

                            } else {

                                setMessage(
                                    "Check-out successful!"
                                );
                            }


                            setMessageType(
                                "success"
                            );


                        } catch (error) {

                            console.error(
                                "QR SCAN ERROR:",
                                error
                            );


                            setMessage(
                                error.message ||
                                "Unable to process QR code"
                            );


                            setMessageType(
                                "danger"
                            );


                        } finally {

                            setTimeout(() => {

                                processingRef.current =
                                    false;

                            }, 3000);

                        }

                    },

                    () => {
                        // Scanner continues
                    }
                );


                if (cancelled) {

                    try {
                        await scanner.stop();
                    } catch {}

                    try {
                        scanner.clear();
                    } catch {}

                    return;
                }


                setCameraActive(true);


            } catch (error) {

                console.error(
                    "CAMERA ERROR:",
                    error
                );


                if (!cancelled) {

                    setCameraActive(false);

                    setMessage(
                        error.message ||
                        "Unable to access camera"
                    );

                    setMessageType(
                        "danger"
                    );
                }

            }
        };


        startScanner();


        // ==================================
        // CLEANUP
        // ==================================

        return () => {

            cancelled = true;

            setCameraActive(false);

            const currentScanner =
                scanner;

            scannerRef.current = null;


            if (currentScanner) {

                currentScanner
                    .stop()
                    .catch(() => {})
                    .finally(() => {

                        try {
                            currentScanner.clear();
                        } catch {}

                        const reader =
                            document.getElementById(
                                "qr-reader"
                            );

                        if (reader) {
                            reader.innerHTML = "";
                        }

                    });
            }


            processingRef.current = false;

        };

    }, []);


    // ==================================
    // CHECK IN
    // ==================================

    const handleCheckIn = () => {

        actionRef.current =
            "check-in";

        setAction(
            "check-in"
        );

        setMessage("");
        setMessageType("");

    };


    // ==================================
    // CHECK OUT
    // ==================================

    const handleCheckOut = () => {

        actionRef.current =
            "check-out";

        setAction(
            "check-out"
        );

        setMessage("");
        setMessageType("");

    };


    return (

        <div className="qr-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="qr-header">

                <div className="qr-eyebrow">
                    SECURITY
                </div>

                <h1>
                    Scan Visitor Pass
                </h1>

                <p>
                    Verify a visitor's digital pass
                    and record their entry or exit.
                </p>

            </div>


            <div className="qr-layout">


                {/* ==================================
                    SCANNER CARD
                ================================== */}

                <div className="qr-scanner-card">


                    <div className="qr-card-header">

                        <div>

                            <h2>
                                QR Scanner
                            </h2>

                            <p>
                                Position the visitor's QR
                                code inside the frame.
                            </p>

                        </div>


                        <div className="qr-status">

                            <span></span>

                            {cameraActive
                                ? "Camera active"
                                : "Camera offline"}

                        </div>

                    </div>


                    {/* ACTION */}

                    <div className="qr-action-label">
                        Select Action
                    </div>


                    <div className="qr-actions">


                        <button
                            type="button"
                            className={
                                `qr-action-btn ${
                                    action ===
                                    "check-in"
                                        ? "selected"
                                        : ""
                                }`
                            }
                            onClick={
                                handleCheckIn
                            }
                        >
                            ✓ Check In
                        </button>


                        <button
                            type="button"
                            className={
                                `qr-action-btn ${
                                    action ===
                                    "check-out"
                                        ? "selected"
                                        : ""
                                }`
                            }
                            onClick={
                                handleCheckOut
                            }
                        >
                            → Check Out
                        </button>


                    </div>


                    {/* CAMERA */}

                    <div className="qr-camera-wrapper">

                        <div
                            id="qr-reader"
                            className="qr-reader"
                        ></div>

                    </div>


                    <p className="qr-help">

                        Hold the QR code steady and
                        keep it inside the scanning frame.

                    </p>


                    {/* MESSAGE */}

                    {message && (

                        <div
                            className={
                                `qr-alert ${messageType}`
                            }
                        >
                            {message}
                        </div>

                    )}

                </div>


                {/* ==================================
                    VISITOR INFORMATION
                ================================== */}

                <div className="visitor-info-card">


                    <div className="visitor-info-header">

                        <div>

                            <div className="qr-eyebrow">
                                VERIFICATION
                            </div>

                            <h2>
                                Visitor Details
                            </h2>

                        </div>

                    </div>


                    {!visitorInfo ? (

                        <div className="visitor-empty">

                            <div className="visitor-empty-icon">
                                ✓
                            </div>

                            <h3>
                                Waiting for scan
                            </h3>

                            <p>
                                Scan a valid visitor pass
                                to view visitor details.
                            </p>

                        </div>

                    ) : (

                        <div className="visitor-details">


                            {/* PHOTO */}

                            {visitorInfo.photo ? (

                                <img
                                    src={
                                        `http://localhost:5000${visitorInfo.photo}`
                                    }
                                    alt={
                                        visitorInfo.name
                                    }
                                    className="visitor-photo"
                                />

                            ) : (

                                <div className="visitor-photo-placeholder">

                                    {visitorInfo.name
                                        ?.charAt(0)
                                        ?.toUpperCase()}

                                </div>

                            )}


                            {/* NAME */}

                            <h3>
                                {visitorInfo.name}
                            </h3>


                            <div className="verified-badge">
                                ✓ Pass Verified
                            </div>


                            {/* DETAILS */}

                            <div className="visitor-fields">


                                <div>

                                    <span>
                                        Pass Number
                                    </span>

                                    <strong>
                                        {
                                            visitorInfo.passNumber
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {
                                            visitorInfo.email ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        {
                                            visitorInfo.phone ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Company
                                    </span>

                                    <strong>
                                        {
                                            visitorInfo.company ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Purpose
                                    </span>

                                    <strong>
                                        {
                                            visitorInfo.purpose ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}

export default QRScanner;