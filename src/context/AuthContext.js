import React, { createContext, useContext, useState } from "react";

// 1. Crear el contexto
export const AuthContext = createContext();

// 2. Crear el proveedor del contexto
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ 3. Exportar hook personalizado para acceder al contexto
export const useAuth = () => useContext(AuthContext);
