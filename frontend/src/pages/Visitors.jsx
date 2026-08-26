import "../style/Visitors.css";
import { useEffect, useState } from "react";

function Visitors() {
    const [visitors, setVisitors] = useState([]);
    const [search, setSearch] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [purpose, setPurpose] = useState("");
    const [photo, setPhoto] = useState(null);

    const fetchVisitors = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/visitors",
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
            console.error("Error fetching visitors:", error);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const formData = new FormData();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("company", company);
        formData.append("purpose", purpose);

        if (photo) {
            formData.append("photo", photo);
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/visitors",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Visitor registered successfully!");

                setName("");
                setEmail("");
                setPhone("");
                setCompany("");
                setPurpose("");
                setPhoto(null);

                document.getElementById("visitor-photo").value = "";

                fetchVisitors();
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            alert("Unable to connect to server");
        }
    };

    const filteredVisitors = visitors.filter((visitor) => {
        const text = search.toLowerCase();

        return (
            visitor.name?.toLowerCase().includes(text) ||
            visitor.email?.toLowerCase().includes(text) ||
            visitor.phone?.toLowerCase().includes(text) ||
            visitor.company?.toLowerCase().includes(text) ||
            visitor.purpose?.toLowerCase().includes(text)
        );
    });

    return (
        <div className="visitors-page">

            {/* Page Header */}

            <div className="page-header">

                <div>
                    <h1>Visitors</h1>

                    <p>
                        Register and manage visitors in your organization.
                    </p>
                </div>

                <div className="page-header-count">
                    {filteredVisitors.length} visitors
                </div>

            </div>


            {/* Registration Card */}

            <div className="visitor-form-card">

                <div className="form-card-header">

                    <div>
                        <h2>Register Visitor</h2>

                        <p>
                            Add visitor information and upload their photo.
                        </p>
                    </div>

                    <div className="form-card-icon">
                        +
                    </div>

                </div>


                <form onSubmit={handleSubmit}>

                    <div className="visitor-form-grid">

                        <div className="form-field">

                            <label>
                                Visitor Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter visitor name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="visitor@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                placeholder="10-digit phone number"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                pattern="[0-9]{10}"
                                title="Enter a valid 10-digit phone number"
                                required
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Company
                            </label>

                            <input
                                type="text"
                                placeholder="Company name"
                                value={company}
                                onChange={(e) =>
                                    setCompany(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="form-field form-field-full">

                            <label>
                                Purpose of Visit
                            </label>

                            <input
                                type="text"
                                placeholder="Why is the visitor coming?"
                                value={purpose}
                                onChange={(e) =>
                                    setPurpose(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="form-field form-field-full">

                            <label>
                                Visitor Photo
                            </label>

                            <input
                                id="visitor-photo"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(e) =>
                                    setPhoto(e.target.files[0])
                                }
                                required
                            />

                            <small>
                                JPG, PNG or WEBP · Maximum 5 MB
                            </small>

                        </div>

                    </div>


                    <div className="form-actions">

                        <button
                            className="visitor-submit-btn"
                            type="submit"
                        >
                            Register Visitor
                        </button>

                    </div>

                </form>

            </div>


            {/* Visitors List */}

            <div className="visitor-list-card">

                <div className="visitor-list-header">

                    <div>
                        <h2>Registered Visitors</h2>

                        <p>
                            Search and view all registered visitors.
                        </p>
                    </div>

                    <span className="visitor-result-count">
                        {filteredVisitors.length} results
                    </span>

                </div>


                {/* Search */}

                <div className="visitor-search">

                    <span className="search-icon">
                        ⌕
                    </span>

                    <input
                        type="text"
                        placeholder="Search by name, email, phone, company or purpose..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                {/* Table */}

                <div className="visitor-table-wrapper">

                    <table className="visitor-table">

                        <thead>

                            <tr>
                                <th>Visitor</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Company</th>
                                <th>Purpose</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredVisitors.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="visitor-empty-cell"
                                    >

                                        <div className="visitor-empty">

                                            <div className="empty-icon">
                                                👤
                                            </div>

                                            <strong>
                                                No visitors found
                                            </strong>

                                            <p>
                                                Try changing your search
                                                or register a new visitor.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredVisitors.map((visitor) => (

                                    <tr key={visitor._id}>

                                        <td>

                                            <div className="visitor-cell">

                                                {visitor.photo ? (

                                                    <img
                                                        src={`http://localhost:5000${visitor.photo}`}
                                                        alt={visitor.name}
                                                    />

                                                ) : (

                                                    <div className="visitor-avatar">
                                                        {visitor.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                )}

                                                <strong>
                                                    {visitor.name}
                                                </strong>

                                            </div>

                                        </td>

                                        <td>
                                            {visitor.email}
                                        </td>

                                        <td>
                                            {visitor.phone}
                                        </td>

                                        <td>
                                            {visitor.company || "-"}
                                        </td>

                                        <td>
                                            {visitor.purpose || "-"}
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Visitors;