import React, { useEffect, useState } from "react";

const AlertTagihan = () => {
    const [maxHeight, setMaxHeight] = useState("auto");

    const adjustAlertHeight = () => {
        const content = document.querySelector(".content");
        const header = document.querySelector(".header");

        if (content && header) {
            const contentHeight = content.clientHeight;
            const headerHeight = header.offsetHeight;
            const availableHeight = window.innerHeight - headerHeight - 20; // 20px padding ekstra
            setMaxHeight(`${availableHeight}px`);
        }
    };

    useEffect(() => {
        adjustAlertHeight();
        window.addEventListener("resize", adjustAlertHeight);
        return () => window.removeEventListener("resize", adjustAlertHeight);
    }, []);

    return (
        <div className="card mt-3">
            <div className="card-header fw-bold bg-light">🔔 Tagihan Belum Lunas</div>
            <div className="card-body alert-container" style={{ maxHeight, overflowY: "auto" }}>
                <div className="alert-card border-danger overdue">
                    <div className="d-flex justify-content-between small">
                        <span className="fw-bold">INV-20250305</span>
                        <span>Jatuh Tempo: 10 Maret 2025</span>
                        <span className="text-danger fw-bold">Rp 2.000.000</span>
                    </div>
                </div>
                <div className="alert-card border-warning">
                    <div className="d-flex justify-content-between small">
                        <span className="fw-bold">INV-20250320</span>
                        <span>Jatuh Tempo: 25 Maret 2025</span>
                        <span className="text-danger fw-bold">Rp 750.000</span>
                    </div>
                </div>
                <div className="alert-card border-warning">
                    <div className="d-flex justify-content-between small">
                        <span className="fw-bold">INV-20250325</span>
                        <span>Jatuh Tempo: 30 Maret 2025</span>
                        <span className="text-danger fw-bold">Rp 1.500.000</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertTagihan;
