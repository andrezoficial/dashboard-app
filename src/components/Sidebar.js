import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Admin Dashboard
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-4">
          <li>
            <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">
              🏠 Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">
              👥 Usuarios
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">
              📦 Productos
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">
              ⚙️ Configuración
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
