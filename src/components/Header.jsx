import { NavLink, useNavigate } from "react-router-dom"

const Header = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) {
            onLogout(); // Panggil fungsi logout dari App.jsx
            navigate("/login"); // Arahkan ke halaman login
        }
    };

    return (
        <div className="header">
            <h4>Kedai Kopi BJ</h4>
            <div className="dropdown">
                <a href="#" className="dropdown-toggle d-flex align-items-center text-white" data-bs-toggle="dropdown">
                    <i className="fa fa-user-circle me-2"></i> User 1
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                    <li><NavLink to="/profile" className="dropdown-item">Profile</NavLink></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#" target="_blank">Panduan</a></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
            </div>
        </div>
    );
};

export default Header;
