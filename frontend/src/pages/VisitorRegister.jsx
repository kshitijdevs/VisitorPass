import "../style/visitor-register.css";
import { useState } from "react";

function VisitorRegister() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        host: "",
        purpose: "",
        date: "",
        time: ""
    });

    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("email", form.email);
            formData.append("phone", form.phone);
            formData.append("company", form.company);
            formData.append("host", form.host);
            formData.append("purpose", form.purpose);
            formData.append("date", form.date);
            formData.append("time", form.time);

            if (photo) {
                formData.append("photo", photo);
            }

            const response = await fetch(
                "http://localhost:5000/api/visitor-register",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage(
                    "Registration submitted successfully!"
                );

                setForm({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    host: "",
                    purpose: "",
                    date: "",
                    time: ""
                });

                setPhoto(null);

                const fileInput =
                    document.getElementById(
                        "visitorPhoto"
                    );

                if (fileInput) {
                    fileInput.value = "";
                }
            } else {
                setMessage(
                    data.message ||
                        "Registration failed"
                );
            }

        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to connect to server"
            );
        }
    };

    return (
        <main className="visitor-register-page">

            <div className="visitor-register-wrapper">

                {/* Header */}

                <div className="visitor-register-header">

                    <p className="visitor-register-label">
                        VISITOR REGISTRATION
                    </p>

                    <h1>
                        Pre-register your visit
                    </h1>

                    <p>
                        Provide your details before arriving.
                        Your host will review your appointment
                        and you'll receive further instructions.
                    </p>

                </div>


                {/* Card */}

                <section className="visitor-register-card">

                    <div className="visitor-register-card-header">

                        <h2>
                            Visit Information
                        </h2>

                        <p>
                            Please provide accurate information
                            for a smooth check-in experience.
                        </p>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="visitor-register-form"
                    >

                        {/* Personal Information */}

                        <div className="visitor-form-section">

                            <div className="visitor-form-section-title">
                                Personal Information
                            </div>

                            <div className="visitor-form-grid">

                                <div className="visitor-form-group">

                                    <label htmlFor="name">
                                        Full Name
                                        <span className="visitor-required">
                                            {" "}*
                                        </span>
                                    </label>

                                    <input
                                        id="name"
                                        className="visitor-form-input"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="visitor-form-group">

                                    <label htmlFor="email">
                                        Email Address
                                        <span className="visitor-required">
                                            {" "}*
                                        </span>
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        className="visitor-form-input"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="visitor-form-group">

                                    <label htmlFor="phone">
                                        Phone Number
                                        <span className="visitor-required">
                                            {" "}*
                                        </span>
                                    </label>

                                    <input
                                        id="phone"
                                        type="tel"
                                        className="visitor-form-input"
                                        name="phone"
                                        placeholder="10-digit phone number"
                                        value={form.phone}
                                        onChange={handleChange}
                                        pattern="[0-9]{10}"
                                        title="Enter a valid 10-digit phone number"
                                        required
                                    />

                                </div>


                                <div className="visitor-form-group">

                                    <label htmlFor="company">
                                        Company / Organization
                                    </label>

                                    <input
                                        id="company"
                                        className="visitor-form-input"
                                        name="company"
                                        placeholder="Company name"
                                        value={form.company}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Visit Details */}

                        <div className="visitor-form-section">

                            <div className="visitor-form-section-title">
                                Visit Details
                            </div>

                            <div className="visitor-form-grid">

                                <div className="visitor-form-group">

                                    <label htmlFor="host">
                                        Person You're Visiting
                                        <span className="visitor-required">
                                            {" "}*
                                        </span>
                                    </label>

                                    <input
                                        id="host"
                                        className="visitor-form-input"
                                        name="host"
                                        placeholder="Host / employee name"
                                        value={form.host}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="visitor-form-group">

                                    <label htmlFor="purpose">
                                        Purpose of Visit
                                        <span className="visitor-required">
                                            {" "}*
                                        </span>
                                    </label>

                                    <input
                                        id="purpose"
                                        className="visitor-form-input"
                                        name="purpose"
                                        placeholder="e.g. Meeting, Interview"
                                        value={form.purpose}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="visitor-form-group">

                                    <label htmlFor="date">
                                        Visit Date
                                        <span className="visitor-required">
                                            {" "}*
                                        </span>
                                    </label>

                                    <input
                                        id="date"
                                        type="date"
                                        className="visitor-form-input"
                                        name="date"
                                        value={form.date}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="visitor-form-group">

                                    <label htmlFor="time">
                                        Visit Time
                                        <span className="visitor-required">
                                            {" "}*
                                        </span>
                                    </label>

                                    <input
                                        id="time"
                                        type="time"
                                        className="visitor-form-input"
                                        name="time"
                                        value={form.time}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Photo */}

                        <div className="visitor-form-section">

                            <div className="visitor-form-section-title">
                                Visitor Identification
                            </div>

                            <div className="visitor-form-group">

                                <label htmlFor="visitorPhoto">
                                    Visitor Photo
                                    <span className="visitor-required">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="visitor-photo-upload">

                                    <input
                                        id="visitorPhoto"
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={(e) =>
                                            setPhoto(
                                                e.target.files[0]
                                            )
                                        }
                                        required
                                    />

                                    <div className="visitor-photo-help">
                                        JPG, PNG or WebP. Use a clear
                                        photo of the visitor.
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Submit */}

                        <div className="visitor-register-actions">

                            <button
                                type="submit"
                                className="visitor-submit-button"
                            >
                                Submit Registration
                            </button>

                        </div>

                    </form>


                    {/* Message */}

                    {message && (
                        <div className="visitor-register-message">
                            {message}
                        </div>
                    )}

                </section>


                <p className="visitor-register-note">
                    Your information will be used only for
                    visitor registration and access management.
                </p>

            </div>

        </main>
    );
}

export default VisitorRegister;