import { useRef, useEffect } from "react";

const useDragScroll = () => {
    const scrollRef = useRef(null);
    let isDown = false;
    let startX;
    let scrollLeft;
    let allowTextSelection = false; // Untuk mengontrol seleksi teks

    useEffect(() => {
        const slider = scrollRef.current;

        const handleMouseDown = (e) => {
            if (allowTextSelection) return; // Jika teks bisa dipilih, jangan aktifkan drag scroll

            isDown = true;
            slider.classList.add("grabbing");
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };

        const handleMouseLeave = () => {
            isDown = false;
            slider.classList.remove("grabbing");
        };

        const handleMouseUp = () => {
            isDown = false;
            slider.classList.remove("grabbing");
        };

        const handleMouseMove = (e) => {
            if (!isDown || allowTextSelection) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Kecepatan geser
            slider.scrollLeft = scrollLeft - walk;
        };

        const handleDoubleClick = (e) => {
            const targetCell = e.target.closest("td"); // Hanya aktif di sel tabel
            if (targetCell) {
                allowTextSelection = true; // Izinkan seleksi teks
                slider.style.userSelect = "text";

                // Kembalikan ke default setelah beberapa detik atau saat klik di luar
                setTimeout(() => {
                    allowTextSelection = false;
                    slider.style.userSelect = "none";
                }, 3000); // Biarkan pengguna memilih teks selama 3 detik
            }
        };

        if (slider) {
            slider.addEventListener("mousedown", handleMouseDown);
            slider.addEventListener("mouseleave", handleMouseLeave);
            slider.addEventListener("mouseup", handleMouseUp);
            slider.addEventListener("mousemove", handleMouseMove);
            slider.addEventListener("dblclick", handleDoubleClick); // Tambahkan event double-click
        }

        return () => {
            if (slider) {
                slider.removeEventListener("mousedown", handleMouseDown);
                slider.removeEventListener("mouseleave", handleMouseLeave);
                slider.removeEventListener("mouseup", handleMouseUp);
                slider.removeEventListener("mousemove", handleMouseMove);
                slider.removeEventListener("dblclick", handleDoubleClick);
            }
        };
    }, []);

    return scrollRef;
};

export default useDragScroll;
