// src/components/access-control/Role.js
import React from "react";
import { useAuth } from "../../context/AuthContext";
import permissions from "./permissions";

export default function Role({ permission, children }) {
  const { user } = useAuth();

  // Si no hay usuario, no mostramos nada
  if (!user || !user.rol) return null;

  // Obtenemos los permisos de este rol
  const userPermissions = permissions[user.rol] || [];

  // Si el permiso no está en la lista, no mostramos nada
  if (!userPermissions.includes(permission)) {
    return null;
  }

  // Si incluye el permiso, renderizamos los hijos
  return <>{children}</>;
}
