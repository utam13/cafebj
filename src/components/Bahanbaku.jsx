import React, { useState } from "react";
import useDragScroll from "../hooks/useDragScroll"; // Import hook

const Bahanbaku = () => {
    const tableRef = useDragScroll(); // Pakai hook
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        kdbahanbaku: "",
        nama: "",
        satuan: "",
        konversi: "",
        nilaikonversi: "0",
    });
    const [errors, setErrors] = useState({});

    // Handle perubahan input
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "konversi") {
            setFormData({
                ...formData,
                konversi: value,
                nilaikonversi: value ? formData.nilaikonversi : "0", // Reset nilai jika kosong
            });
        } else if (name === "nilaikonversi") {
            if (formData.konversi) {
                setFormData({ ...formData, nilaikonversi: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }

        setErrors({ ...errors, [e.target.name]: "" }); // Hapus error setelah diisi
    };

    // Validasi form
    const validateForm = () => {
        let newErrors = {};
        if (!formData.nama) newErrors.nama = "Nama bahan baku harus diisi!";
        if (!formData.satuan) newErrors.satuan = "Satuan harus diisi!";

        // Jika konversi diisi, maka nilaikonversi harus lebih dari 0
        if (formData.konversi) {
            if (!formData.nilaikonversi || parseFloat(formData.nilaikonversi) <= 0) {
                newErrors.nilaikonversi = "Nilai konversi harus lebih dari 0!";
            }
        }

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
                setFormData({ kdbahanbaku: "", nama: "", satuan: "", konversi: "", nilaikonversi: "0" }); // Reset form
            }, 500);
        }
    };

    // Handle tombol Edit
    const handleEdit = (id) => {
        const item = data.find((d) => d.id === id);
        setFormData({ kdbahanbaku: item.kdbahanbaku, nama: item.nama, satuan: item.satuan, konversi: item.konversi, nilaikonversi: item.nilaikonversi });
        setErrors({});
        setEditId(id);
        setShowModal(true);
    };

    // Handle tombol Hapus
    const handleDelete = (id) => {
        const item = data.find((d) => d.id === id); // Cari item berdasarkan ID
        if (!item) return; // Jika tidak ditemukan, hentikan fungsi

        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus bahan baku "${item.nama}"?`);

        if (confirmDelete) {
            setData(data.filter((d) => d.id !== id));
            alert(`Bahan baku "${item.nama}" telah dihapus.`);
        }
    };

    // Handle buka modal (reset inputan)
    const handleOpenModal = () => {
        setFormData({ kdbahanbaku: "", nama: "", satuan: "", konversi: "", nilaikonversi: "0" }); // Kosongkan form
        setErrors({}); // Reset error
        setShowModal(true); // Tampilkan modal
    };

    const [data, setData] = useState([
        { id: 1, kdbahanbaku: 1, nama: "Tepung Beras", satuan: "kg", konversi: "gram", nilaikonversi: 1000, stok: 50 },
        { id: 2, kdbahanbaku: 2, nama: "Gula", satuan: "kg", konversi: "gram", nilaikonversi: 1000, stok: 30 },
        { id: 3, kdbahanbaku: 3, nama: "Sirup", satuan: "botol", konversi: "ml", nilaikonversi: 300, stok: 20 },
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
            <h2>Bahan Baku</h2>

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
                                )} Nama Bahan
                            </th>
                            <th onClick={() => sortTable("satuan")} style={{ cursor: "pointer" }}>
                                {sortColumn === "satuan" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Satuan
                            </th>
                            <th onClick={() => sortTable("konversi")} style={{ cursor: "pointer" }}>
                                {sortColumn === "konversi" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Konversi
                            </th>
                            <th onClick={() => sortTable("stok")} style={{ cursor: "pointer" }}>
                                {sortColumn === "stok" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Stok Saat ini
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
                                <td className="text-center">{item.satuan}</td>
                                <td className="text-center">{item.konversi}</td>
                                <td className="text-center">{item.stok} {item.satuan} = {(item.stok * item.nilaikonversi)} {item.konversi}</td>
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
                                <h5 className="modal-title">Formulir Bahan Baku</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={isSubmitting}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="kdbahanbaku" value={formData.kdbahanbaku} />

                                    <div className="mb-3">
                                        <label className="form-label">Nama Bahan Baku</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.nama ? "is-invalid" : ""}`}
                                            name="nama"
                                            value={formData.nama}
                                            onChange={handleChange}
                                            placeholder="Masukkan nama bahan baku"
                                            autoComplete="off"
                                        />
                                        {errors.nama && <div className="invalid-feedback">{errors.nama}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Satuan</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.satuan ? "is-invalid" : ""}`}
                                            name="satuan"
                                            value={formData.satuan}
                                            onChange={handleChange}
                                            placeholder="Masukkan satuan stok"
                                            autoComplete="off"
                                        />
                                        {errors.satuan && <div className="invalid-feedback">{errors.satuan}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Konversi</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="konversi"
                                            value={formData.konversi}
                                            onChange={handleChange}
                                            placeholder="Masukkan satuan konversi jika diperlukan"
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Nilai Konversi</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.nilaikonversi ? "is-invalid" : ""}`}
                                            name="nilaikonversi"
                                            value={formData.nilaikonversi}
                                            onChange={handleChange}
                                            placeholder="Masukkan nilai konversi jika satuan konversi diisi"
                                            autoComplete="off"
                                            disabled={!formData.konversi}
                                        />
                                        {errors.nilaikonversi && <div className="invalid-feedback">{errors.nilaikonversi}</div>}
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

export default Bahanbaku;
