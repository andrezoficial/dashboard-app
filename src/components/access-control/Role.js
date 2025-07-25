// src/components/access-control/Role.js
import React from "react";
import { useAuth } from "../../context/AuthContext";
import permissions from "./permissions";

const Role = ({ permission, children }) => {
  const { user } = useAuth();

  if (!user) return null;

  const userPermissions = permissions[user.rol] || [];

  if (!userPermissions.includes(permission)) {
    return null;
  }

  return <>{children}</>;
};

export default Role;
