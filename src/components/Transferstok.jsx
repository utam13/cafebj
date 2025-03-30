import React, { useState } from "react";
import useDragScroll from "../hooks/useDragScroll"; // Import hook
import useNumberFormat from "../hooks/useNumberFormat";

const Transferstok = () => {
    const tableRef = useDragScroll(); // Pakai hook
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const [satuanOptions, setSatuanOptions] = useState([]);

    const [formData, setFormData] = useState({
        kdtransferstok: "",
        tgl: today,
        dari: "",
        tujuan: "",
        kdbahanbaku: "",
        qty: "",
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
    ]

    // bahan baku
    const bahanbaku = [
        { kdbahanbaku: 1, nama: "Tepung Beras", satuan: "kg", konversi: "gram" },
        { kdbahanbaku: 2, nama: "Gula", satuan: "kg", konversi: "gram" },
        { kdbahanbaku: 3, nama: "Sirup", satuan: "botol", konversi: "ml" },
        { kdbahanbaku: 4, nama: "Bayam", satuan: "ikat", konversi: "gram" },
        { kdbahanbaku: 5, nama: "Biji Kopi", satuan: "karung", konversi: "kg" },
        { kdbahanbaku: 6, nama: "Keju", satuan: "kotak", konversi: "gram" },
        { kdbahanbaku: 7, nama: "Krimer", satuan: "botol", konversi: "gram" },
    ]

    // Handle perubahan input
    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (name === "qty") {
            newValue = formatNumber(value, e); // Kirim event ke formatNumber
        }

        // Jika bahan baku dipilih, update opsi satuan
        if (name === "kdbahanbaku") {
            const selectedBahan = bahanbaku.find((b) => b.kdbahanbaku === parseInt(value));
            if (selectedBahan) {
                setSatuanOptions([selectedBahan.satuan, selectedBahan.konversi].filter(Boolean));
            } else {
                setSatuanOptions([]); // Reset jika tidak ada bahan baku yang dipilih
            }
        }

        setFormData({ ...formData, [name]: newValue });
        setErrors({ ...errors, [e.target.name]: "" }); // Hapus error setelah diisi
    };

    // Validasi form
    const validateForm = () => {
        let newErrors = {};
        if (!formData.tgl) newErrors.tgl = "Tanggal harus diisi!";
        if (!formData.dari) newErrors.dari = "Asal transfer harus diisi!";
        if (!formData.tujuan) newErrors.tujuan = "Tujuan transfer harus diisi!";
        if (!formData.kdbahanbaku) newErrors.kdbahanbaku = "Bahan baku harus diisi!";
        if (!formData.qty) newErrors.qty = "Qty harus diisi!";
        if (!formData.satuan) newErrors.satuan = "Satuan harus diisi!";

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
                setFormData({ kdtransferstok: "", tgl: today, dari: "", tujuan: "", kdbahanbaku: "", qty: "", satuan: "" }); // Reset form
            }, 500);
        }
    };

    // Handle tombol Edit
    const handleEdit = (id) => {
        const item = data.find((d) => d.id === id);
        if (!item) return;

        // Cari bahan baku yang sesuai
        const bahan = bahanbaku.find((b) => b.kdbahanbaku === item.kdbahanbaku);

        if (bahan) {
            setSatuanOptions([bahan.satuan, bahan.konversi].filter(Boolean));
        } else {
            setSatuanOptions([]); // Reset jika tidak ada bahan baku yang dipilih
        }

        setFormData({
            kdtransferstok: item.kdtransferstok,
            tgl: item.tgl, // Mengisi tanggal
            dari: item.dari,
            tujuan: item.tujuan, // Mengisi nama cabang
            kdbahanbaku: item.kdbahanbaku,
            qty: item.qty.toLocaleString(),
            satuan: bahan ? bahan.satuan : "", // Mengisi satuan sesuai bahan baku
        });

        setErrors({});
        setEditId(id);
        setShowModal(true);
    };

    // Handle tombol Hapus
    const handleDelete = (id) => {
        const item = data.find((d) => d.id === id); // Cari item berdasarkan ID
        if (!item) return; // Jika tidak ditemukan, hentikan fungsi

        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus cabang "${item.nama}"?`);

        if (confirmDelete) {
            setData(data.filter((d) => d.id !== id));
            alert(`Cabang "${item.nama}" telah dihapus.`);
        }
    };

    // Handle buka modal (reset inputan)
    const handleOpenModal = () => {
        setFormData({ kdtransferstok: "", tgl: today, dari: "", tujuan: "", kdbahanbaku: "", qty: "", satuan: "" }); // Kosongkan form
        setSatuanOptions([]);
        setErrors({}); // Reset error
        setShowModal(true); // Tampilkan modal
    };

    const [data, setData] = useState([
        { id: 1, kdtransferstok: 1, tgl: "2025-02-01", kduser: 2, namauser: "User 2", dari: 0, namadari: "Gudang", tujuan: 1, namatujuan: "Cabang 1", kdbahanbaku: 1, namabahanbaku: "Tepung Terigu", qty: 10, satuan: "kg", konversi: "" },
        { id: 2, kdtransferstok: 2, tgl: "2025-02-04", kduser: 3, namauser: "User 3", dari: 0, namadari: "Gudang", tujuan: 2, namatujuan: "Cabang 2", kdbahanbaku: 7, namabahanbaku: "Krimer", qty: 20, satuan: "gram", konversi: "" },
        { id: 3, kdtransferstok: 3, tgl: "2025-02-10", kduser: 5, namauser: "User 5", dari: 1, namadari: "Cabang 1", tujuan: 3, namatujuan: "Cabang 3", kdbahanbaku: 4, namabahanbaku: "Bayam", qty: 40, satuan: "ikat", konversi: "" },
        { id: 4, kdtransferstok: 4, tgl: "2025-03-16", kduser: 3, namauser: "User 3", dari: 0, namadari: "Gudang", tujuan: 3, namatujuan: "Cabang 3", kdbahanbaku: 5, namabahanbaku: "Biji Kopi", qty: 5, satuan: "karung", konversi: "200 kg" },
        { id: 5, kdtransferstok: 5, tgl: "2025-03-19", kduser: 1, namauser: "User 1", dari: 5, namadari: "Cabang 5", tujuan: 0, namatujuan: "Gudang", kdbahanbaku: 3, namabahanbaku: "Sirup", qty: 16, satuan: "botol", konversi: "1600 ml" },
        { id: 6, kdtransferstok: 6, tgl: "2025-03-20", kduser: 4, namauser: "User 4", dari: 0, namadari: "Gudang", tujuan: 4, namatujuan: "Cabang 4", kdbahanbaku: 2, namabahanbaku: "Gula", qty: 51, satuan: "kg", konversi: "" },
        { id: 7, kdtransferstok: 7, tgl: "2025-03-28", kduser: 6, namauser: "User 6", dari: 2, namadari: "Cabang 2", tujuan: 5, namatujuan: "Cabang 5", kdbahanbaku: 6, namabahanbaku: "Keju", qty: 37, satuan: "kotak", konversi: "" },
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
            <h2>Transfer Stok <small className="fs-5">(Nama lokasi cabang)</small></h2>

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
                            <th className="col-tgl" onClick={() => sortTable("tgl")} style={{ cursor: "pointer" }}>
                                {sortColumn === "tgl" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Tgl. Transfer
                            </th>
                            <th onClick={() => sortTable("namauser")} style={{ cursor: "pointer" }}>
                                {sortColumn === "namauser" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Diinput Oleh
                            </th>
                            <th onClick={() => sortTable("dari")} style={{ cursor: "pointer" }}>
                                {sortColumn === "dari" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Dari
                            </th>
                            <th onClick={() => sortTable("tujuan")} style={{ cursor: "pointer" }}>
                                {sortColumn === "tujuan" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Tujuan
                            </th>
                            <th onClick={() => sortTable("nama")} style={{ cursor: "pointer" }}>
                                {sortColumn === "nama" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i> // Ikon ascending
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending 
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Nama Bahan Baku
                            </th>
                            <th>Qty</th>
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
                                <td className="text-center">{new Date(item.tgl).toISOString().split("T")[0].split("-").reverse().join("-")}</td>
                                <td>{item.namauser}</td>
                                <td className="text-center">{item.namadari}</td>
                                <td className="text-center">{item.namatujuan}</td>
                                <td>{item.namabahanbaku}</td>
                                <td className="text-center">{item.qty + ` ${item.satuan} ${item.konversi ? `(${item.konversi})` : ``}`}</td>
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
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Formulir Transfer Stok</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={isSubmitting}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="kdrecheckstok" value={formData.kdrecheckstok} />

                                    <div className="col-4 mb-3">
                                        <label className="form-label">Tanggal</label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.tgl ? "is-invalid" : ""}`}
                                            name="nama"
                                            value={formData.tgl}
                                            onChange={handleChange}
                                            onFocus={(e) => e.target.showPicker()}
                                            placeholder="Masukkan tanggal input"
                                            readOnly
                                        />
                                        {errors.tgl && <div className="invalid-feedback">{errors.tgl}</div>}
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <label className="form-label">Dari</label>
                                            <select
                                                className={`form-select ${errors.dari ? "is-invalid" : ""}`}
                                                name="dari"
                                                value={formData.dari}
                                                onChange={handleChange}
                                            >
                                                <option value="">-- Pilih Cabang --</option>
                                                {cabang.map((cabangcafe, index) => (
                                                    <option key={index} value={cabangcafe.kdcabang}>
                                                        {cabangcafe.nama}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.dari && <div className="invalid-feedback">{errors.dari}</div>}
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Tujuan</label>
                                            <select
                                                className={`form-select ${errors.tujuan ? "is-invalid" : ""}`}
                                                name="tujuan"
                                                value={formData.tujuan}
                                                onChange={handleChange}
                                            >
                                                <option value="">-- Pilih Cabang --</option>
                                                {cabang.map((cabangcafe, index) => (
                                                    <option key={index} value={cabangcafe.kdcabang}>
                                                        {cabangcafe.nama}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.tujuan && <div className="invalid-feedback">{errors.tujuan}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Bahan Baku</label>
                                        <select
                                            className={`form-select ${errors.kdbahanbaku ? "is-invalid" : ""}`}
                                            name="kdbahanbaku"
                                            value={formData.kdbahanbaku}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- Pilih Bahan Baku --</option>
                                            {bahanbaku.map((barang, index) => (
                                                <option key={index} value={barang.kdbahanbaku}>
                                                    {barang.nama}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.kdbahanbaku && <div className="invalid-feedback">{errors.kdbahanbaku}</div>}
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-4">
                                            <label className="form-label">Qty Check</label>
                                            <input
                                                type="number"
                                                className={`form-control ${errors.qty ? "is-invalid" : ""}`}
                                                name="qty"
                                                value={formData.qty}
                                                onChange={handleChange}
                                                placeholder="Masukkan qty"
                                                autoComplete="off"
                                                step="any"
                                            />
                                            {errors.qty && <div className="invalid-feedback">{errors.qty}</div>}
                                        </div>
                                        <div className="col-8">
                                            <label className="form-label">Satuan</label>
                                            <select
                                                className={`form-select ${errors.satuan ? "is-invalid" : ""}`}
                                                name="satuan"
                                                value={formData.satuan}
                                                onChange={handleChange}
                                                disabled={satuanOptions.length === 0} // Disabled jika belum pilih bahan baku
                                            >
                                                <option value="">-- Pilih Satuan --</option>
                                                {satuanOptions.map((satuan, index) => (
                                                    <option key={index} value={satuan}>{satuan}</option>
                                                ))}
                                            </select>
                                            {errors.satuan && <div className="invalid-feedback">{errors.satuan}</div>}
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
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
            )}

            {/* Overlay untuk modal */}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div >
    );
};

export default Transferstok;
