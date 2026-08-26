import "../style/home.css";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-page">

            {/* ================= NAVBAR ================= */}

            <header className="home-navbar">

                <Link to="/" className="home-logo">
                    <span className="logo-mark">V</span>
                    VisitorPass
                </Link>

                <nav className="home-nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#security">Security</a>
                </nav>

                <div className="home-nav-actions">

                    <Link
                        to="/login"
                        className="home-login"
                    >
                        Staff Login
                    </Link>

                    <Link
                        to="/visitor-register"
                        className="home-nav-button"
                    >
                        Pre-register
                    </Link>

                </div>

            </header>


            {/* ================= HERO ================= */}

            <section className="home-hero">

                <div className="hero-content">

                    <div className="hero-badge">
                        <span></span>
                        Smart visitor management
                    </div>

                    <h1>
                        Welcome visitors.
                        <br />
                        <span>Secure your workplace.</span>
                    </h1>

                    <p className="hero-description">
                        Register visitors, approve appointments,
                        issue digital passes and verify entry with
                        QR codes — all from one secure platform.
                    </p>

                    <div className="hero-actions">

                        <Link
                            to="/visitor-register"
                            className="hero-primary-button"
                        >
                            Pre-register as Visitor
                            <span>→</span>
                        </Link>

                        <Link
                            to="/login"
                            className="hero-secondary-button"
                        >
                            Staff Login
                        </Link>

                    </div>

                    <div className="hero-trust">

                        <div>
                            <span className="trust-icon">✓</span>
                            QR verification
                        </div>

                        <div>
                            <span className="trust-icon">✓</span>
                            Digital passes
                        </div>

                        <div>
                            <span className="trust-icon">✓</span>
                            Visitor tracking
                        </div>

                    </div>

                </div>


                {/* ================= PRODUCT PREVIEW ================= */}

                <div className="hero-preview">

                    <div className="preview-window">

                        <div className="preview-topbar">

                            <div className="preview-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                            <span>
                                VisitorPass
                            </span>

                        </div>

                        <div className="preview-body">

                            <div className="preview-heading">

                                <div>

                                    <small>
                                        OVERVIEW
                                    </small>

                                    <h3>
                                        Visitor Dashboard
                                    </h3>

                                </div>

                                <span className="preview-status">
                                    ● System active
                                </span>

                            </div>


                            {/* REAL DEMO VALUES */}

                            <div className="preview-stats">

                                <div>

                                    <span>
                                        Visitors
                                    </span>

                                    <strong>
                                        7
                                    </strong>

                                    <small>
                                        Registered visitors
                                    </small>

                                </div>


                                <div>

                                    <span>
                                        Active Passes
                                    </span>

                                    <strong>
                                        4
                                    </strong>

                                    <small>
                                        Currently active
                                    </small>

                                </div>


                                <div>

                                    <span>
                                        Checked In
                                    </span>

                                    <strong>
                                        0
                                    </strong>

                                    <small>
                                        On site now
                                    </small>

                                </div>

                            </div>


                            {/* RECENT VISITORS */}

                            <div className="preview-table">

                                <div className="preview-table-title">
                                    Recent Visitors
                                </div>


                                <div className="preview-row">

                                    <div className="preview-avatar">
                                        K
                                    </div>

                                    <div>

                                        <strong>
                                            Kshitij
                                        </strong>

                                        <small>
                                            Google · Meeting
                                        </small>

                                    </div>

                                    <span className="preview-badge">
                                        Registered
                                    </span>

                                </div>


                                <div className="preview-row">

                                    <div className="preview-avatar">
                                        K
                                    </div>

                                    <div>

                                        <strong>
                                            Kshitijc
                                        </strong>

                                        <small>
                                            Google · Meeting
                                        </small>

                                    </div>

                                    <span className="preview-badge pending">
                                        Registered
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= FEATURES ================= */}

            <section
                className="home-section features-section"
                id="features"
            >

                <div className="section-heading">

                    <span className="section-label">
                        FEATURES
                    </span>

                    <h2>
                        Everything your front desk needs.
                    </h2>

                    <p>
                        Replace paper registers with a simple
                        digital visitor workflow.
                    </p>

                </div>


                <div className="feature-grid">

                    <div className="feature-card">

                        <div className="feature-icon">
                            QR
                        </div>

                        <h3>
                            Digital Visitor Passes
                        </h3>

                        <p>
                            Generate visitor passes with unique
                            QR codes for fast and secure verification.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            ✓
                        </div>

                        <h3>
                            Appointment Approval
                        </h3>

                        <p>
                            Employees can approve visitor requests
                            before guests arrive at the facility.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            ↕
                        </div>

                        <h3>
                            Check In & Check Out
                        </h3>

                        <p>
                            Scan a visitor's QR code to record
                            entry and exit activity instantly.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            ✉
                        </div>

                        <h3>
                            Email Notifications
                        </h3>

                        <p>
                            Keep visitors informed when appointments
                            are approved or updated.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            ◉
                        </div>

                        <h3>
                            Visitor Records
                        </h3>

                        <p>
                            Keep visitor details, photos and visit
                            history organized in one place.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon">
                            ↗
                        </div>

                        <h3>
                            Reports & Export
                        </h3>

                        <p>
                            Search visitor records and export
                            management data when needed.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================= HOW IT WORKS ================= */}

            <section
                className="home-section how-section"
                id="how-it-works"
            >

                <div className="section-heading">

                    <span className="section-label">
                        HOW IT WORKS
                    </span>

                    <h2>
                        From registration to entry in minutes.
                    </h2>

                </div>


                <div className="steps">

                    <div className="step">

                        <div className="step-number">
                            01
                        </div>

                        <h3>
                            Register
                        </h3>

                        <p>
                            Add visitor details and appointment
                            information.
                        </p>

                    </div>


                    <div className="step-line"></div>


                    <div className="step">

                        <div className="step-number">
                            02
                        </div>

                        <h3>
                            Approve
                        </h3>

                        <p>
                            The host reviews and approves the
                            visitor appointment.
                        </p>

                    </div>


                    <div className="step-line"></div>


                    <div className="step">

                        <div className="step-number">
                            03
                        </div>

                        <h3>
                            Issue Pass
                        </h3>

                        <p>
                            Generate a digital visitor pass with
                            a unique QR code.
                        </p>

                    </div>


                    <div className="step-line"></div>


                    <div className="step">

                        <div className="step-number">
                            04
                        </div>

                        <h3>
                            Verify
                        </h3>

                        <p>
                            Security scans the QR code and records
                            the visitor's entry.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================= SECURITY ================= */}

            <section
                className="security-section"
                id="security"
            >

                <div className="security-content">

                    <span className="section-label">
                        SECURE ACCESS
                    </span>

                    <h2>
                        Know who is inside.
                        <br />
                        At every moment.
                    </h2>

                    <p>
                        VisitorPass gives your security and
                        front-desk teams a clear record of
                        visitor activity from arrival to departure.
                    </p>

                    <div className="security-points">

                        <div>
                            <span>✓</span>
                            Role-based staff access
                        </div>

                        <div>
                            <span>✓</span>
                            QR-based visitor verification
                        </div>

                        <div>
                            <span>✓</span>
                            Check-in and check-out logs
                        </div>

                    </div>

                </div>


                <div className="security-card">

                    <div className="security-card-header">

                        <span>
                            VISITOR PASS
                        </span>

                        <span className="valid-badge">
                            VALID
                        </span>

                    </div>

                    <div className="security-pass-body">

                        <div className="security-pass-photo">
                            
                        </div>

                        <div>

                            <small>
                                VISITOR
                            </small>

                            <h3>
                                Visitor Pass
                            </h3>

                            <p>
                                Authorized visitor
                            </p>

                        </div>

                    </div>

                    <div className="security-qr">
                        QR
                    </div>

                    <div className="security-pass-footer">
                        Scan to verify visitor access
                    </div>

                </div>

            </section>


            {/* ================= CTA ================= */}

            <section className="home-cta">

                <span className="section-label">
                    GET STARTED
                </span>

                <h2>
                    Ready to modernize visitor management?
                </h2>

                <p>
                    Give visitors a faster arrival experience
                    while keeping your workplace secure.
                </p>

                <div className="hero-actions">

                    <Link
                        to="/visitor-register"
                        className="hero-primary-button"
                    >
                        Pre-register as Visitor
                        <span>→</span>
                    </Link>

                    <Link
                        to="/login"
                        className="hero-secondary-button"
                    >
                        Staff Login
                    </Link>

                </div>

            </section>


            {/* ================= FOOTER ================= */}

            <footer className="home-footer">

                <div className="footer-brand">

                    <div className="home-logo">

                        <span className="logo-mark">
                            V
                        </span>

                        VisitorPass

                    </div>

                    <p>
                        Simple, secure visitor management.
                    </p>

                </div>


                <div className="footer-links">

                    {/* PRODUCT */}

                    <div>

                        <strong>
                            Product
                        </strong>

                        <a href="#features">
                            Features
                        </a>

                        <a href="#how-it-works">
                            How It Works
                        </a>

                        <a href="#security">
                            Security
                        </a>

                    </div>


                    {/* ACCESS */}

                    <div>

                        <strong>
                            Access
                        </strong>

                        <Link to="/visitor-register">
                            Visitor Registration
                        </Link>

                        <Link to="/login">
                            Staff Login
                        </Link>

                    </div>


                    {/* CONTACT */}

                    <div>

                        <strong>
                            Contact Us
                        </strong>

                        <a
                            href="mailto:krisgangwar8575@gmail.com"
                            className="footer-email"
                        >
                            krisgangwar8575@gmail.com
                        </a>

                        <span className="footer-contact-text">
                            Have questions about VisitorPass?
                        </span>

                    </div>

                </div>


                {/* FOOTER BOTTOM */}

                <div className="footer-bottom">
                    © 2026 VisitorPass. All rights reserved.
                </div>

            </footer>

        </div>
    );
}

export default Home;