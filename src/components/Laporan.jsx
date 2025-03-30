import React, { useState } from "react";

const Laporan = () => {
    const today = new Date().toISOString().split('T')[0];
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        kdcabang: "",
        dari: today,
        sampai: today,
        laporan: "",
        jenisdok: "",
    });

    const [errors, setErrors] = useState({});

    // cabang
    const cabang = [
        { kdcabang: 1, nama: "Cabang 1" },
        { kdcabang: 2, nama: "Cabang 2" },
        { kdcabang: 3, nama: "Cabang 3" },
        { kdcabang: 4, nama: "Cabang 4" },
        { kdcabang: 5, nama: "Cabang 5" },
        { kdcabang: 6, nama: "Cabang 6" },
    ]

    // Handle perubahan input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [e.target.name]: "" }); // Hapus error setelah diisi
    };

    // Validasi form
    const validateForm = () => {
        let newErrors = {};
        if (!formData.kdcabang) newErrors.kdcabang = "Nama cabang harus diisi!";
        if (!formData.dari) newErrors.dari = "Tanggal mulai laporan harus diisi!";
        if (!formData.sampai) newErrors.sampai = "Tanggal akhir laporan harus diisi!";
        if (!formData.laporan) newErrors.laporan = "Jenis laporan harus diisi!";
        if (!formData.jenisdok) newErrors.jenisdok = "Jenis dokumen laporan harus diisi!";

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
                setIsSubmitting(false); // Reset status submit
                setFormData({
                    kdcabang: "",
                    dari: today,
                    sampai: today,
                    laporan: "",
                    jenisdok: "",
                }); // Reset form
            }, 500);
        }
    };

    const handleReset = () => {
        setErrors({});
        setIsSubmitting(false); // Reset status submit
        setFormData({
            kdcabang: "",
            dari: today,
            sampai: today,
            laporan: "",
            jenisdok: "",
        })
    }

    return (
        <div className="content">
            <h2>Laporan <small className="fs-5">(Nama lokasi cabang)</small></h2>
            <div className="row mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="col-lg-4">
                        <div className="mb-3">
                            <label className="form-label">Cabang</label>
                            <select
                                className={`form-select ${errors.kdcabang ? "is-invalid" : ""}`}
                                name="kdcabang"
                                value={formData.kdcabang}
                                onChange={handleChange}
                            >
                                <option value="">-- Pilih Cabang--</option>
                                <option value="0">Gudang</option>
                                {cabang.map((cabangcafe, index) => (
                                    <option key={index} value={cabangcafe.kdcabang}>
                                        {cabangcafe.nama}
                                    </option>
                                ))}
                            </select>
                            {errors.kdcabang && <div className="invalid-feedback">{errors.kdcabang}</div>}
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Dari Tanggal</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.dari ? "is-invalid" : ""}`}
                                    name="dari"
                                    value={formData.dari ? formData.dari : today}
                                    onChange={handleChange}
                                    onFocus={(e) => e.target.showPicker()}
                                    placeholder="Masukkan tanggal transaksi"
                                    autoComplete="off"
                                />
                                {errors.dari && <div className="invalid-feedback">{errors.dari}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Sampai Tanggal</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.sampai ? "is-invalid" : ""}`}
                                    name="sampai"
                                    value={formData.sampai ? formData.sampai : today}
                                    onChange={handleChange}
                                    onFocus={(e) => e.target.showPicker()}
                                    placeholder="Masukkan tanggal transaksi"
                                    autoComplete="off"
                                />
                                {errors.sampai && <div className="invalid-feedback">{errors.sampai}</div>}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Laporan</label>
                            <select
                                className={`form-select ${errors.laporan ? "is-invalid" : ""}`}
                                name="laporan"
                                value={formData.laporan}
                                onChange={handleChange}
                            >
                                <option value="">-- Pilih Laporan--</option>
                                <option value="penjualan">Laporan Penjualan</option>
                                <option value="pengeluaran">Laporan Pengeluaran</option>
                                <option value="labarugi">Laporan Laba Rugi</option>
                                <option value="perbaikanstok">Laporan Perbaikan Stok</option>
                                <option value="recheckstok">Laporan Recheck Stok</option>
                                <option value="transferstok">Laporan Transfer Stok</option>
                            </select>
                            {errors.laporan && <div className="invalid-feedback">{errors.laporan}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Jenis Dokumen</label>
                            <select
                                className={`form-select ${errors.jenisdok ? "is-invalid" : ""}`}
                                name="jenisdok"
                                value={formData.jenisdok}
                                onChange={handleChange}
                            >
                                <option value="">-- Pilih Jenis Dokumen--</option>
                                <option value="pdf">PDF Dokumen</option>
                                <option value="xlsx">Excel File Dokumen</option>
                            </select>
                            {errors.jenisdok && <div className="invalid-feedback">{errors.jenisdok}</div>}
                        </div>
                        <div className="modal-footer d-flex flex-row justify-content-between">
                            <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={isSubmitting}>
                                Reset
                            </button>
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Memproses laporan..." : "Proses"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div >
    );
};

export default Laporan;
