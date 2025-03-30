import React, { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"
import AlertTagihan from "../components/Alerttagihan"

Chart.register(...registerables); // Registrasi semua elemen Chart.js

const Dashboard = () => {
    const omsetChartRef = useRef(null);
    const expensesChartRef = useRef(null);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedBranch, setSelectedBranch] = useState("main");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!omsetChartRef.current || !expensesChartRef.current) return;

        // Dummy Data
        const labelsDaily = ["01", "02", "03", "04", "05", "06", "07"];
        const omsetData = [100, 200, 150, 300, 250, 400, 350];
        const expensesData = [50, 100, 80, 150, 120, 200, 180];

        // Fungsi Membuat Chart
        const createChart = (ctx, label, labels, data, borderColor, backgroundColor) => {
            return new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: label,
                            data: data,
                            borderColor: borderColor,
                            backgroundColor: backgroundColor,
                            borderWidth: 2,
                            fill: true,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { type: "category" },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => `${context.raw}`,
                            },
                        },
                    },
                },
            });
        };

        // Hapus chart lama sebelum membuat baru
        if (omsetChartRef.current.chart) omsetChartRef.current.chart.destroy();
        if (expensesChartRef.current.chart) expensesChartRef.current.chart.destroy();

        // Buat Chart Baru
        omsetChartRef.current.chart = createChart(
            omsetChartRef.current.getContext("2d"),
            "Omset (Turnover)",
            labelsDaily,
            omsetData,
            "blue",
            "rgba(0, 0, 255, 0.2)"
        );

        expensesChartRef.current.chart = createChart(
            expensesChartRef.current.getContext("2d"),
            "Pengeluaran",
            labelsDaily,
            expensesData,
            "red",
            "rgba(255, 0, 0, 0.2)"
        );
    }, []);

    // Fungsi untuk Menerapkan Filter
    const applyFilters = () => {
        setLoading(true);

        setTimeout(() => {
            let labels, omset, expenses;

            labels = ["01", "02", "03", "04", "05", "06", "07"];
            omset = [100, 200, 150, 300, 250, 400, 350];
            expenses = [50, 100, 80, 150, 120, 200, 180];

            omsetChartRef.current.chart.data.labels = labels;
            omsetChartRef.current.chart.data.datasets[0].data = omset;
            omsetChartRef.current.chart.update();

            expensesChartRef.current.chart.data.labels = labels;
            expensesChartRef.current.chart.data.datasets[0].data = expenses;
            expensesChartRef.current.chart.update();

            setLoading(false);
        }, 1000);
    };

    return (
        <div className="content">
            <h2>Dashboard</h2>
            <div className="mb-3">
                <div className="row">
                    <div className="col-md-2">
                        <input type="month" className="form-control" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                        <select className="form-select" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
                            <option value="main">Cabang Utama</option>
                            <option value="branch1">Cabang 1</option>
                            <option value="branch2">Cabang 2</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary btn-sm" onClick={applyFilters}>
                            <i className="fa-solid fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart Container */}
            <div className="row">
                <div className="col-md-6 position-relative">
                    {loading && <div className="loading-overlay">Loading...</div>}
                    <canvas ref={omsetChartRef}></canvas>
                </div>
                <div className="col-md-6 position-relative">
                    {loading && <div className="loading-overlay">Loading...</div>}
                    <canvas ref={expensesChartRef}></canvas>
                </div>
            </div>

            <AlertTagihan />
        </div>
    );
};

export default Dashboard;
