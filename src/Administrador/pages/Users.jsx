import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUsers = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
          return [];
        }
        return res.json();
      })
      .then(setUsers)
      .catch((err) => console.error("Error al cargar usuarios:", err));
  };

  useEffect(fetchUsers, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;

    const res = await fetch(`${API}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (res.ok) fetchUsers();
    else if (res.status === 401) navigate("/login");
  };

  return (
    <div
      style={{
        backgroundColor: "#F2F7FF",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: "#10274C", fontWeight: "bold" }}>👤 Usuarios</h2>

      <div className="table-responsive mt-4">
        <table className="table table-hover table-bordered">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(u.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
