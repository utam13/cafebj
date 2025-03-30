import React, { useState } from "react";

const Profile = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        kduser: 1,
        nama: "User 1",
        jk: "Laki-laki",
        email: "user1@gmail.com",
        password: "1234567890",
        lokasikerja: 2,
        namalokasi: "Cabang 2",
    });

    const [errors, setErrors] = useState({});

    // Toggle visibility password
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
        if (!formData.nama) newErrors.nama = "Nama Anda harus diisi!";
        if (!formData.jk) newErrors.jk = "Gender Anda harus diisi!";
        if (!formData.email) newErrors.email = "Email Anda harus diisi!";
        if (!formData.password) newErrors.password = "Password Anda harus diisi!";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // True jika tidak ada error
    };

    // Handle submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);

            // Mode Edit: Perbarui data berdasarkan ID
            // setData(data.map((item) => (item.kduser === editId ? { ...formData, kduser: editId } : item)));

            setTimeout(() => { // Simulasi loading sebentar
                alert("Data berhasil disimpan!");
                setIsSubmitting(false); // Reset status submit
                setFormData({
                    kduser: 1,
                    nama: "User 1",
                    jk: "Laki-laki",
                    email: "user1@gmail.com",
                    password: "1234567890",
                    lokasikerja: 2,
                    namalokasi: "Cabang 2",
                }); // Reset form
            }, 500);
        }
    };

    const handleReset = () => {
        setErrors({});
        setIsSubmitting(false); // Reset status submit
        setFormData({
            kduser: 1,
            nama: "User 1",
            jk: "Laki-laki",
            email: "user1@gmail.com",
            password: "1234567890",
            lokasikerja: 2,
            namalokasi: "Cabang 2",
        })
    }

    return (
        <div className="content">
            <h2>Profile User</h2>
            <div className="row mt-4">
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="kduser" value={formData.kduser} />
                    <div className="col-lg-3">
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
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
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
                            <input
                                type="text"
                                className={`form-control ${errors.namalokasi ? "is-invalid" : ""}`}
                                name="lokasikerja"
                                value={formData.namalokasi}
                                onChange={handleChange}
                                disabled
                            />
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

export default Profile;
