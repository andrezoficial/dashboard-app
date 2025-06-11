import React from "react";
import jwt_decode from "jwt-decode";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const user = jwt_decode(token);

  return (
    <div style={{ padding: 20 }}>
      <h1>Bienvenido al Dashboard</h1>
      <h3>Rol: {user.role}</h3>
    </div>
  );
}
