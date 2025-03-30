import { useState, useEffect } from "react";

const useNumberFormat = () => {
    const [thousandSeparator, setThousandSeparator] = useState(",");
    const [decimalSeparator, setDecimalSeparator] = useState(".");

    useEffect(() => {
        const numberWithDecimal = 1234.5;
        const formatted = new Intl.NumberFormat().format(numberWithDecimal);

        const commaIndex = formatted.indexOf(",");
        const dotIndex = formatted.indexOf(".");

        if (commaIndex > dotIndex && dotIndex !== -1) {
            setThousandSeparator(".");
            setDecimalSeparator(",");
        } else {
            setThousandSeparator(",");
            setDecimalSeparator(".");
        }
    }, []);

    // Format angka hanya untuk bagian ribuan
    const formatNumber = (value, event) => {
        if (!value) return "";

        const input = event.target;
        const cursorPosition = input.selectionStart; // Simpan posisi kursor sebelum perubahan

        // Cek apakah ada karakter desimal di dalam angka yang diketik
        const decimalIndex = value.indexOf(decimalSeparator);
        let integerPart = value;
        let decimalPart = "";

        if (decimalIndex !== -1) {
            integerPart = value.substring(0, decimalIndex);
            decimalPart = value.substring(decimalIndex); // Simpan karakter desimal dan angkanya

            // Pastikan hanya ada satu separator desimal
            decimalPart = decimalPart.replace(new RegExp(`\\${decimalSeparator}`, "g"), "");
            decimalPart = `${decimalSeparator}${decimalPart}`;
        }

        // Bersihkan angka dari karakter selain angka sebelum desimal
        integerPart = integerPart.replace(/\D/g, "");

        // Format ribuan hanya untuk bagian sebelum desimal
        const formattedIntegerPart = new Intl.NumberFormat().format(parseInt(integerPart, 10) || 0);

        // Gabungkan kembali dengan bagian desimal jika ada
        const formattedValue = decimalPart ? `${formattedIntegerPart}${decimalPart}` : formattedIntegerPart;

        // Hitung perubahan panjang string akibat formatting
        const diff = formattedValue.length - value.length;
        const newCursorPosition = Math.max(cursorPosition + diff, 0);

        // Gunakan setTimeout agar posisi kursor diperbaiki setelah React mengupdate state
        setTimeout(() => {
            input.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);

        return formattedValue;
    };

    // Konversi ke angka sebelum dikirim ke backend
    const parseNumber = (value) => {
        if (!value) return 0;

        // Ubah pemisah ribuan ke format numerik yang bisa dibaca JS
        let numericValue = value.replace(new RegExp(`\\${thousandSeparator}`, "g"), "");

        // Ubah pemisah desimal ke titik agar bisa dibaca sebagai float
        numericValue = numericValue.replace(decimalSeparator, ".");

        return parseFloat(numericValue) || 0;
    };

    return { formatNumber, parseNumber, decimalSeparator };
};

export default useNumberFormat;
