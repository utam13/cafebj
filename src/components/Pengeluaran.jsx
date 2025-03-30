import React, { useState, useRef } from "react";
import useDragScroll from "../hooks/useDragScroll"; // Import hook
import useNumberFormat from "../hooks/useNumberFormat";

const Pengeluaran = () => {
    const tableRef = useDragScroll(); // Pakai hook

    const [showModal, setShowModal] = useState(false);
    const [showDetailPengeluaran, setShowDetailPengeluaran] = useState(false);
    const [showBayar, setShowBayar] = useState(false);
    const [showFormulirBayar, setShowFormulirBayar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showBahanBaku, setShowBahanBaku] = useState(false);
    const [showTeksDetail, setShowTeksDetail] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmittingDetail, setIsSubmittingDetail] = useState(false);
    const [isSubmittingBayar, setIsSubmittingBayar] = useState(false);
    const [file, setFile] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewModal, setPreviewModal] = useState(null);
    const [validUrl, setValidUrl] = useState("");
    const { formatNumber, parseNumber } = useNumberFormat();
    const [satuanOptions, setSatuanOptions] = useState([]);

    const today = new Date().toISOString().split('T')[0];

    const fileInputRef = useRef(null);

    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        kdpengeluaran: "",
        kdcabang: "",
        tgl: today,
        jenistrans: "", // tunai atau utang
        tgljatuhtempo: "",
        tglbayar: "",
        nomortrans: "", // nomor nota/invoice/kwitansi (jika tidak ada berikan nomor sendiri)
        lokasitrans: "", // nama toko/pasar/agen/distributor
        grandtotal: 0,
        terbayar: 0,
        sisa: 0,
        dokumentrans: "",
    });

    const [editIdDetail, setEditIdDetail] = useState(null);
    const [dataListDetail, setDataListDetail] = useState([]);
    const [formDetail, setFormDetail] = useState({
        kdpengeluaran: "",
        kategoripengeluaran: "",
        kdbahanbaku: "",
        deskripsi: "",
        qty: 0,
        satuan: "",
        total: 0,
    });

    const [editIdBayar, setEditIdBayar] = useState(null);
    const [dataListBayar, setDataListBayar] = useState([]);
    const [formBayar, setFormBayar] = useState({
        kdpengeluaran: "",
        kdbayar: "",
        tglbayar: today,
        sisa: 0,
        nominal: 0,
        metodebayar: "", //transfer, tunai, qris
        dokumenbayar: "",
    });

    const [errors, setErrors] = useState({});

    const kategoriList = [
        "Bar",
        "Dapur",
        "Air",
        "Gaji",
        "Lemburan",
        "Listrik",
        "Maintenance",
        "Lain-lain"
    ]

    // cabang
    const cabang = [
        { kdcabang: 0, nama: "Gudang" },
        { kdcabang: 1, nama: "Cabang 1" },
        { kdcabang: 2, nama: "Cabang 2" },
        { kdcabang: 3, nama: "Cabang 3" },
        { kdcabang: 4, nama: "Cabang 4" },
        { kdcabang: 5, nama: "Cabang 5" },
        { kdcabang: 6, nama: "Cabang 6" },
    ]

    const bahanbaku = [
        { kdbahanbaku: 1, nama: "Tepung Beras", satuan: "kg", konversi: "gram" },
        { kdbahanbaku: 2, nama: "Gula", satuan: "kg", konversi: "gram" },
        { kdbahanbaku: 3, nama: "Sirup", satuan: "botol", konversi: "ml" },
        { kdbahanbaku: 4, nama: "Bayam", satuan: "ikat", konversi: "gram" },
        { kdbahanbaku: 5, nama: "Biji Kopi", satuan: "karung", konversi: "kg" },
        { kdbahanbaku: 6, nama: "Keju", satuan: "kotak", konversi: "gram" },
        { kdbahanbaku: 7, nama: "Krimer", satuan: "botol", konversi: "gram" },
    ]

    // Handle perubahan input form induk
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        let newValue = value?.trim() || "";

        if (name === "grandtotal") {
            newValue = formatNumber(value, e); // Kirim event ke formatNumber
        }

        if (name === "dokumentrans" && files.length > 0) {
            if (files.length > 0) {
                const selectedFile = files[0];

                setFormData({ ...formData, dokumentrans: selectedFile });
                setPreviewFile(selectedFile);

                // Preview file convert to image based64 
                const reader = new FileReader();
                reader.onload = () => setFile(reader.result);
                reader.readAsDataURL(selectedFile);
            } else {
                // Jika file dihapus, hapus juga preview
                setFormData({ ...formData, dokumentrans: null });
                setFile(null);
            }
        } else {
            setFormData({ ...formData, [name]: newValue });
        }

        setErrors({ ...errors, [e.target.name]: "" }); // Hapus error setelah diisi
    };

    // Validasi form
    const validateForm = () => {
        let newErrors = {};
        if (!formData.kdcabang) newErrors.kdcabang = "Cabang harus diisi!";
        if (!formData.jenistrans) newErrors.jenistrans = "Jenis transaksi harus diisi!";
        if (!formData.tgl) newErrors.tgl = "Tgl. transaksi harus diisi!";
        if (!formData.nomortrans) newErrors.nomortrans = "Nomor transaksi harus diisi!";
        if (!formData.lokasitrans) newErrors.lokasitrans = "Lokasi transaksi/distributor harus diisi!";
        if (!formData.grandtotal) newErrors.grandtotal = "Grand total harus diisi!";
        if (!formData.dokumentrans) newErrors.dokumentrans = "Dokumen bukti transaksi harus diisi!";

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
                grandtotal: parseNumber(formData.grandtotal),
            };

            if (editId !== null) {
                // Mode Edit: Perbarui data berdasarkan ID
                setData(data.map((item) => (item.id === editId ? { ...parsedFormData, id: editId } : item)));
            } else {
                // Mode Tambah: Tambahkan data baru dengan ID baru
                setData([...data, { ...parsedFormData, id: data.length + 1 }]);
            }

            setTimeout(() => { // Simulasi loading sebentar
                alert("Data berhasil disimpan!");
                setShowModal(false); // Tutup modal setelah submit
                setEditId(null);
                setIsSubmitting(false); // Reset status submit
                setFormData({
                    kdpengeluaran: "",
                    kdcabang: "",
                    tgl: "",
                    jenistrans: "",
                    tgljatuhtempo: "",
                    tglbayar: "",
                    nomortrans: "",
                    lokasitrans: "",
                    grandtotal: 0,
                    dokumentrans: "",
                }); // Reset form

                setFile(null);
                setPreviewFile(null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Kosongkan input file secara langsung
                }
            }, 500);
        }
    };

    // Handle tombol Edit
    const handleEdit = (id) => {
        const item = data.find((d) => d.id === id);
        if (!item) return;

        setFormData({
            kdpengeluaran: item.kdpengeluaran,
            kdcabang: item.kdcabang,
            tgl: item.tgl,
            jenistrans: item.jenistrans,
            tgljatuhtempo: item.tgljatuhtempo,
            tglbayar: item.tglbayar,
            nomortrans: item.nomortrans,
            lokasitrans: item.lokasitrans,
            grandtotal: item.grandtotal.toLocaleString(),
            terbayar: item.terbayar.toLocaleString(),
            sisa: item.sisa.toLocaleString(),
            dokumentrans: item.dokumentrans,
        });

        // Set data detail pengeluaran (jika ada)
        setDataListDetail(item.detailpengeluaran || []);

        // Cek apakah dokumen ada
        if (item.dokumentrans) {
            setFile(`/storage/omset/${data.dokumentrans}`);
        } else {
            setFile(null);
        }

        setErrors({});
        setEditId(id);
        setShowModal(true);
    };

    // Handle tombol Hapus
    const handleDelete = (id) => {
        const item = data.find((d) => d.id === id); // Cari item berdasarkan ID
        if (!item) return; // Jika tidak ditemukan, hentikan fungsi

        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus pengeluaran dengan nomor "${item.nomortrans}"?`);

        // if (confirmDelete) {
        //     setData(data.filter((d) => d.id !== id));
        //     alert(`Pengeluaran dengan nomor "${item.nomortrans}" telah dihapus.`);
        // }
    };

    // Handle buka modal (reset inputan)
    const handleOpenModal = () => {
        setFormData({ kdpengeluaran: "", kdcabang: "", jenistrans: "", tgl: "", tgljatuhtempo: "", nomortrans: "", lokasitrans: "", grandtotal: 0, dokumentrans: "" }); // Kosongkan form
        setFile(null);
        setPreviewFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Kosongkan input file secara langsung
        }

        setErrors({}); // Reset error
        setShowModal(true); // Tampilkan modal
    };

    // Handle perubahan input form detail
    const handleChangeDetail = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (name === "qty" || name === "total") {
            newValue = formatNumber(value, e); // Kirim event ke formatNumber
        }

        // Cek jika kategori pengeluaran dipilih
        if (name === "kategoripengeluaran") {
            switch (value) {
                case "Dapur":
                case "Bar":
                    setShowBahanBaku(true); // Menampilkan Bahan Baku
                    setShowTeksDetail(false);
                    break;
                case "Listrik":
                case "Air":
                    setShowBahanBaku(false); // Menampilkan Bahan Baku
                    setShowTeksDetail(false);
                    break;
                default:
                    setShowBahanBaku(false); // Menampilkan Beban
                    setShowTeksDetail(true);
                    break;
            }
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

        setFormDetail({ ...formDetail, [name]: newValue });

        setErrors({ ...errors, [e.target.name]: "" }); // Hapus error setelah diisi
    };

    // Validasi form Detail
    const validateFormDetail = () => {
        let newErrors = {};

        // Validasi kategori pengeluaran
        if (!formDetail.kategoripengeluaran?.trim()) {
            newErrors.kategoripengeluaran = "Kategori pengeluaran harus diisi!";
        }

        switch (formDetail.kategoripengeluaran) {
            case "Dapur":
            case "Bar":
                if (!formDetail.kdbahanbaku) newErrors.kdbahanbaku = "Bahan Baku harus diisi!";
                if (!formDetail.qty || parseNumber(formDetail.qty) == 0) newErrors.qty = "Qty harus diisi!";
                if (!formDetail.satuan) newErrors.satuan = "Satuan harus diisi!";
                break;
            case "Listrik":
            case "Air":
                if (!formDetail.deskripsi) newErrors.deskripsi = "Deskripsi harus diisi!";
                break;
        }

        // Validasi total
        if (!formDetail.total || parseFloat(formDetail.total) <= 0) {
            newErrors.total = "Total harus lebih dari 0!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // True jika tidak ada error
    };

    // Handle submit Detail form
    const handleSubmitDetail = (e) => {
        e.preventDefault();
        if (validateFormDetail()) {
            setIsSubmittingDetail(true);

            // Parsing angka sebelum menyimpan
            const parsedFormData = {
                ...formDetail,
                qty: parseNumber(formDetail.qty),
                total: parseNumber(formDetail.total),
            };

            if (editIdDetail !== null) {
                // Mode Edit: Perbarui data berdasarkan ID
                setData(dataListDetail.map((item) => (item.kddetailpengeluaran === editIdDetail ? { ...parsedFormData, kddetailpengeluaran: editIdDetail } : item)));
            } else {
                // Mode Tambah: Tambahkan data baru dengan ID baru
                setData([...data, { ...parsedFormData, kddetailpengeluaran: dataListDetail.length + 1 }]);
            }

            setTimeout(() => { // Simulasi loading sebentar
                alert("Data berhasil disimpan!");
                setShowModal(false); // Tutup modal setelah submit
                setEditId(null);
                setIsSubmittingDetail(false); // Reset status submit
                setFormDetail({ kdpengeluaran: formDetail.kdpengeluaran, kdbahanbaku: "", kdbeban: "", deskripsi: "", qty: 0, satuan: "", total: 0 }); // Reset form
            }, 500);
        }
    };

    // Handle tombol Edit Detail
    const handleEditDetail = (kddetailpengeluaran) => {
        const item = dataListDetail.find((d) => d.kddetailpengeluaran === kddetailpengeluaran);
        setFormDetail({
            kdpengeluaran: item.kdpengeluaran,
            kddetailpengeluaran: item.kddetailpengeluaran,
            kategoripengeluaran: item.kategoripengeluaran,
            kdbahanbaku: item.kdbahanbaku,
            deskripsi: item.deskripsi,
            qty: item.qty.toLocaleString(),
            satuan: item.satuan,
            total: item.total.toLocaleString(),
        });

        // Cari bahan baku yang sesuai
        const bahan = bahanbaku.find((b) => b.kdbahanbaku === item.kdbahanbaku);

        if (bahan) {
            setSatuanOptions([bahan.satuan, bahan.konversi].filter(Boolean));
        } else {
            setSatuanOptions([]); // Reset jika tidak ada bahan baku yang dipilih
        }

        switch (item.kategoripengeluaran) {
            case "Dapur":
            case "Bar":
                setShowBahanBaku(true); // Menampilkan Bahan Baku
                setShowTeksDetail(false);
                break;
            case "Listrik":
            case "Air":
                setShowBahanBaku(false); // Menampilkan Bahan Baku
                setShowTeksDetail(false);
                break;
            default:
                setShowBahanBaku(false); // Menampilkan Beban
                setShowTeksDetail(true);
                break;
        }

        setErrors({});
        setEditIdDetail(kddetailpengeluaran);
        setShowDetailPengeluaran(true);
    };

    // Handle tombol Hapus Detail
    const handleDeleteDetail = (kddetailpengeluaran) => {
        const item = dataListDetail.find((d) => d.kddetailpengeluaran === kddetailpengeluaran); // Cari item berdasarkan ID
        if (!item) return; // Jika tidak ditemukan, hentikan fungsi

        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus detail pengeluaran "${item.deskripsi}"?`);

        // if (confirmDelete) {
        //     setData(dataListDetail.filter((d) => d.id !== id));
        //     alert(`Detail pengeluaran "${item.deskripsi}" telah dihapus.`);
        // }
    };

    // Handle buka modal (reset inputan)
    const handleOpenModalDetail = (kdpengeluaran) => {
        setFormDetail({ kdpengeluaran: kdpengeluaran, kdbahanbaku: "", kdbeban: "", deskripsi: "", qty: 0, satuan: "", total: 0 });
        setErrors({}); // Reset error
        setShowBahanBaku(false); // Menampilkan Beban
        setShowTeksDetail(false);
        setShowDetailPengeluaran(true); // Tampilkan modal
    };


    // Handle buka modal (data bayar inputan)
    const [idPengeluaran, setIdPengeluaran] = useState(null);
    const handleBayar = (id) => {
        setIdPengeluaran(id);

        const item = data.find((d) => d.id === id);
        if (!item) return;

        //Set data detail pembayaran (jika ada)
        setDataListBayar(item.detailbayar || []);

        setShowBayar(true); // Tampilkan modal
    };

    // Handle buka modal (Formulir bayar inputan)
    const handleFormulirBayar = () => {
        if (!idPengeluaran) return;

        const item = data.find((d) => d.id === idPengeluaran);
        if (!item) return

        setFormBayar({ kdpengeluaran: item.kdpengeluaran, kdbayar: "", tglbayar: "", nominal: 0, qty: "", satuan: "", sisa: item.sisa, total: 0, dokumenbayar: "" });

        setFile(null);
        setPreviewFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Kosongkan input file secara langsung
        }

        setErrors({}); // Reset error
        setShowFormulirBayar(true); // Tampilkan modal
    };

    // Handle perubahan input form Bayar
    const handleChangeBayar = (e) => {
        const { name, value, files } = e.target;

        let newValue = value?.trim() || "";

        if (name === "nominal") {
            newValue = formatNumber(value, e);
        }

        console.log("Pilih file:" + files[0]);
        if (name === "dokumenbayar" && files?.length > 0) {
            if (files.length > 0) {
                const selectedFile = files[0];
                console.log("Pilih file:" + files[0]);
                setFormBayar({ ...formBayar, dokumenbayar: selectedFile });
                setPreviewFile(selectedFile);

                // Preview file convert to image based64 
                const reader = new FileReader();
                reader.onload = () => setFile(reader.result);
                reader.readAsDataURL(selectedFile);
            } else {
                // Jika file dihapus, hapus juga preview
                setFormBayar({ ...formBayar, dokumenbayar: null });
                setFile(null);
            }
        } else {
            setFormBayar({ ...formBayar, [name]: newValue });
        }

        setErrors({ ...errors, [e.target.name]: "" }); // Hapus error setelah diisi
    };

    // Validasi form Bayar
    const validateFormBayar = () => {
        let newErrors = {};

        if (!formBayar.tglbayar) newErrors.tglbayar = "Tanggal pembayaran harus diisi!";
        if (!formBayar.metodebayar) newErrors.metodebayar = "Metode pembayaran harus diisi!";
        if (!formBayar.dokumenbayar) newErrors.dokumenbayar = "Dokumen bukti pembayaran harus diisi!";

        // Pastikan nominal valid dan tidak melebihi sisa pembayaran
        const nominal = parseFloat(parseNumber(formBayar.nominal) || 0);
        const sisa = parseFloat(formBayar.sisa || 0);

        // Validasi nominal
        if (nominal <= 0) {
            newErrors.nominal = "Nominal harus lebih dari 0!";
        } else if (nominal > sisa) {
            newErrors.nominal = "Nominal tidak boleh melebihi sisa pembayaran!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // True jika tidak ada error
    };

    // Handle submit Bayar form
    const handleSubmitBayar = (e) => {
        e.preventDefault();
        if (validateFormBayar()) {
            setIsSubmittingBayar(true);

            // Parsing angka sebelum menyimpan
            const parsedFormData = {
                ...formBayar,
                nominal: parseNumber(formBayar.nominal),
            };

            if (editIdBayar !== null) {
                // Mode Edit: Perbarui data berdasarkan ID
                setData(dataListBayar.map((item) => (item.kdbayar === editIdBayar ? { ...parsedFormData, kdbayar: editIdBayar } : item)));
            } else {
                // Mode Tambah: Tambahkan data baru dengan ID baru
                setData([...data, { ...parsedFormData, kdbayar: dataBayar.length + 1 }]);
            }

            setTimeout(() => { // Simulasi loading sebentar
                alert("Data berhasil disimpan!");
                setShowModal(false); // Tutup modal setelah submit
                setEditId(null);
                setIsSubmittingBayar(false); // Reset status submit
                setFormBayar({ kdpengeluaran: formBayar.kdpengeluaran, kdbahanbaku: "", kdbeban: "", deskripsi: "", qty: 0, satuan: "", total: 0, dokumenbayar: "" }); // Reset form

                setFile(null);
                setPreviewFile(null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Kosongkan input file secara langsung
                }
            }, 500);
        }
    };

    // Handle tombol Edit Bayar
    const handleEditBayar = (kdbayar) => {
        const item = dataListBayar.find((d) => d.kdbayar === kdbayar);
        if (!item) return

        setFormBayar({
            kdpengeluaran: item.kdpengeluaran,
            kdbayar: item.kdbayar,
            tglbayar: item.tglbayar,
            metodebayar: item.metodebayar,
            nominal: item.nominal.toLocaleString(),
            dokumenbayar: item.dokumenbayar,
        });

        // Cek apakah dokumen ada
        if (item.dokumenbayar) {
            setFile(`/storage/omset/${data.dokumenbayar}`);
        } else {
            setFile(null);
        }

        setErrors({});
        setEditIdBayar(kdbayar);
        setShowFormulirBayar(true);
    };

    // Handle tombol Hapus Bayar
    const handleDeleteBayar = (kdbayar) => {
        const item = dataListBayar.find((d) => d.kdbayar === kdbayar); // Cari item berdasarkan ID
        if (!item) return; // Jika tidak ditemukan, hentikan fungsi

        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus pembayaran tagihan sejumlah "${item.nominal.toLocaleString()}" pada tanggal "${new Date(item.tglbayar).toISOString().split("T")[0].split("-").reverse().join("-")}", lanjutkan ?`);

        // if (confirmDelete) {
        //     setData(dataBayar.filter((d) => d.id !== id));
        //     alert(`Bayar pengeluaran "${item.deskripsi}" telah dihapus.`);
        // }
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

    const [data, setData] = useState([
        {
            id: 1,
            kdpengeluaran: "PG001",
            kdcabang: 1,
            namacabang: "Cabang 1",
            tgl: "2025-03-28",
            jenistrans: "utang",
            tgljatuhtempo: "2025-04-10",
            tglpelunasan: "",
            nomortrans: "INV-20250328-001",
            lokasitrans: "Distributor A",
            grandtotal: 500000,
            terbayar: 300000,
            sisa: 200000,
            dokumentrans: "https://hostme.web.id/upload/invoice_28032025.pdf",
            detailpengeluaran: [
                {
                    kddetailpengeluaran: "DP001",
                    kategoripengeluaran: "Dapur",
                    kdbahanbaku: "BB001",
                    deskripsi: "Tepung Terigu",
                    qty: 10,
                    satuan: "kg",
                    total: 100000
                },
                {
                    kddetailpengeluaran: "DP002",
                    kategoripengeluaran: "Bar",
                    kdbahanbaku: "BB001",
                    deskripsi: "Gula",
                    qty: 10,
                    satuan: "kg",
                    total: 50000
                }
            ],
            detailbayar: [
                {
                    kdbayar: "DB001",
                    tglbayar: "2025-04-01",
                    nominal: 200000,
                    metodebayar: "transfer",
                    dokumenbayar: "https://hostme.web.id/upload/bukti_transfer_01042025.pdf"
                },
                {
                    kdbayar: "DB002",
                    tglbayar: "2025-04-05",
                    nominal: 100000,
                    metodebayar: "tunai",
                    dokumenbayar: ""
                }
            ]
        },
        {
            id: 2,
            kdpengeluaran: "PG002",
            kdcabang: 2,
            namacabang: "Cabang 2",
            tgl: "2025-03-29",
            jenistrans: "tunai",
            tgljatuhtempo: "",
            tglpelunasan: "2025-03-29",
            nomortrans: "20250329",
            lokasitrans: "PPOB",
            grandtotal: 750000,
            terbayar: 750000,
            sisa: 0,
            dokumentrans: "https://hostme.web.id/upload/invoice_29032025.pdf",
            detailpengeluaran: [
                {
                    kddetailpengeluaran: "DP003",
                    kategoripengeluaran: "Listrik",
                    kdbahanbaku: "",
                    deskripsi: "Listrik",
                    qty: 0,
                    satuan: "",
                    total: "750000"
                }
            ],
            detailbayar: []
        },
        {
            id: 3,
            kdpengeluaran: "PG003",
            kdcabang: 3,
            namacabang: "Cabang 3",
            tgl: "2025-03-30",
            jenistrans: "utang",
            tgljatuhtempo: "2025-04-15",
            tglpelunasan: "",
            nomortrans: "INV-20250330-003",
            lokasitrans: "Agen C",
            grandtotal: 300000,
            terbayar: 0,
            sisa: 300000,
            dokumentrans: "https://hostme.web.id/upload/invoice_30032025.pdf",
            detailpengeluaran: [
                {
                    kddetailpengeluaran: "DP005",
                    kategoripengeluaran: "Bar",
                    kdbahanbaku: "BB004",
                    deskripsi: "Susu Kental Manis",
                    qty: 5,
                    satuan: "kaleng",
                    total: 300000
                }
            ],
            detailbayar: [
                {
                    kdbayar: "DB003",
                    tglbayar: "2025-04-10",
                    nominal: 300000,
                    metodebayar: "qris",
                    dokumenbayar: "https://hostme.web.id/upload/qris_10042025.png"
                }
            ]
        },
        {
            id: 4,
            kdpengeluaran: "PG004",
            kdcabang: 4,
            namacabang: "Cabang 4",
            tgl: "2025-04-01",
            jenistrans: "tunai",
            tgljatuhtempo: "",
            tglpelunasan: "2025-04-01",
            nomortrans: "INV-20250401-004",
            lokasitrans: "Pasar D",
            grandtotal: 600000,
            terbayar: 600000,
            sisa: 0,
            dokumentrans: "https://hostme.web.id/upload/invoice_01042025.pdf",
            detailpengeluaran: [
                {
                    kddetailpengeluaran: "DP006",
                    kategoripengeluaran: "Dapur",
                    kdbahanbaku: "BB005",
                    deskripsi: "Tepung Beras",
                    qty: 8,
                    satuan: "kg",
                    total: 400000
                }
            ],
            detailbayar: []
        },
        {
            id: 5,
            kdpengeluaran: "PG005",
            kdcabang: 5,
            namacabang: "Cabang 5",
            tgl: "2025-04-02",
            jenistrans: "utang",
            tgljatuhtempo: "2025-04-20",
            tglpelunasan: "",
            nomortrans: "INV-20250402-005",
            lokasitrans: "Agen E",
            grandtotal: 900000,
            terbayar: 300000,
            sisa: 600000,
            dokumentrans: "https://hostme.web.id/upload/invoice_02042025.pdf",
            detailpengeluaran: [
                {
                    kddetailpengeluaran: "DP007",
                    kategoripengeluaran: "Dapur",
                    kdbahanbaku: "BB006",
                    deskripsi: "Mentega",
                    qty: 5,
                    satuan: "kg",
                    total: 500000
                }
            ],
            detailbayar: [
                {
                    kdbayar: "DB004",
                    tglbayar: "2025-04-05",
                    nominal: 300000,
                    metodebayar: "transfer",
                    dokumenbayar: "https://hostme.web.id/upload/bukti_transfer_05042025.pdf"
                }
            ]
        },
        {
            id: 6,
            kdpengeluaran: "PG006",
            kdcabang: 6,
            namacabang: "Cabang 6",
            tgl: "2025-03-29",
            jenistrans: "tunai",
            tgljatuhtempo: "",
            tglpelunasan: "2025-03-29",
            nomortrans: "234545656",
            lokasitrans: "PDAM Balikpapan",
            grandtotal: 550000,
            terbayar: 550000,
            sisa: 0,
            dokumentrans: "https://hostme.web.id/upload/invoice_234545656.pdf",
            detailpengeluaran: [
                {
                    kddetailpengeluaran: "DP003",
                    kategoripengeluaran: "Air",
                    kdbahanbaku: "",
                    deskripsi: "Air",
                    qty: 0,
                    satuan: "",
                    total: 550000
                }
            ],
            detailbayar: []
        },
    ]
    );

    const [sortColumn, setSortColumn] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Fungsi sorting tabel
    const sortTable = (key) => {
        const sortedData = [...data].sort((a, b) => {
            if (sortOrder === "asc") {
                return a[key] > b[key] ? 1 : -1;
            } else {
                return a[key] < b[key] ? 1 : -1;
            }
        });

        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        setData(sortedData);
    };

    // Fungsi pencarian
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    // Filter data berdasarkan pencarian
    const filteredData = data.filter((item) => {
        return Object.values(item).some((value) => {
            if (value === null || value === undefined) return false;

            const strValue = value.toString().toLowerCase();
            const searchValue = searchQuery.toLowerCase();

            // Cek jika input adalah format tanggal dd-mm-yyyy
            if (item.tgl) {
                const formattedDate = new Date(item.tgl)
                    .toISOString()
                    .split("T")[0] // Hasil: "YYYY-MM-DD"
                    .split("-")
                    .reverse()
                    .join("-"); // Ubah jadi "DD-MM-YYYY"

                if (formattedDate.includes(searchValue)) {
                    return true;
                }
            }

            return strValue.includes(searchValue);
        });
    });


    // Pagination untuk hasil pencarian
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="content">
            <h2>Pengeluaran <small className="fs-5">(Nama lokasi cabang)</small></h2>

            {/* Tombol Tambah & Filter */}
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-primary btn-sm" onClick={handleOpenModal}><i className="fa-solid fa-plus"></i> Tambah Data</button>
                <input
                    type="text"
                    className="form-control w-25"
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
                            <th rowSpan="2" className="sticky-column sticky-id" onClick={() => sortTable("id")} style={{ cursor: "pointer" }}>
                                {sortColumn === "id" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} #
                            </th>
                            <th rowSpan="2" className="sticky-column sticky-aksi">Aksi</th>
                            <th rowSpan="2" onClick={() => sortTable("namacabang")} style={{ cursor: "pointer" }}>
                                {sortColumn === "namacabang" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Cabang
                            </th>
                            <th rowSpan="2" onClick={() => sortTable("jenistrans")} style={{ cursor: "pointer" }}>
                                {sortColumn === "jenistrans" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Jenis Transaksi
                            </th>
                            <th colSpan="3">Tanggal</th>
                            <th rowSpan="2" onClick={() => sortTable("nomortrans")} style={{ cursor: "pointer" }}>
                                {sortColumn === "nomortrans" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Nomor Transaksi
                            </th>
                            <th rowSpan="2" onClick={() => sortTable("lokasitrans")} style={{ cursor: "pointer" }}>
                                {sortColumn === "lokasitrans" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Lokasi Transaksi/Distributor
                            </th>
                            <th rowSpan="2" onClick={() => sortTable("grandtotal")} style={{ cursor: "pointer" }}>
                                {sortColumn === "grandtotal" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Grand Total
                            </th>
                            <th rowSpan="2" onClick={() => sortTable("terbayar")} style={{ cursor: "pointer" }}>
                                {sortColumn === "terbayar" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Total Pembayaran
                            </th>
                            <th rowSpan="2" onClick={() => sortTable("sisa")} style={{ cursor: "pointer" }}>
                                {sortColumn === "sisa" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Sisa Tagihan
                            </th>
                            <th rowSpan="2">Detail Transaksi</th>
                            <th rowSpan="2">Detail Pembayaran</th>
                        </tr>
                        <tr>
                            <th onClick={() => sortTable("grandtotal")} style={{ cursor: "pointer" }}>
                                {sortColumn === "grandtotal" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Transaksi
                            </th>
                            <th onClick={() => sortTable("grandtotal")} style={{ cursor: "pointer" }}>
                                {sortColumn === "grandtotal" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Jatuh Tempo
                            </th>
                            <th onClick={() => sortTable("grandtotal")} style={{ cursor: "pointer" }}>
                                {sortColumn === "grandtotal" ? (
                                    sortOrder === "asc" ? (
                                        <i className="fa fa-sort-up"></i>
                                    ) : (
                                        <i className="fa fa-sort-down"></i>
                                    )
                                ) : (
                                    <i className="fa fa-sort"></i>
                                )} Pelunasan
                            </th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {currentData.map((item) => (
                            <tr key={item.id}>
                                <td className="sticky-column sticky-id text-center">{item.id}</td>
                                <td className="sticky-column sticky-aksi text-center">
                                    {/* Tombol Bayar */}
                                    {item.sisa > 0 &&
                                        <button className="btn btn-info btn-xs me-1" onClick={() => handleBayar(item.id)}>
                                            Bayar
                                        </button>
                                    }
                                    {/* Tombol Edit */}
                                    <button className="btn btn-warning btn-xs me-1" onClick={() => handleEdit(item.id)}>
                                        <i className="fa fa-edit"></i>
                                    </button>
                                    {/* Tombol Hapus */}
                                    <button className="btn btn-danger btn-xs me-1" onClick={() => handleDelete(item.id)}>
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                                <td className="text-center">{item.namacabang}</td>
                                <td className={`text-center text-light ${item.sisa == 0 ? "bg-success" : "bg-danger"}`}>{item.jenistrans}</td>
                                <td className="text-center">{new Date(item.tgl).toISOString().split("T")[0].split("-").reverse().join("-")}</td>
                                <td className="text-center">{item.tgljatuhtempo != "" ? new Date(item.tgljatuhtempo).toISOString().split("T")[0].split("-").reverse().join("-") : "-"}</td>
                                <td className="text-center">{item.tglpelunasan != "" ? new Date(item.tglpelunasan).toISOString().split("T")[0].split("-").reverse().join("-") : "-"}</td>
                                <td>
                                    <div className="d-flex gap-2 justify-content-start align-items-center">
                                        <button className="btn btn-info btn-xs" onClick={() => handlePreview(item.dokumentrans)}>
                                            <i className="fa fa-image"></i>
                                        </button>
                                        <span className="flex-grow-1">{item.nomortrans}</span>
                                    </div>
                                </td>
                                <td>{item.lokasitrans}</td>
                                <td className="text-right">{item.grandtotal > 0 ? item.grandtotal.toLocaleString() : "-"}</td>
                                <td className="text-right">{item.terbayar > 0 ? item.terbayar.toLocaleString() : "-"}</td>
                                <td className="text-right">{item.sisa > 0 ? item.sisa.toLocaleString() : "-"}</td>
                                <td>
                                    <div className="list-container">
                                        {item.detailpengeluaran?.map((detail, idx) => (
                                            <ul key={idx} className="list-group list-group-horizontal">
                                                {item.detailpengeluaran.length > 1 && (
                                                    <li className="list-group-item nomor-list">{idx + 1}</li>
                                                )}

                                                {(detail.kategoripengeluaran != detail.deskripsi) ? (
                                                    <li className="list-group-item barang-list"><span className="fw-bold">({detail.kategoripengeluaran})</span> {detail.deskripsi}</li>
                                                ) : (
                                                    <li className="list-group-item barang-list">{detail.deskripsi}</li>
                                                )}

                                                {detail.qty > 1 ? (
                                                    <li className="list-group-item qty-list">{detail.qty} {detail.satuan}</li>
                                                ) : null}

                                                <li className="list-group-item total-list fw-bold">{detail.total.toLocaleString()}</li>
                                            </ul>
                                        ))}
                                    </div>
                                </td>
                                {/* <td>tes</td> */}
                                <td class="text-center">
                                    <div className="list-container">
                                        {Array.isArray(item.detailbayar) && item.detailbayar.length > 0 ? (
                                            item.detailbayar.map((detail, idx) => (
                                                <ul key={idx} className="list-group list-group-horizontal">
                                                    {item.detailbayar.length > 1 && (
                                                        <li className="list-group-item nomor-list">{idx + 1}</li>
                                                    )}
                                                    <li className="list-group-item barang-list">
                                                        <div className="d-flex gap-2 justify-content-start align-items-center">
                                                            <button className="btn btn-info btn-xs" onClick={() => handlePreview(detail.dokumenbayar)}>
                                                                <i className="fa fa-image"></i>
                                                            </button>
                                                            {detail.tglbayar
                                                                ? new Date(detail.tglbayar).toISOString().split("T")[0].split("-").reverse().join("-")
                                                                : "-"}
                                                            <span className="fw-bold">({detail.metodebayar})</span>
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item total-list fw-bold">{detail.nominal ? detail.nominal.toLocaleString() : "0"}</li>
                                                </ul>
                                            ))
                                        ) : (
                                            <span className="text-muted">Pembayaran telah dilakukan saat transaksi</span>
                                        )}
                                    </div>
                                </td>
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
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Formulir Pengeluaran</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <input type="hidden" name="kdpengeluaran" value={formData.kdpengeluaran} />

                                    <div className="row">
                                        <div className="col-3">
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
                                            <div className="mb-3">
                                                <label className="form-label">Jenis Transaksi</label>
                                                <select
                                                    className={`form-select ${errors.jenistrans ? "is-invalid" : ""}`}
                                                    name="jenistrans"
                                                    value={formData.jenistrans}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">-- Pilih Jenis Transaksi--</option>
                                                    <option value="tunai">Tunai</option>
                                                    <option value="utang">Utang</option>
                                                </select>
                                                {errors.jenistrans && <div className="invalid-feedback">{errors.jenistrans}</div>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Tgl. Transaksi</label>
                                                <input
                                                    type="date"
                                                    className={`form-control ${errors.tgl ? "is-invalid" : ""}`}
                                                    name="tgl"
                                                    value={formData.tgl}
                                                    onChange={handleChange}
                                                    onFocus={(e) => e.target.showPicker()}
                                                    placeholder="Masukkan tanggal transaksi"
                                                    autoComplete="off"
                                                />
                                                {errors.tgl && <div className="invalid-feedback">{errors.tgl}</div>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Tgl. Jatuh Tempo</label>
                                                <input
                                                    type="date"
                                                    className={`form-control ${errors.tgljatuhtempo ? "is-invalid" : ""}`}
                                                    name="tgljatuhtempo"
                                                    value={formData.tgljatuhtempo}
                                                    onChange={handleChange}
                                                    onFocus={(e) => e.target.showPicker()}
                                                    placeholder="Masukkan tanggal jatuh tempo"
                                                    autoComplete="off"
                                                />
                                                {errors.tgljatuhtempo && <div className="invalid-feedback">{errors.tgljatuhtempo}</div>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Nomor Transaksi</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.nomortrans ? "is-invalid" : ""}`}
                                                    name="nomortrans"
                                                    value={formData.nomortrans}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan Nomor transaksi"
                                                    autoComplete="off"
                                                />
                                                {errors.nomortrans && <div className="invalid-feedback">{errors.nomortrans}</div>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Lokasi Transaksi/Distributor</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.lokasitrans ? "is-invalid" : ""}`}
                                                    name="lokasitrans"
                                                    value={formData.lokasitrans}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan Lokasi transaksi"
                                                    autoComplete="off"
                                                />
                                                {errors.lokasitrans && <div className="invalid-feedback">{errors.lokasitrans}</div>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Grand Total</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.grandtotal ? "is-invalid" : ""}`}
                                                    name="grandtotal"
                                                    value={formData.grandtotal}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan Grand Total"
                                                    autoComplete="off"
                                                    step="any"
                                                />
                                                {errors.grandtotal && <div className="invalid-feedback">{errors.grandtotal}</div>}
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
                                                        className={`form-control ${errors.dokumenbayar ? "is-invalid" : ""}`}
                                                        placeholder="Pilih file..."
                                                        value={previewFile ? previewFile.name : formData.dokumentrans}
                                                        readOnly
                                                    />

                                                    {/* Input File (Disembunyikan) */}
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        name="dokumentrans"
                                                        accept=".pdf, .png, .jpg, .jpeg"
                                                        id="fileInputtrans"
                                                        onChange={handleChange}
                                                        style={{ display: "none" }} // Sembunyikan input file
                                                    />

                                                    {/* Tombol Upload (Trigger Input File) */}
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        type="button"
                                                        onClick={() => document.getElementById("fileInputtrans").click()}
                                                    >
                                                        <i className="fa-solid fa-upload"></i>
                                                    </button>

                                                    {errors.dokumentrans && <div className="invalid-feedback">{errors.dokumentrans}</div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-9">
                                            <div className="d-flex justify-content-between mb-1">
                                                <h6>Detail Transaksi</h6>
                                                <button type="button" className="btn btn-primary btn-xs" onClick={() => handleOpenModalDetail(formData.kdpengeluaran)}><i className="fa-solid fa-plus"></i> Tambah Detail</button>
                                            </div>

                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th className="col-id">No</th>
                                                            <th className="col-aksi">Aksi</th>
                                                            <th>Kategori</th>
                                                            <th>Deskripsi</th>
                                                            <th>Qty</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataListDetail.length > 0 ? (
                                                            dataListDetail.map((detail, index) => (
                                                                <tr key={index}>
                                                                    <td className="text-center">{index + 1}</td>
                                                                    <td className="text-center">
                                                                        {/* Tombol Edit */}
                                                                        <button type="button" className="btn btn-warning btn-xs me-1" onClick={() => handleEditDetail(detail.kddetailpengeluaran)}>
                                                                            <i className="fa fa-edit"></i>
                                                                        </button>
                                                                        {/* Tombol Hapus */}
                                                                        <button type="button" className="btn btn-danger btn-xs me-1" onClick={() => handleDeleteDetail(detail.kddetailpengeluaran)}>
                                                                            <i className="fa fa-trash"></i>
                                                                        </button>
                                                                    </td>
                                                                    <td className="text-center">{detail.kategoripengeluaran}</td>
                                                                    <td>{detail.deskripsi}</td>
                                                                    <td className="text-center">{detail.qty == 0 ? "-" : detail.qty} {detail.satuan}</td>
                                                                    <td className="text-right">{detail.total.toLocaleString()}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="6" className="text-center">Tidak ada detail pengeluaran</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
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
            )
            }

            {showDetailPengeluaran && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Detail Pengeluaran</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDetailPengeluaran(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmitDetail}>
                                    <input type="hidden" name="kdpengeluaran" value={formDetail.kdpengeluaran} />
                                    <input type="hidden" name="kddetailpengeluaran" value={formDetail.kddetailpengeluaran} />

                                    <div className="mb-2">
                                        <label className="form-label">Kategori Pengeluaran</label>
                                        <select
                                            className={`form-select ${errors.kategoripengeluaran ? "is-invalid" : ""}`}
                                            name="kategoripengeluaran"
                                            value={formDetail.kategoripengeluaran}
                                            onChange={handleChangeDetail}
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
                                    <div className="mb-2">
                                        {showBahanBaku &&
                                            <>
                                                <label className="form-label">Bahan Baku</label>
                                                <select
                                                    className={`form-select ${errors.kdbahanbaku ? "is-invalid" : ""}`}
                                                    name="kdbahanbaku"
                                                    value={formDetail.kdbahanbaku}
                                                    onChange={handleChangeDetail}
                                                >
                                                    <option value="">-- Pilih Bahan Baku --</option>
                                                    {bahanbaku.map((barang, index) => (
                                                        <option key={index} value={barang.kdbahanbaku}>
                                                            {barang.nama}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.kdbahanbaku && <div className="invalid-feedback">{errors.kdbahanbaku}</div>}
                                            </>
                                        }

                                        {showTeksDetail &&
                                            <>
                                                <label className="form-label">Deskripsi</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.deskripsi ? "is-invalid" : ""}`}
                                                    name="deskripsi"
                                                    value={formDetail.deskripsi}
                                                    onChange={handleChangeDetail}
                                                    placeholder="Masukkan deskripsi"
                                                    autoComplete="off"
                                                />
                                                {errors.deskripsi && <div className="invalid-feedback">{errors.deskripsi}</div>}
                                            </>
                                        }
                                    </div>
                                    {showBahanBaku &&
                                        <>
                                            <div className="mb-2">
                                                <label className="form-label">Qty</label>
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.qty ? "is-invalid" : ""}`}
                                                    name="qty"
                                                    value={formDetail.qty}
                                                    onChange={handleChangeDetail}
                                                    placeholder="Masukkan Qty"
                                                    autoComplete="off"
                                                />
                                                {errors.qty && <div className="invalid-feedback">{errors.qty}</div>}
                                            </div>
                                            <div className="mb-2">
                                                <label className="form-label">Satuan</label>
                                                <select
                                                    className={`form-control ${errors.satuan ? "is-invalid" : ""}`}
                                                    name="satuan"
                                                    value={formDetail.satuan}
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
                                        </>
                                    }
                                    <div className="mb-2">
                                        <label className="form-label">Total</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.total ? "is-invalid" : ""}`}
                                            name="total"
                                            value={formDetail.total}
                                            onChange={handleChangeDetail}
                                            placeholder="Masukkan Grand Total"
                                            autoComplete="off"
                                            step="any"
                                        />
                                        {errors.total && <div className="invalid-feedback">{errors.total}</div>}
                                    </div>

                                    <div className="modal-footer d-flex flex-row justify-content-between">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowDetailPengeluaran(false)} disabled={isSubmittingDetail}>
                                            Tutup
                                        </button>
                                        <button type="submit" className="btn btn-primary" onClick={handleSubmitDetail} disabled={isSubmittingDetail}>
                                            {isSubmittingDetail ? "Menyimpan..." : "Simpan"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div >
                </div >
            )}

            {showBayar && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h5 className="modal-title m-0">Pembayaran Tagihan</h5>

                                <div className="d-flex align-items-center gap-3">
                                    <button className="btn btn-primary btn-sm" onClick={handleFormulirBayar}>
                                        <i className="fa-solid fa-plus"></i> Tambah Data
                                    </button>
                                    <button className="btn-close" onClick={() => setShowBayar(false)}></button>
                                </div>
                            </div>
                            <div className="modal-body">

                                <table className="table">
                                    <thead className="table-dark">
                                        <tr>
                                            <th className="col-id">No</th>
                                            <th className="col-aksi">Aksi</th>
                                            <th>Tanggal</th>
                                            <th>Nominal</th>
                                            <th>Metode</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataListBayar.length > 0 ? (
                                            dataListBayar.map((bayar, index) => (
                                                <tr ket={index}>
                                                    <td className="text-center ">{index + 1}</td>
                                                    <td className="text-center ">
                                                        {/* Tombol Preview */}
                                                        <button type="button" className="btn btn-info btn-xs me-1" onClick={() => handlePreview(bayar.dokumenbayar)}>
                                                            <i className="fa fa-image"></i>
                                                        </button>
                                                        {/* Tombol Edit */}
                                                        <button type="button" className="btn btn-warning btn-xs me-1" onClick={() => handleEditBayar(bayar.kdbayar)}>
                                                            <i className="fa fa-edit"></i>
                                                        </button>
                                                        {/* Tombol Hapus */}
                                                        <button type="button" className="btn btn-danger btn-xs me-1" onClick={() => handleDeleteBayar(bayar.kdbayar)}>
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    </td>
                                                    <td className="text-center">{new Date(bayar.tglbayar).toISOString().split("T")[0].split("-").reverse().join("-")}</td>
                                                    <td className="text-center">{bayar.nominal.toLocaleString()}</td>
                                                    <td className="text-center">{bayar.metodebayar}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">Tidak ada pembayaran</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div >
                </div >
            )}

            {showFormulirBayar && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Formulir Pembayaran</h5>
                                <button type="button" className="btn-close" onClick={() => setShowFormulirBayar(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmitBayar}>
                                    <input type="hidden" name="kdpengeluaran" value={formBayar.kdpengeluaran} />
                                    <input type="hidden" name="kdbayar" value={formBayar.kdbayar} />
                                    <input type="hidden" name="sisa" value={formBayar.sisa} />

                                    <div className="mb-2">
                                        <label className="form-label">Tanggal</label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.tglbayar ? "is-invalid" : ""}`}
                                            name="tglbayar"
                                            value={formBayar.tglbayar}
                                            onChange={handleChangeBayar}
                                            onFocus={(e) => e.target.showPicker()}
                                            placeholder="Masukkan tgl bayar"
                                            autoComplete="off"
                                        />
                                        {errors.tglbayar && <div className="invalid-feedback">{errors.tglbayar}</div>}
                                    </div>

                                    <div className="mb-2">
                                        <label className="form-label">Metode Pembayaran</label>
                                        <select
                                            className={`form-select ${errors.metodebayar ? "is-invalid" : ""}`}
                                            name="metodebayar"
                                            value={formBayar.metodebayar}
                                            onChange={handleChangeBayar}
                                        >
                                            <option value="">-- Pilih Kategori --</option>
                                            <option value="tunai">Tunai</option>
                                            <option value="transfer">Transfer</option>
                                            <option value="qris">QRIS</option>
                                        </select>
                                        {errors.metodebayar && <div className="invalid-feedback">{errors.metodebayar}</div>}
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Nominal</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.nominal ? "is-invalid" : ""}`}
                                            name="nominal"
                                            value={formBayar.nominal}
                                            onChange={handleChangeBayar}
                                            placeholder="Masukkan nominal bayar"
                                            autoComplete="off"
                                        />
                                        {errors.nominal && <div className="invalid-feedback">{errors.nominal}</div>}
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label">Dokumen</label>
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
                                                className={`form-control ${errors.dokumenbayar ? "is-invalid" : ""}`}
                                                placeholder="Pilih file..."
                                                value={previewFile ? previewFile.name : formBayar.dokumenbayar}
                                                readOnly
                                            />

                                            {/* Input File (Disembunyikan) */}
                                            <input
                                                type="file"
                                                name="dokumenbayar"
                                                accept=".pdf, .png, .jpg, .jpeg"
                                                id="fileInputbayar"
                                                ref={fileInputRef}
                                                onChange={handleChangeBayar}
                                                style={{ display: "none" }} // Sembunyikan input file
                                            />

                                            {/* Tombol Upload (Trigger Input File) */}
                                            <button
                                                className="btn btn-outline-primary"
                                                type="button"
                                                onClick={() => document.getElementById("fileInputbayar").click()}
                                            >
                                                <i className="fa-solid fa-upload"></i>
                                            </button>

                                            {errors.dokumenbayar && <div className="invalid-feedback">{errors.dokumenbayar}</div>}
                                        </div>
                                    </div>

                                    <div className="modal-footer d-flex flex-row justify-content-between">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowFormulirBayar(false)} disabled={isSubmittingBayar}>
                                            Tutup
                                        </button>
                                        <button type="submit" className="btn btn-primary" onClick={handleSubmitBayar} disabled={isSubmittingBayar}>
                                            {isSubmittingBayar ? "Menyimpan..." : "Simpan"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div >
                </div >
            )}

            {/* Modal Preview */}
            {
                previewModal && (
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

                                    <a href={previewModal} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        Buka di Tab Baru
                                    </a>
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

export default Pengeluaran;
