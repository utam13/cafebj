import React, { useState } from "react";
import useDragScroll from "../hooks/useDragScroll"; // Import hook

const User = () => {
    const tableRef = useDragScroll(); // Pakai hook
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        kduser: "",
        nama: "",
        jk: "",
        email: "",
        password: "",
        lokasikerja: "", //lokasi cabang penempatan atau all area
        status: "",
        permissions: {}
    });
    const [errors, setErrors] = useState({});

    // cabang
    const cabang = [
        { kdcabang: 0, nama: "Gudang" },
        { kdcabang: 1, nama: "Cabang 1" },
        { kdcabang: 2, nama: "Cabang 2" },
        { kdcabang: 3, nama: "Cabang 3" },
        { kdcabang: 4, nama: "Cabang 4" },
        { kdcabang: 5, nama: "Cabang 5" },
        { kdcabang: 100, nama: "Semua Lokasi" },
    ]

    // Toggle visibility password
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Toggle hak akses
    const togglePermission = (menu) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            permissions: {
                ...prevFormData.permissions,
                [menu]: prevFormData.permissions[menu] === 1 ? 0 : 1 // Toggle 1 / 0
            },
        }));
    };

    // Handle perubahan input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [e.target.name]: "" }); // Hapus error setelah diisi
    };

    // Validasi form
    const validateForm = () => {
        let newErrors = {};
        if (!formData.nama) newErrors.nama = "Nama user harus diisi!";
        if (!formData.jk) newErrors.jk = "Gender harus diisi!";
        if (!formData.email) newErrors.email = "Email harus diisi!";
        if (!formData.password) newErrors.password = "Password harus diisi!";
        if (!formData.lokasikerja) newErrors.lokasikerja = "Lokasi kerja harus diisi!";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // True jika tidak ada error
    };

    // Handle submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);

            if (editId !== null) {
                // Mode Edit: Perbarui data berdasarkan ID
                setData(data.map((item) =>
                    item.kduser === editId ? { ...formData, kduser: editId, permissions: [formData.permissions] } : item
                ));
            } else {
                // Mode Tambah: Tambahkan data baru dengan ID baru
                setData([...data, { ...formData, kduser: data.length + 1, permissions: [formData.permissions] }]);
            }

            setTimeout(() => { // Simulasi loading sebentar
                alert("Data berhasil disimpan!");
                setShowModal(false);
                setEditId(null);
                setIsSubmitting(false); // Reset status submit
                setFormData({ kduser: "", nama: "", jk: "", email: "", password: "", status: "", lokasikerja: "", permissions: {} });
            }, 500);
        }
    };


    // Handle tombol Edit
    const handleEdit = (id) => {
        const item = data.find((d) => d.id === id);

        setFormData({
            kduser: item.kduser || "",
            nama: item.nama || "",
            jk: item.jk || "",
            email: item.email || "",
            password: item.password || "",
            status: item.status || "",
            lokasikerja: item.lokasikerja || "",
            permissions: typeof item.permissions === "string" ? JSON.parse(item.permissions) : item.permissions
        });

        setErrors({});
        setEditId(id); // Simpan ID yang sedang diedit
        setShowModal(true); // Tampilkan modal edit
    };

    // Handle tombol Hapus
    const handleDelete = (id) => {
        const item = data.find((d) => d.id === id); // Cari item berdasarkan ID
        if (!item) return; // Jika tidak ditemukan, hentikan fungsi

        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus cabang "${item.nama}"?`);

        if (confirmDelete) {
            setData(data.filter((d) => d.id !== id));
            alert(`User "${item.nama}" telah dihapus.`);
        }
    };

    // Handle buka modal (reset inputan)
    const handleOpenModal = () => {
        setFormData({ kduser: "", nama: "", jk: "", email: "", password: "", lokasikerja: "", permissions: {} }); // Kosongkan form
        setErrors({}); // Reset error
        setShowModal(true); // Tampilkan modal
    };

    // Daftar hak akses yang tersedia
    const permissionLabels = {
        bahanbaku: "Bahan Baku",
        // beban: "Beban",
        penjualan: "Penjualan",
        pengeluaran: "Pengeluaran",
        kelolastok: "Kelola Stok",
        laporan: "Laporan",
        settings: "Settings",
    };

    const [genderList, setGenderList] = useState([
        "Laki-laki",
        "Perempuan"
    ]);

    const [data, setData] = useState([
        {
            id: 1, kduser: 1, nama: "User 1", jk: "Laki-laki", email: "user1@gmail.com", password: "1234567890", status: "Aktif", lokasikerja: 2, namalokasi: "Cabang 2",
            permissions: {
                bahanbaku: 1,
                // beban: 1,
                penjualan: 1,
                pengeluaran: 1,
                kelolastok: 1,
                laporan: 1,
                settings: 1,
            }
        },
        {
            id: 2, kduser: 2, nama: "User 2", jk: "Laki-laki", email: "user2@gmail.com", password: "1234567890", status: "Aktif", lokasikerja: 0, namalokasi: "Gudang",
            permissions: {
                bahanbaku: 1,
                // beban: 1,
                penjualan: 1,
                pengeluaran: 1,
                kelolastok: 1,
                laporan: 1,
                settings: 1,
            }
        },
        {
            id: 3, kduser: 3, nama: "User 3", jk: "Perempuan", email: "user3@gmail.com", password: "1234567890", status: "Aktif", lokasikerja: 100, namalokasi: "Semua Lokasi",
            permissions: {
                bahanbaku: 1,
                // beban: 1,
                penjualan: 1,
                pengeluaran: 1,
                kelolastok: 1,
                laporan: 1,
                settings: 1,
            }
        }
    ]);

    const [sortColumn, setSortColumn] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Fungsi sorting tabel
    const sortTable = (key) => {
        let newSortOrder = "asc";

        // Jika klik kolom yang sama, ubah arah sorting
        if (sortColumn === key && sortOrder === "asc") {
            newSortOrder = "desc";
        }

        const sortedData = [...data].sort((a, b) => {
            if (sortOrder === "asc") {
                return a[key] > b[key] ? 1 : -1;
            } else {
                return a[key] < b[key] ? 1 : -1;
            }
        });

        setSortColumn(key);  // Simpan kolom yang sedang diurutkan
        setSortOrder(newSortOrder); // Simpan urutan (asc/desc)
        setData(sortedData);
    };

    // Fungsi pencarian
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    // Filter data berdasarkan pencarian
    const filteredData = data.filter((item) =>
        Object.values(item).some(
            (value) =>
                value !== null &&
                value !== undefined &&
                value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    // Pagination untuk hasil pencarian
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="content">
            <h2>User & Hak Akses</h2>

            {/* Tombol Tambah & Filter */}
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-primary btn-sm" onClick={handleOpenModal}><i className="fa-solid fa-plus"></i> Tambah Data</button>
                <input
                    type="text"
                    className="form-control form-control-sm w-25"
                    placeholder="Cari..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {/* Tabel Data */}
            <div className="table-responsive" ref={tableRef}>
                <table className="table table-bordered table-hover table-striped table-sm">
                    <thead className="table-dark">
                        <tr>
                            <th className="col-id" onClick={() => sortTable("id")} style={{ cursor: "pointer" }}>
                                {sortColumn === "id" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} #
                            </th>
                            <th className="col-aksi" >Aksi</th>
                            <th onClick={() => sortTable("nama")} style={{ cursor: "pointer" }}>
                                {sortColumn === "nama" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Nama
                            </th>
                            <th onClick={() => sortTable("jk")} style={{ cursor: "pointer" }}>
                                {sortColumn === "jk" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Gender
                            </th>
                            <th onClick={() => sortTable("email")} style={{ cursor: "pointer" }}>
                                {sortColumn === "email" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Email
                            </th>
                            <th onClick={() => sortTable("namalokasi")} style={{ cursor: "pointer" }}>
                                {sortColumn === "namalokasi" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Lokasi Kerja
                            </th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {currentData.map((item) => (
                            <tr key={item.id}>
                                <td className="text-center">{item.id}</td>
                                <td className="text-center">
                                    {/* Tombol Edit */}
                                    <button className="btn btn-warning btn-xs me-1" onClick={() => handleEdit(item.id)}>
                                        <i className="fa fa-edit"></i>
                                    </button>
                                    {/* Tombol Hapus */}
                                    <button className="btn btn-danger btn-xs me-1" onClick={() => handleDelete(item.id)}>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                                <td>{item.nama}</td>
                                <td className="text-center">{item.jk}</td>
                                <td className="text-center">{item.email}</td>
                                <td className="text-center">{item.namalokasi}</td>
                                <td className={`text-center fw-bold ${item.status === "Aktif" ? "text-success" : "text-danger"}`}>{item.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center">
                <nav>
                    <ul className="pagination">Halaman
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {
                showModal && (
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Formulir User</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={isSubmitting}></button>
                                </div>
                                <div className="modal-body d-flex">
                                    {/* Form Input */}
                                    <div className="w-50 pe-3">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label">Nama</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.nama ? "is-invalid" : ""}`}
                                                    name="nama"
                                                    value={formData.nama}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan nama user"
                                                    autoComplete="off"
                                                />
                                                {errors.nama && <div className="invalid-feedback">{errors.nama}</div>}
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Gender</label>
                                                <select className={`form-select ${errors.jk ? "is-invalid" : ""}`}
                                                    name="jk"
                                                    value={formData.jk}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">-- Pilih Gender --</option>
                                                    {genderList.map((gender, index) => (
                                                        <option key={index} value={gender}>
                                                            {gender}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.jk && <div className="invalid-feedback">{errors.jk}</div>}
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan email user"
                                                    autoComplete="off"
                                                />
                                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Password</label>
                                                <div className="input-group">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Masukkan password user"
                                                        autoComplete="new-password"
                                                    />
                                                    <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                                                        {showPassword ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
                                                    </button>
                                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Lokasi Kerja</label>
                                                <select
                                                    className={`form-select ${errors.lokasikerja ? "is-invalid" : ""}`}
                                                    name="lokasikerja"
                                                    value={formData.lokasikerja}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">-- Pilih Cabang --</option>
                                                    {cabang.map((cabangcafe, index) => (
                                                        <option key={index} value={cabangcafe.kdcabang}>
                                                            {cabangcafe.nama}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.lokasikerja && <div className="invalid-feedback">{errors.lokasikerja}</div>}
                                            </div>
                                        </form>
                                    </div>

                                    {/* Hak Akses */}
                                    <div className="w-50 ps-3">
                                        <h6>Hak Akses</h6>
                                        <ul className="list-group">
                                            {Object.keys(permissionLabels).map((key) => (
                                                <li key={key} className="list-group-item d-flex justify-content-between align-items-center">
                                                    {permissionLabels[key]}
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={formData.permissions[key] === 1} // Sesuai dengan kunci dalam data
                                                            onChange={() => togglePermission(key)}
                                                        />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="modal-footer d-flex flex-row justify-content-between">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                                        Tutup
                                    </button>
                                    <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Overlay untuk modal */}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div >
    );
};

export default User;
