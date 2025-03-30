import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from "/src/assets/img/logo.png";

const Loginpage = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isResetting, setIsResetting] = useState(false);
    const [isScreenSmall, setIsScreenSmall] = useState(window.innerWidth < 800);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsScreenSmall(window.innerWidth < 770);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Email dan password harus diisi.");
            return;
        }
        onLogin();
        navigate("/");
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (!email) {
            setError("Masukkan email untuk reset password.");
            return;
        }
        alert("Link reset password telah dikirim ke email Anda.");
        setIsResetting(false);
        setError("");
    };

    const toggleReset = () => {
        setIsResetting(!isResetting);
        setError(""); // Reset pesan error saat berpindah mode
    };

    if (isScreenSmall) {
        return (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-light">
                <div className="bg-warning text-dark p-4 rounded text-center shadow-lg" style={{ maxWidth: "400px" }}>
                    <i className="fas fa-exclamation-triangle mb-3 blinking-logo"></i>
                    <h4>Aplikasi tidak mendukung layar perangkat Anda</h4>
                    <p>Gunakan perangkat dengan lebar layar minimal 800 pixel untuk mengakses aplikasi ini.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-logo" style={{ marginTop: error ? "20px" : "0" }}>
                    <img rc={logo} alt="Logo" />
                </div>
                <h3 className="text-center mb-3 judul-form">
                    {isResetting ? "Reset Password" : "Login"}
                </h3>
                {error && <div className="alert alert-danger"><i className="fas fa-exclamation-circle me-2"></i>{error}</div>}

                {isResetting ? (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Masukkan email"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            <i className="fas fa-paper-plane me-2"></i>Kirim Reset
                        </button>
                        <div className="text-center mt-3">
                            <a href="#" onClick={toggleReset} className="text-decoration-none">
                                <i className="fas fa-arrow-left me-2"></i>Kembali ke Login
                            </a>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Masukkan email"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            <i className="fas fa-sign-in-alt me-2"></i>Login
                        </button>
                        <div className="text-center mt-3">
                            <a href="#" onClick={toggleReset} className="text-decoration-none">
                                <i className="fas fa-key me-2"></i>Lupa Password?
                            </a>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Loginpage;
