import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthorForm from "../components/AuthorForm";
import { Modal } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [authorToEdit, setAuthorToEdit] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [searchId, setSearchId] = useState("");
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
      .then((data) => {
        setAuthors(data);
        setFilteredAuthors(data);
      })
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

  const handleCloseModal = () => setSelectedAuthor(null);

  const handleSearch = () => {
    if (!searchId) return;
    fetch(`${API}/authors/${searchId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Autor no encontrado");
      })
      .then((author) => setFilteredAuthors([author]))
      .catch(() => setFilteredAuthors([]));
  };

  const handleClearSearch = () => {
    setSearchId("");
    setFilteredAuthors(authors);
  };

  return (
    <div
      style={{
        backgroundColor: "#F2F7FF",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2
        style={{
          color: "#10274C",
          fontWeight: "600",
          marginBottom: "2rem",
        }}
      >
        Gestión de Autores
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
                setAuthorToEdit(null);
                setShowForm(true);
              }}
            >
              Nuevo autor
            </button>
          ) : (
            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                setAuthorToEdit(null);
                setShowForm(false);
              }}
            >
              Cancelar
            </button>
          )}
        </div>
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

      <div className="table-responsive">
        <table
          className="table table-bordered table-hover table-striped"
          style={{
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#eaf1ff", color: "#10274C" }}>
            <tr className="text-center">
              <th>ID</th>
              <th>Nombre</th>
              <th>País</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAuthors.map((a) => (
              <tr key={a.id} className="text-center align-middle">
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.country || "No especificado"}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#6C757D",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      onClick={() => setSelectedAuthor(a)}
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
                        setAuthorToEdit(a);
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
                      onClick={() => handleDelete(a.id)}
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

      {selectedAuthor && (
        <Modal show onHide={handleCloseModal} centered>
          <Modal.Header
            closeButton
            style={{
              backgroundColor: "#1F3A63",
              color: "#fff",
              borderBottom: "none",
            }}
            closeVariant="white"
          >
            <Modal.Title style={{ fontWeight: "500" }}>
              Detalle del Autor
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 py-3">
            <p>
              <strong>Nombre:</strong> {selectedAuthor.name}
            </p>
            <p>
              <strong>País:</strong>{" "}
              {selectedAuthor.country || "No especificado"}
            </p>
            <p>
              <strong>Biografía:</strong>
            </p>
            <p className="text-secondary">
              {selectedAuthor.bio || "No hay biografía registrada."}
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

export default Authors;
