import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthorForm from "../components/AuthorForm";

const API = import.meta.env.VITE_API_URL;

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [authorToEdit, setAuthorToEdit] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchAuthors = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API}/authors`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
          throw new Error("No autorizado");
        }
        return res.json();
      })
      .then(setAuthors)
      .catch((err) => console.error("Error cargando autores:", err));
  };

  useEffect(fetchAuthors, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este autor?")) return;

    try {
      const res = await fetch(`${API}/authors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.ok) fetchAuthors();
    } catch (err) {
      console.error("Error al eliminar autor:", err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F2F7FF",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div className="d-flex justify-content-between mb-4">
        <h2 style={{ color: "#10274C" }}>✍️ Autores</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setAuthorToEdit(null);
            setShowForm(true);
          }}
        >
          ➕ Nuevo Autor
        </button>
      </div>

      {showForm && (
        <AuthorForm
          authorToEdit={authorToEdit}
          onSuccess={() => {
            fetchAuthors();
            setShowForm(false);
            setAuthorToEdit(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setAuthorToEdit(null);
          }}
        />
      )}

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setAuthorToEdit(a);
                    setShowForm(true);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(a.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
