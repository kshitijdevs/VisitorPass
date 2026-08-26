import "../style/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch(
            "http://localhost:5000/api/users/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        }
    };

    return (
        <div className="login-page">

            <div className="login-container">

                {/* Brand */}
                <div className="login-brand">
                    <h1>VisitorPass</h1>

                    <p>
                        Secure visitor management system
                    </p>
                </div>

                {/* Login Card */}
                <div className="login-card">

                    <h2>Staff Login</h2>

                    <p className="login-subtitle">
                        Sign in to manage visitors, appointments and passes.
                    </p>

                    <form onSubmit={handleLogin}>

                        {/* Email */}
                        <div className="login-form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                className="login-input"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>

                        {/* Password */}
                        <div className="login-form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                className="login-input"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>

                        {/* Login Button */}
                        <button
                            className="login-button"
                            type="submit"
                        >
                            Sign In
                        </button>

                    </form>

                    <div className="login-footer">
                        Authorized staff access only
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;