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
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";
import ChatbotWidget from "./ChatbotWidget";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
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
  { name: "Inicio", icon: <FiHome size={20} />, path: "/dashboard" },
  { name: "Usuarios", icon: <FiUsers size={20} />, path: "/dashboard/usuarios" },
  { name: "Pacientes", icon: <FiUser size={20} />, path: "/dashboard/pacientes" },
  { name: "Citas", icon: <FiCalendar size={20} />, path: "/dashboard/citas" },
  { name: "Configuración", icon: <FiSettings size={20} />, path: "/dashboard/configuracion" },
];

const getActiveName = () => {
  const current = menuItems.find((item) => location.pathname.startsWith(item.path));
  return current ? current.name : "";
};

  const currentYear = new Date().getFullYear();

  return (
    <div className={`${darkMode ? "dark" : ""} flex min-h-screen bg-gray-100 dark:bg-gray-900`}>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          flex flex-col z-30 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64 shadow-xl" : "w-16 shadow-md"}
          ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
        `}
        style={{ transitionProperty: "width, transform" }}
      >
        {/* Header sidebar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <h1 className={`text-xl font-bold text-blue-600 dark:text-blue-400 ${sidebarOpen ? "block" : "hidden"}`}>
              Vior Clinic
            </h1>
          </div>

          {/* Botón cerrar sidebar solo en móvil */}
          {isMobile && sidebarOpen && (
            <button
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar sidebar"
            >
              <FiChevronLeft size={20} />
            </button>
          )}

          {/* Botón toggle sidebar en desktop con rotación animada */}
          {!isMobile && (
            <button
              className={`
                p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                transform transition-transform duration-300
                ${sidebarOpen ? "rotate-0" : "rotate-180"}
              `}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Cerrar sidebar" : "Abrir sidebar"}
              title={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {sidebarOpen ? <FiChevronLeft size={20} /> : <FiMenu size={20} />}
            </button>
          )}
        </div>

        {/* Menú */}
        <nav className="flex-1 overflow-y-auto mt-4 scrollbar-hide">
          <ul>
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className="group relative block"
                >
                  <li
                    className={`
                      flex items-center gap-4 px-4 py-3 cursor-pointer rounded-lg
                      transition-colors duration-300 ease-in-out
                      ${
                        isActive
                          ? "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white shadow-lg"
                          : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      }
                      hover:shadow-md
                    `}
                  >
                    <span
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-full
                        transition-colors duration-300 ease-in-out
                        ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 group-hover:bg-blue-500 group-hover:text-white"
                        }
                      `}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`${sidebarOpen ? "inline" : "hidden"} font-semibold text-base select-none`}
                    >
                      {item.name}
                    </span>
                  </li>

                  {/* Tooltip si sidebar cerrado */}
                  {!sidebarOpen && (
                    <span
                      className="
                        absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1 rounded
                        bg-gray-900 text-white text-xs whitespace-nowrap
                        opacity-0 group-hover:opacity-100 pointer-events-none
                        transition-all duration-300 ease-in-out
                        translate-x-2 group-hover:translate-x-0
                        select-none
                      "
                      style={{ zIndex: 1000 }}
                    >
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
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

      {/* Contenido principal */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out
          ${sidebarOpen ? "md:ml-64" : "md:ml-16"}`}
      >
        {/* Navbar */}
        {isMobile ? (
          <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
            <button
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir sidebar"
            >
              <FiMenu size={24} />
            </button>

            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{getActiveName()}</h2>

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
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">{getActiveName()}</h2>

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

        {/* Contenido */}
        <main className={`flex-grow w-full overflow-auto p-6 ${isMobile ? "pt-20" : ""}`}>
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
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

      <ChatbotWidget />
      {/* Scrollbar hide styles */}
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
