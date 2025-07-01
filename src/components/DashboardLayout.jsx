import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiMenu,
  FiChevronLeft,
  FiUser,
  FiCalendar,
  FiMessageSquare,
} from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { name: "Dashboard", icon: <FiHome size={20} />, path: "/dashboard" },
    { name: "Usuarios", icon: <FiUsers size={20} />, path: "/usuarios" },
    { name: "Pacientes", icon: <FiUser size={20} />, path: "/pacientes" },
    { name: "Citas", icon: <FiCalendar size={20} />, path: "/citas" },
    { name: "Configuración", icon: <FiSettings size={20} />, path: "/configuracion" },
    { name: "Chat Bot", icon: <FiMessageSquare size={20} />, path: "/chat" },
  ];

  const getActiveName = () => {
    const current = menuItems.find((item) => location.pathname.startsWith(item.path));
    return current ? current.name : "";
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-width duration-300 ease-in-out fixed md:static z-30 top-0 left-0 h-full ${
          sidebarOpen ? "w-64" : "w-16"
        } ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}`}
        style={{ transitionProperty: "width, transform" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h1 className={`text-xl font-bold text-blue-600 ${sidebarOpen ? "block" : "hidden"}`}>
            Admin
          </h1>
          <button
            className="p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar sidebar"
          >
            <FiChevronLeft size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto mt-4 scrollbar-hide">
          <ul>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <li
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors rounded ${
                    location.pathname.startsWith(item.path)
                      ? "bg-blue-200 text-blue-800"
                      : "hover:bg-blue-100"
                  }`}
                >
                  <span className="text-blue-600">{item.icon}</span>
                  <span className={`${sidebarOpen ? "inline" : "hidden"} font-medium`}>
                    {item.name}
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay oscuro móvil */}
      <div
        className={`fixed inset-0 bg-black z-20 transition-opacity duration-300 ${
          isMobile && sidebarOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 md:ml-64">
        {/* Navbar móvil */}
        {isMobile && (
          <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm fixed top-0 left-0 right-0 z-30">
            <button
              className="p-2 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir sidebar"
            >
              <FiMenu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-gray-700">{getActiveName()}</h2>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </header>
        )}

        {/* Navbar desktop */}
        {!isMobile && (
          <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700">{getActiveName()}</h2>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </header>
        )}

        {/* Contenido + Footer */}
        <div className="flex flex-col min-h-screen">
          <main className={`flex-1 overflow-auto p-6 ${isMobile ? "pt-16" : ""}`}>
            <Outlet />
          </main>
          <footer className="bg-white text-center py-4 border-t border-gray-200 text-sm text-gray-600">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
              <span>© {currentYear} — Desarrollado por</span>
              <a
                href="https://github.com/andrezoficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <FaGithub className="text-lg" />
                andrezoficial
              </a>
            </div>
          </footer>
        </div>
      </div>

      {/* Ocultar scrollbars personalizados */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
