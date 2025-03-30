import { useEffect } from "react"
import initBehavior from "../assets/js/behavior"

const Sidebar = () => {
    useEffect(() => {
        initBehavior();  // Jalankan behavior.js setelah render
    }, []);

    return (
        <div className="sidebar d-flex flex-column">
            <div className="text-center mb-4">
                <img src="/src/assets/img/logo.png" alt="Logo" className="img-fluid rounded-circle" />
            </div>
            <a href="#"><i className="fa fa-store me-2"></i> Dashboard</a>
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center toggle-dropdown" data-bs-toggle="collapse"
                    data-bs-target="#datautama">
                    <i className="fa fa-folder-open me-2"></i> Data Utama <i className="fa fa-chevron-down dropdown-menu-icon"></i>
                </a>
                <div className="datautama collapse" id="datautama">
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> Bahan Baku</span>
                    </a>
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> Beban</span>
                    </a>
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> Cabang</span>
                    </a>
                </div>
            </div>
            <a href="#"><i className="fa fa-file-invoice-dollar me-2"></i> Pengeluaran</a>
            <a href="#"><i className="fa fa-cash-register me-2"></i> Penjualan</a>
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center toggle-dropdown" data-bs-toggle="collapse"
                    data-bs-target="#kelolastok">
                    <i className="fa fa-cubes me-2"></i> Kelola Stok <i className="fa fa-chevron-down dropdown-menu-icon"></i>
                </a>
                <div className="kelolastok collapse" id="kelolastok">
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> Cek Stok</span>
                    </a>
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> Perbaikan Stok</span>
                    </a>
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> Stock Taking</span>
                    </a>
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> Transfer Stok</span>
                    </a>
                </div>
            </div>
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center toggle-dropdown" data-bs-toggle="collapse"
                    data-bs-target="#laporan">
                    <i className="fa fa-paste me-2"></i> Laporan <i className="fa fa-chevron-down dropdown-menu-icon"></i>
                </a>
                <div className="laporan collapse" id="laporan">
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> Rekap Pengeluaran</span>
                    </a>
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> Rekap Penjualan</span>
                    </a>
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> Rekap Tagihan</span>
                    </a>
                </div>
            </div>
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center toggle-dropdown" data-bs-toggle="collapse"
                    data-bs-target="#setting">
                    <i className="fa fa-cogs me-2"></i> Settings <i className="fa fa-chevron-down dropdown-menu-icon"></i>
                </a>
                <div className="setting collapse" id="setting">
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> Kategori
                            Pengeluaran</span>
                    </a>
                    <a href="#" className="submenu-item">
                        <span><i className="fa fa-ellipsis-vertical"></i> User & Hak Akses</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
