import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryForm from "../components/CategoryForm";
import { Modal } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [searchId, setSearchId] = useState("");
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
      .then((data) => {
        setCategories(data);
        setFilteredCategories(data);
      })
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

  const handleSearch = () => {
    if (!searchId) return;
    fetch(`${API}/categories/${searchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Categoría no encontrada");
      })
      .then((data) => setFilteredCategories([data]))
      .catch(() => setFilteredCategories([]));
  };

  const handleClearSearch = () => {
    setSearchId("");
    setFilteredCategories(categories);
  };

  return (
    <div
      style={{
        backgroundColor: "#F2F7FF",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: "#10274C", fontWeight: "600", marginBottom: "2rem" }}>
        Gestión de Categorías
      </h2>

      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
        <div className="d-flex gap-2 align-items-center">
          <input
            type="number"
            placeholder="Buscar por ID"
            className="form-control"
            style={{ maxWidth: "220px", borderColor: "#cdd7e1" }}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button
            className="btn"
            style={{
              backgroundColor: "#1F3A63",
              color: "#fff",
              fontWeight: "500",
            }}
            onClick={handleSearch}
          >
            Buscar
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleClearSearch}
            title="Limpiar búsqueda"
          >
            Limpiar
          </button>
        </div>

        <div>
          {!showForm ? (
            <button
              className="btn"
              style={{
                backgroundColor: "#1F3A63",
                color: "#fff",
                fontWeight: "500",
              }}
              onClick={() => {
                setCategoryToEdit(null);
                setShowForm(true);
              }}
            >
              Nueva categoría
            </button>
          ) : (
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setShowForm(false);
                setCategoryToEdit(null);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
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

      <div className="table-responsive">
        <table
          className="table table-bordered table-hover table-striped"
          style={{ borderRadius: "8px", overflow: "hidden" }}
        >
          <thead style={{ backgroundColor: "#eaf1ff", color: "#10274C" }}>
            <tr className="text-center">
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((c) => (
              <tr key={c.id} className="text-center align-middle">
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#6C757D",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      onClick={() => setSelectedCategory(c)}
                    >
                      Detalle
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#1F3A63",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      onClick={() => {
                        setCategoryToEdit(c);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#DC3545",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      onClick={() => handleDelete(c.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCategory && (
        <Modal show onHide={() => setSelectedCategory(null)} centered>
          <Modal.Header
            closeButton
            style={{
              backgroundColor: "#1F3A63",
              color: "white",
              borderBottom: "none",
            }}
            closeVariant="white"
          >
            <Modal.Title style={{ fontWeight: "500" }}>
              Detalle de Categoría
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 py-3">
            <p>
              <strong>Nombre:</strong> {selectedCategory.name}
            </p>
            <p>
              <strong>Descripción:</strong>
            </p>
            <p className="text-secondary">
              {selectedCategory.description || "No hay descripción registrada."}
            </p>
          </Modal.Body>
        </Modal>
      )}

      <style>
        {`
          .table-hover tbody tr:hover {
            background-color: #f0f5ff;
          }
          .table-bordered th, .table-bordered td {
            border-color: #cdd7e1 !important;
          }
        `}
      </style>
    </div>
  );
};

export default Categories;
