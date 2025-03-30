import React, { useState } from "react";
import useDragScroll from "../hooks/useDragScroll"; // Import hook
import useNumberFormat from "../hooks/useNumberFormat";

const Penjualan = () => {
    const tableRef = useDragScroll(); // Pakai hook
    const [editId, setEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewModal, setPreviewModal] = useState(null);
    const [validUrl, setValidUrl] = useState("");
    const { formatNumber, parseNumber } = useNumberFormat();
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        kdpenjualan: "",
        tgl: today,
        kdcabang: "",
        kduser: "",
        omset: "",
        totalhpp: "",
        dokumen: "",
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

    // Handle perubahan input
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        let newValue = value;

        if (name === "omset" || name === "totalhpp") {
            newValue = formatNumber(value, e); // Kirim event ke formatNumber
        }

        if (name === "dokumen" && files.length > 0) {
            const selectedFile = files[0];
            setFormData({ ...formData, dokumen: selectedFile });
            setPreviewFile(selectedFile);

            // Preview file convert to image based64 
            const reader = new FileReader();
            reader.onload = () => setFile(reader.result);
            reader.readAsDataURL(selectedFile);
        } else {
            setFormData({ ...formData, [name]: newValue });
        }

        setErrors({ ...errors, [e.target.name]: "" }); // Hapus error setelah diisi
    };

    // Handle tombol Preview di tabel
    const handlePreview = (fileUrl) => {
        if (!fileUrl) {
            setValidUrl("src/assets/img/no-image.png"); // Jika URL kosong, tampilkan gambar default
            setPreviewModal("src/assets/img/no-image.png");
            return;
        }

        // Cek apakah fileUrl berbentuk Base64 atau URL normal
        if (fileUrl.startsWith("data:image") || fileUrl.startsWith("data:application")) {
            // Konversi Base64 ke Blob
            const byteString = atob(fileUrl.split(",")[1]); // Ambil data base64
            const mimeType = fileUrl.split(",")[0].split(":")[1].split(";")[0]; // Ambil mime type
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const uintArray = new Uint8Array(arrayBuffer);

            for (let i = 0; i < byteString.length; i++) {
                uintArray[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([uintArray], { type: mimeType });
            const blobUrl = URL.createObjectURL(blob);

            // Jika Base64, langsung set preview tanpa fetch
            setValidUrl(blobUrl);
            setPreviewModal(blobUrl);
        } else {
            fetch(fileUrl, { method: "HEAD" }) // Cek apakah file ada
                .then((res) => {
                    if (res.ok) {
                        setValidUrl(fileUrl); // Jika file ada, gunakan file aslinya
                        setPreviewModal(fileUrl);
                    } else {
                        setValidUrl("src/assets/img/no-image.png"); // Jika 404, gunakan no-image.png
                        setPreviewModal("src/assets/img/no-image.png");
                    }
                })
                .catch(() => {
                    setValidUrl("src/assets/img/no-image.png"); // Jika error, gunakan no-image.png
                    setPreviewModal("src/assets/img/no-image.png");
                });
        }
    };

    // Validasi form
    const validateForm = () => {
        let newErrors = {};
        if (!formData.tgl) newErrors.tgl = "Tanggal harus diisi!";
        if (!formData.kdcabang) newErrors.kdcabang = "Cabang harus diisi!";
        if (!formData.omset) newErrors.omset = "Total Penjualan harus diisi!";
        if (!formData.totalhpp) newErrors.totalhpp = "Total HPP harus diisi!";
        if (!formData.dokumen) newErrors.dokumen = "Dokumen harus diisi!";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // True jika tidak ada error
    };

    // Handle submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);

            // Parsing angka sebelum menyimpan
            const parsedFormData = {
                ...formData,
                omset: parseNumber(formData.omset),
                totalhpp: parseNumber(formData.totalhpp),
            };

            // Hitung laba kotor (Omset - Total HPP)
            const labakotor = parsedFormData.omset - parsedFormData.totalhpp;

            // Tambahkan laba kotor ke data yang akan disimpan
            const finalFormData = {
                ...parsedFormData,
                labakotor, // Tambahkan laba kotor
            };


            if (editId !== null) {
                // Mode Edit: Perbarui data berdasarkan ID
                setData(data.map((item) => (item.id === editId ? { ...finalFormData, id: editId } : item)));
            } else {
                // Mode Tambah: Tambahkan data baru dengan ID baru
                setData([...data, { ...finalFormData, id: data.length + 1 }]);
            }

            setTimeout(() => { // Simulasi loading sebentar
                alert("Data berhasil disimpan!");
                setShowModal(false); // Tutup modal setelah submit
                setEditId(null);
                setIsSubmitting(false); // Reset status submit
                setFormData({ kdpenjualan: "", tgl: today, kdcabang: "", omset: "", totahpp: "", dokumen: "" }); // Reset form
            }, 500);
        }
    };

    // Handle tombol Edit
    const handleEdit = (id) => {
        const item = data.find((d) => d.id === id);
        if (!item) return;

        setFormData({
            kdpenjualan: item.kdpenjualan,
            tgl: item.tgl, // Mengisi tanggal
            kdcabang: item.kdcabang,
            kduser: item.kduser,
            omset: item.omset.toLocaleString(),
            totalhpp: item.totalhpp.toLocaleString(),
            dokumen: item.dokumen,
        });

        // Cek apakah dokumen ada
        if (item.dokumen) {
            setPreviewFile(`/storage/omset/${data.dokumen}`);
        } else {
            setPreviewFile(null);
        }

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
        setFormData({ kdpenjualan: "", kduser: "", tgl: today, kdcabang: "", omset: "", totahpp: "", dokumen: "" }); // Kosongkan form
        setPreviewFile(null);
        setErrors({}); // Reset error
        setShowModal(true); // Tampilkan modal
    };

    const [data, setData] = useState([
        { id: 1, kdpenjualan: 1, kduser: 2, namauser: "User 2", tgl: "2025-02-01", kdcabang: 1, nama: "Cabang 1", omset: 200000, totalhpp: 100000, labakotor: 100000, dokumen: "https://hostme.web.id/cafebj/upload/omset_01022025.pdf" },
        { id: 2, kdpenjualan: 2, kduser: 2, namauser: "User 2", tgl: "2025-02-04", kdcabang: 2, nama: "Cabang 2", omset: 400000, totalhpp: 300000, labakotor: 100000, dokumen: "https://hostme.web.id/cafebj/upload/omset_04022025.pdf" },
        { id: 3, kdpenjualan: 3, kduser: 1, namauser: "User 1", tgl: "2025-02-10", kdcabang: 3, nama: "Cabang 3", omset: 600000, totalhpp: 400000, labakotor: 200000, dokumen: "https://hostme.web.id/cafebj/upload/omset_10022025.png" },
        { id: 4, kdpenjualan: 4, kduser: 1, namauser: "User 1", tgl: "2025-03-16", kdcabang: 4, nama: "Cabang 4", omset: 900000, totalhpp: 300000, labakotor: 600000, dokumen: "https://hostme.web.id/cafebj/upload/omset_16032025.pdf" },
        { id: 5, kdpenjualan: 5, kduser: 4, namauser: "User 4", tgl: "2025-03-19", kdcabang: 5, nama: "Cabang 5", omset: 400000, totalhpp: 200000, labakotor: 200000, dokumen: "https://hostme.web.id/cafebj/upload/omset_19032025.jpg" },
        { id: 6, kdpenjualan: 6, kduser: 3, namauser: "User 3", tgl: "2025-03-20", kdcabang: 6, nama: "Cabang 6", omset: 900000, totalhpp: 100000, labakotor: 800000, dokumen: "https://hostme.web.id/cafebj/upload/omset_20032025.pdf" },
        { id: 7, kdpenjualan: 7, kduser: 3, namauser: "User 3", tgl: "2025-03-28", kdcabang: 7, nama: "Cabang 7", omset: 1000000, totalhpp: 300000, labakotor: 700000, dokumen: "https://hostme.web.id/cafebj/upload/omset_28032025.png" },
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
            <h2>Penjualan <small className="fs-5">(Nama lokasi cabang)</small></h2>

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
                                        <i className="fa fa-sort-up"></i> // Ikon ascending (🔼)
                                    ) : (
                                        <i className="fa fa-sort-down"></i> // Ikon descending (🔽)
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i> // Default ikon (⬍)
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
                                )} Tgl. Pelaporan
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
                            <th onClick={() => sortTable("nama")} style={{ cursor: "pointer" }}>
                                {sortColumn === "nama" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Cabang
                            </th>
                            <th onClick={() => sortTable("omset")} style={{ cursor: "pointer" }}>
                                {sortColumn === "omset" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Omset (Total Penjualan)
                            </th>
                            <th onClick={() => sortTable("totalhpp")} style={{ cursor: "pointer" }}>
                                {sortColumn === "totalhpp" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Total HPP
                            </th>
                            <th onClick={() => sortTable("labakotor")} style={{ cursor: "pointer" }}>
                                {sortColumn === "labakotor" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Laba Kotor
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {currentData.map((item) => (
                            <tr key={item.id}>
                                <td className="text-center">{item.id}</td>
                                <td className="text-center">
                                    {/* Tombol Lihat Dokumen */}
                                    <button className="btn btn-info btn-xs me-1" onClick={() => handlePreview(item.dokumen)}>
                                        <i className="fa fa-image"></i>
                                    </button>
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
                                <td>{item.nama}</td>
                                <td className="text-right">{item.omset.toLocaleString()}</td>
                                <td className="text-right">{item.totalhpp.toLocaleString()}</td>
                                <td className="text-right">{item.labakotor.toLocaleString()}</td>
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
                                <h5 className="modal-title">Formulir Penjualan</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} disabled={isSubmitting}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="kdpenjualan" value={formData.kdpenjualan} />
                                    <input type="hidden" name="kduser" value={formData.kduser} />

                                    <div className="row mb-3">
                                        <div className="col-4">
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
                                        <div className="col-8">
                                            <label className="form-label">Cabang</label>
                                            <select
                                                className={`form-select ${errors.kdcabang ? "is-invalid" : ""}`}
                                                name="kdcabang"
                                                value={formData.kdcabang}
                                                onChange={handleChange}
                                            >
                                                <option value="">-- Pilih Cabang --</option>
                                                {cabang.map((cabangcafe, index) => (
                                                    <option key={index} value={cabangcafe.kdcabang}>
                                                        {cabangcafe.nama}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.kdcabang && <div className="invalid-feedback">{errors.kdcabang}</div>}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <label className="form-label">Omset <code className="fs-8">(Total Penjualan)</code></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.omset ? "is-invalid" : ""}`}
                                                name="omset"
                                                value={formData.omset}
                                                onChange={handleChange}
                                                placeholder="Masukkan omset"
                                                autoComplete="off"
                                                step="any"
                                            />
                                            {errors.omset && <div className="invalid-feedback">{errors.omset}</div>}
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Tota HPP <code className="fs-8">(Total HPP terjual)</code></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.totalhpp ? "is-invalid" : ""}`}
                                                name="totalhpp"
                                                value={formData.totalhpp}
                                                onChange={handleChange}
                                                placeholder="Masukkan total hpp"
                                                autoComplete="off"
                                                step="any"
                                            />
                                            {errors.totalhpp && <div className="invalid-feedback">{errors.totalhpp}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Dokumen (PDF/Image)</label>
                                        <div className="input-group">
                                            {file && (
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    onClick={() => handlePreview(file)}
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>
                                            )}

                                            {/* Input Text (Menampilkan nama file yang dipilih) */}
                                            <input
                                                type="text"
                                                className={`form-control ${errors.dokumen ? "is-invalid" : ""}`}
                                                placeholder="Pilih file..."
                                                value={previewFile ? previewFile.name : formData.dokumen}
                                                readOnly
                                            />

                                            {/* Input File (Disembunyikan) */}
                                            <input
                                                type="file"
                                                name="dokumen"
                                                accept=".pdf, .png, .jpg, .jpeg"
                                                id="fileInput"
                                                onChange={handleChange}
                                                style={{ display: "none" }} // Sembunyikan input file
                                            />

                                            {/* Tombol Upload (Trigger Input File) */}
                                            <button
                                                className="btn btn-outline-primary"
                                                type="button"
                                                onClick={() => document.getElementById("fileInput").click()}
                                            >
                                                <i className="fa-solid fa-upload"></i>
                                            </button>

                                            {errors.dokumen && <div className="invalid-feedback">{errors.dokumen}</div>}
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

            {/* Modal Preview */}
            {previewModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Preview Dokumen</h5>
                                <button type="button" className="btn-close" onClick={() => setPreviewModal(null)}></button>
                            </div>
                            <div className="modal-body text-center">
                                {validUrl.endsWith(".pdf") ? (
                                    <embed src={validUrl} type="application/pdf" width="100%" height="500px" />
                                ) : (
                                    <img src={validUrl} alt="Preview" className="img-fluid img-preview" />
                                )}
                            </div>
                            <div className="modal-footer d-flex flex-row justify-content-between">
                                <button type="button" className="btn btn-secondary" onClick={() => setPreviewModal(null)}>
                                    Tutup
                                </button>

                                <a href={validUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    Buka di Tab Baru
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay untuk modal */}
            {showModal && <div className="modal-backdrop fade show"></div>}
        </div >
    );
};

export default Penjualan;
