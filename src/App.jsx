import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./assets/css/theme.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Bahanbaku from "./components/Bahanbaku";
import Beban from "./components/Beban";
import Cabang from "./components/Cabang";
import Kategoripengeluaran from "./components/Kategoripengeluaran";
import User from "./components/User";
import Perbaikanstok from "./components/Perbaikanstok";
import Recheckstok from "./components/Recheckstok";
import Transferstok from "./components/Transferstok";
import Penjualan from "./components/Penjualan";
import Pengeluaran from "./components/Pengeluaran";
import Laporan from "./components/Laporan";
import Profile from "./components/Profile";
import Loginpage from "./components/Loginpage";

function App() {
  // Pastikan state awal membaca dari localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("isAuthenticated"));

  useEffect(() => {
    const userLogin = localStorage.getItem("isAuthenticated");
    if (userLogin) {
      setIsAuthenticated(true);
    }

    document.title = "Kedai Kopi BJ";
    document.querySelector("link[rel='icon']").href = "/logo.png"; // Sesuaikan dengan favicon kamu
  }, []);

  // Fungsi untuk login
  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true"); // Simpan status login
    setIsAuthenticated(true);
  };

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Hapus status login
    setIsAuthenticated(false);
  };

  // Komponen Protected Route (Cegah akses tanpa login)
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Halaman Login (Tidak ada Sidebar & Header) */}
        <Route path="/login" element={<Loginpage onLogin={handleLogin} />} />

        {/* Semua halaman lain hanya bisa diakses jika sudah login */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app">
                <Sidebar />
                <div className="main-content">
                  <Header onLogout={handleLogout} /> {/* Kirim handleLogout ke Header */}
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/bahanbaku" element={<Bahanbaku />} />
                    <Route path="/beban" element={<Beban />} />
                    <Route path="/cabang" element={<Cabang />} />
                    <Route path="/kategoripengeluaran" element={<Kategoripengeluaran />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/perbaikanstok" element={<Perbaikanstok />} />
                    <Route path="/recheckstok" element={<Recheckstok />} />
                    <Route path="/transferstok" element={<Transferstok />} />
                    <Route path="/penjualan" element={<Penjualan />} />
                    <Route path="/pengeluaran" element={<Pengeluaran />} />
                    <Route path="/laporan" element={<Laporan />} />
                    <Route path="/profile" element={<Profile />} />
                    {/* Tambahkan tombol logout di profile atau dashboard */}
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
