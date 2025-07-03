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
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // <-- Importa el contexto tema
import { toast } from "react-toastify";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Contexto tema
  const { darkMode, toggleTheme } = useTheme();

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
    <div
      className={`${darkMode ? "dark" : ""} flex min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900`}
    >
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-width duration-300 ease-in-out fixed md:static z-30 top-0 left-0 h-full ${
          sidebarOpen ? "w-64" : "w-16"
        } ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}`}
        style={{ transitionProperty: "width, transform" }}
      >
        {/* Header sidebar con botón tema a la izquierda del logo */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          {/* Contenedor botón tema + logo */}
          <div className="flex items-center gap-2">
            {/* Botón toggle tema */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Logo (oculto si sidebar cerrado) */}
            <h1
              className={`text-xl font-bold text-blue-600 dark:text-blue-400 ${
                sidebarOpen ? "block" : "hidden"
              }`}
            >
              Vior Clinic
            </h1>
          </div>

          {/* Botón cerrar sidebar (solo móvil) */}
          <button
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
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
                      ? "bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-300"
                      : "hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <span className="text-blue-600 dark:text-blue-400">{item.icon}</span>
                  <span className={`${sidebarOpen ? "inline" : "hidden"} font-medium`}>
                    {item.name}
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay móvil */}
      <div
        className={`fixed inset-0 bg-black z-20 transition-opacity duration-300 ${
          isMobile && sidebarOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Contenido principal con footer */}
      <div className="flex flex-col flex-1 md:ml-64 min-h-screen">
        {/* Navbar */}
        {isMobile ? (
          <header className="flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm fixed top-0 left-0 right-0 z-30">
            {/* Botón abrir sidebar */}
            <button
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir sidebar"
            >
              <FiMenu size={24} />
            </button>

            {/* Título centrado */}
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {getActiveName()}
            </h2>

            {/* Botones Logout y Tema */}
            <div className="flex items-center gap-2 z-10">
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Logout
              </button>

              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            </div>
          </header>
        ) : (
          <header className="flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
            {/* Título izquierda */}
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              {getActiveName()}
            </h2>

            {/* Botones Logout y Tema */}
            <div className="flex items-center gap-2 z-10">
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Logout
              </button>

              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            </div>
          </header>
        )}

        {/* Contenido dinámico */}
        <main className={`flex-grow w-full overflow-auto p-6 ${isMobile ? "pt-20" : ""}`}>
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 text-center py-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <span>© {currentYear} — Desarrollado por</span>
            <a
              href="https://github.com/andrezoficial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <FaGithub className="text-lg" />
              andrezoficial
            </a>
          </div>
        </footer>
      </div>

      <style jsx="true" global="true">{`
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
