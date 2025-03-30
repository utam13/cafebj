import React, { useState } from "react";
import useDragScroll from "../hooks/useDragScroll"; // Import hook

const Beban = () => {
    const tableRef = useDragScroll(); // Pakai hook
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        kdbeban: "",
        nama: "",
        kategoripengeluaran: "",
    });
    const [errors, setErrors] = useState({});

    const kategoriList = [
        "Air",
        "Gaji",
        "Lemburan",
        "Listrik",
        "Maintenance",
        "Lain-lain"
    ];

    // Handle perubahan input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [e.target.name]: "" }); // Hapus error setelah diisi
    };

    // Validasi form
    const validateForm = () => {
        let newErrors = {};
        if (!formData.nama) newErrors.nama = "Nama beban harus diisi!";
        if (!formData.kategoripengeluaran) newErrors.kategoripengeluaran = "Kategori pengeluaran harus diisi!";

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
                setData(data.map((item) => (item.id === editId ? { ...formData, id: editId } : item)));
            } else {
                // Mode Tambah: Tambahkan data baru dengan ID baru
                setData([...data, { ...formData, id: data.length + 1 }]);
            }

            setTimeout(() => { // Simulasi loading sebentar
                alert("Data berhasil disimpan!");
                setShowModal(false); // Tutup modal setelah submit
                setEditId(null);
                setIsSubmitting(false); // Reset status submit
                setFormData({ kdbeban: "", nama: "", kategoripengeluaran: "" }); // Reset form
            }, 500);
        }
    };

    // Handle tombol Edit
    const handleEdit = (id) => {
        const item = data.find((d) => d.id === id);
        setFormData({ kdbeban: item.kdbeban, nama: item.nama, kategoripengeluaran: item.kategoripengeluaran || "" });
        setErrors({});
        setEditId(id);
        setShowModal(true);
    };

    // Handle tombol Hapus
    const handleDelete = (id) => {
        const item = data.find((d) => d.id === id); // Cari item berdasarkan ID
        if (!item) return; // Jika tidak ditemukan, hentikan fungsi

        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus beban "${item.nama}"?`);

        if (confirmDelete) {
            setData(data.filter((d) => d.id !== id));
            alert(`Beban "${item.nama}" telah dihapus.`);
        }
    };

    // Handle buka modal (reset inputan)
    const handleOpenModal = () => {
        setFormData({ kdbeban: "", nama: "", kategoripengeluaran: "" }); // Kosongkan form
        setErrors({}); // Reset error
        setShowModal(true); // Tampilkan modal
    };

    const [data, setData] = useState([
        { id: 1, kdbeban: 1, nama: "Listrik", kategoripengeluaran: "Listrik" },
        { id: 2, kdbeban: 2, nama: "Air", kategoripengeluaran: "Air" },
        { id: 3, kdbeban: 3, nama: "Perbaikan Mesin Kopi", kategoripengeluaran: "Maintenance" },
        { id: 4, kdbeban: 4, nama: "Sumbangan", kategoripengeluaran: "Lain-lain" },
        { id: 5, kdbeban: 5, nama: "Perbaikan Listrik", kategoripengeluaran: "Maintenance" },
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
            <h2>Beban</h2>

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
                                )} Nama Beban
                            </th>
                            <th onClick={() => sortTable("kategoripengeluaran")} style={{ cursor: "pointer" }}>
                                {sortColumn === "kategoripengeluaran" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Kategori Pengeluaran
                            </th>
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
                                    <button className="btn btn-danger btn-xs" onClick={() => handleDelete(item.id)}>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                                <td>{item.nama}</td>
                                <td className="text-center">{item.kategoripengeluaran}</td>
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

            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Formulir Beban</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={isSubmitting}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="kdbeban" value={formData.kdbeban} />

                                    <div className="mb-3">
                                        <label className="form-label">Nama Beban</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.nama ? "is-invalid" : ""}`}
                                            name="nama"
                                            value={formData.nama}
                                            onChange={handleChange}
                                            placeholder="Masukkan nama beban"
                                            autoComplete="off"
                                        />
                                        {errors.nama && <div className="invalid-feedback">{errors.nama}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Kategori Pengeluaran</label>
                                        <select
                                            className={`form-control ${errors.kategoripengeluaran ? "is-invalid" : ""}`}
                                            name="kategoripengeluaran"
                                            value={formData.kategoripengeluaran}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- Pilih Kategori --</option>
                                            {kategoriList.map((kategori, index) => (
                                                <option key={index} value={kategori}>
                                                    {kategori}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.kategoripengeluaran && <div className="invalid-feedback">{errors.kategoripengeluaran}</div>}
                                    </div>

                                    <div className="modal-footer d-flex flex-row justify-content-between">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>
                                            Tutup
                                        </button>
                                        <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay untuk modal */}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default Beban;
