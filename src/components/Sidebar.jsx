import { useState } from "react"
import { NavLink } from "react-router-dom"
import logo from "/src/assets/img/logo.png";

const Sidebar = () => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    return (
        <div className="sidebar d-flex flex-column">
            <div className="text-center mb-4">
                <img src={logo} alt="Logo" className="img-fluid rounded-circle" />
            </div>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} onClick={() => toggleDropdown("")}>
                <i className="fa fa-store me-2"></i> Dashboard
            </NavLink>

            <NavLink to="/bahanbaku" className={({ isActive }) => isActive ? "active" : ""} onClick={() => toggleDropdown("")}>
                <i className="fa fa-cube me-2"></i> Bahan Baku
            </NavLink>

            {/* <div className="dropdown">
                <a href="#" className="d-flex align-items-center toggle-dropdown" onClick={() => toggleDropdown("dataUtama")}>
                    <i className="fa fa-folder-open me-2"></i> Data Utama
                    <i className={`fa ${openDropdown === "dataUtama" ? "fa-chevron-up" : "fa-chevron-down"} ms-auto`}></i>
                </a>
                <div className={`datautama ${openDropdown === "dataUtama" ? "" : "collapse"}`}>
                    <NavLink to="/bahanbaku" className={({ isActive }) => isActive ? "submenu-item active" : "submenu-item"}>
                        <span><i className="fa fa-ellipsis-vertical"></i> Bahan Baku</span>
                    </NavLink>
                    <NavLink to="/beban" className={({ isActive }) => isActive ? "submenu-item active" : "submenu-item"}>
                        <span><i className="fa fa-ellipsis-vertical"></i> Beban</span>
                    </NavLink>
                </div>
            </div> */}

            <NavLink to="/pengeluaran" className={({ isActive }) => isActive ? "active" : ""} onClick={() => toggleDropdown("")}><i className="fa fa-file-invoice-dollar me-2"></i> Pengeluaran</NavLink>
            <NavLink to="/penjualan" className={({ isActive }) => isActive ? "active" : ""} onClick={() => toggleDropdown("")}><i className="fa fa-cash-register me-2"></i> Penjualan</NavLink>

            <div className="dropdown">
                <a href="#" className="d-flex align-items-center toggle-dropdown" data-bs-toggle="collapse"
                    data-bs-target="#kelolastok" onClick={() => toggleDropdown("kelolastok")}>
                    <i className="fa fa-cubes me-2"></i> Kelola Stok
                    <i className={`fa ${openDropdown === "kelolastok" ? "fa-chevron-up" : "fa-chevron-down"} ms-auto`}></i>
                </a>
                <div className={`kelolastok ${openDropdown === "kelolastok" ? "" : "collapse"}`}>
                    <NavLink to="/perbaikanstok" className={({ isActive }) => isActive ? "submenu-item active" : "submenu-item"}>
                        <span><i className="fa fa-ellipsis-vertical"></i> Perbaikan Stok</span>
                    </NavLink>
                    <NavLink to="/recheckstok" className={({ isActive }) => isActive ? "submenu-item active" : "submenu-item"}>
                        <span><i className="fa fa-ellipsis-vertical"></i> Recheck Stok</span>
                    </NavLink>
                    <NavLink to="/transferstok" className={({ isActive }) => isActive ? "submenu-item active" : "submenu-item"}>
                        <span><i className="fa fa-ellipsis-vertical"></i> Transfer Stok</span>
                    </NavLink>
                </div>
            </div>

            <NavLink to="/laporan" className={({ isActive }) => isActive ? "active" : ""} onClick={() => toggleDropdown("")}><i className="fa fa-paste me-2"></i> Laporan</NavLink>

            <div className="dropdown">
                <a href="#" className="d-flex align-items-center toggle-dropdown" data-bs-toggle="collapse"
                    data-bs-target="#setting" onClick={() => toggleDropdown("setting")}>
                    <i className="fa fa-cogs me-2"></i> Settings
                    <i className={`fa ${openDropdown === "setting" ? "fa-chevron-up" : "fa-chevron-down"} ms-auto`}></i>
                </a>
                <div className={`setting ${openDropdown === "setting" ? "" : "collapse"}`}>
                    <NavLink to="/cabang" className={({ isActive }) => isActive ? "submenu-item active" : "submenu-item"}>
                        <span><i className="fa fa-ellipsis-vertical"></i> Cabang</span>
                    </NavLink>
                    <NavLink to="/kategoripengeluaran" className={({ isActive }) => isActive ? "submenu-item active" : "submenu-item"}>
                        <span><i className="fa fa-ellipsis-vertical"></i> Kategori
                            Pengeluaran</span>
                    </NavLink>
                    <NavLink to="/user" className={({ isActive }) => isActive ? "submenu-item active" : "submenu-item"}>
                        <span><i className="fa fa-ellipsis-vertical"></i> User & Hak Akses</span>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
