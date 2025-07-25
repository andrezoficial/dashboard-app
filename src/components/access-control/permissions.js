// src/components/access-control/permissions.js

const permissions = {
  Admin: ["ver_usuarios", "editar_usuarios", "crear_usuarios", "eliminar_usuarios"],
  Medico: ["ver_usuarios"],
  Auxiliar: ["ver_usuarios"],
};

export default permissions;
