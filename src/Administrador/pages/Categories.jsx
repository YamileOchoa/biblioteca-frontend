import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryForm from "../components/CategoryForm";

const API = import.meta.env.VITE_API_URL;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchCategories = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API}/categories`, {
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
      .then(setCategories)
      .catch((err) => console.error("Error cargando categorías:", err));
  };

  useEffect(fetchCategories, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;

    try {
      const res = await fetch(`${API}/categories/${id}`, {
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

      if (res.ok) {
        fetchCategories();
        setMensaje("🗑️ Categoría eliminada con éxito");
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
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
        <h2 style={{ color: "#10274C" }}>🏷️ Categorías</h2>
        {!showForm ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              setCategoryToEdit(null);
              setShowForm(true);
            }}
          >
            ➕ Nueva Categoría
          </button>
        ) : (
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setShowForm(false);
              setCategoryToEdit(null);
            }}
          >
            ✖️ Cancelar
          </button>
        )}
      </div>

      {mensaje && (
        <div
          className="alert alert-success"
          style={{
            borderColor: "#10274C",
            backgroundColor: "#eaf1ff",
            color: "#10274C",
          }}
        >
          {mensaje}
        </div>
      )}

      {showForm && (
        <CategoryForm
          categoryToEdit={categoryToEdit}
          onSuccess={() => {
            fetchCategories();
            setShowForm(false);
            setCategoryToEdit(null);
            setMensaje("✅ Categoría guardada con éxito");
            setTimeout(() => setMensaje(""), 3000);
          }}
          onCancel={() => {
            setShowForm(false);
            setCategoryToEdit(null);
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
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setCategoryToEdit(c);
                    setShowForm(true);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(c.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>
        {`
          .table-hover tbody tr:hover {
            background-color: #eaf1ff;
          }
          .table-bordered th, .table-bordered td {
            border-color: #10274C !important;
          }
        `}
      </style>
    </div>
  );
};

export default Categories;
