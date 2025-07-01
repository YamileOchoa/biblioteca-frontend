import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthorForm from "../components/AuthorForm";
import { Modal, Button } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [authorToEdit, setAuthorToEdit] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 10;
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

  const handleDelete = (author) => {
    setAuthorToDelete(author);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API}/authors/${authorToDelete.id}`, {
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
        fetchAuthors();
        setMensaje("Autor eliminado con éxito");
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch (err) {
      console.error("Error al eliminar autor:", err);
    } finally {
      setShowDeleteModal(false);
      setAuthorToDelete(null);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;

    try {
      const res = await fetch(`${API}/authors/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setSearchResult(data);
      } else {
        setSearchResult(null);
        alert("Autor no encontrado.");
      }
    } catch (err) {
      console.error("Error al buscar autor:", err);
    }
  };

  const handleClearSearch = () => {
    setSearchId("");
    setSearchResult(null);
  };

  const totalPages = Math.ceil(authors.length / authorsPerPage);
  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
  const currentAuthors = searchResult
    ? [searchResult]
    : authors.slice(indexOfFirstAuthor, indexOfLastAuthor);

  return (
    <div
      style={{
        backgroundColor: "#F2F7FF",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: "#10274C", fontWeight: "600", marginBottom: "2rem" }}>
        Gestión de Autores
      </h2>

      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap">
        <div className="d-flex gap-2 align-items-center mb-2 mb-md-0">
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
            type="button"
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
            type="button"
            onClick={handleClearSearch}
            title="Limpiar búsqueda"
          >
            Limpiar
          </button>
        </div>

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
        <AuthorForm
          authorToEdit={authorToEdit}
          onSuccess={() => {
            fetchAuthors();
            setShowForm(false);
            setAuthorToEdit(null);
            setMensaje("Autor guardado con éxito");
            setTimeout(() => setMensaje(""), 3000);
          }}
          onCancel={() => {
            setShowForm(false);
            setAuthorToEdit(null);
          }}
        />
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead style={{ backgroundColor: "#eaf1ff", color: "#10274C" }}>
            <tr className="text-center">
              <th>ID</th>
              <th>Nombre</th>
              <th>País</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentAuthors.map((author) => (
              <tr key={author.id} className="text-center align-middle">
                <td>{author.id}</td>
                <td>{author.name}</td>
                <td>{author.country || "No especificado"}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#6C757D",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      onClick={() => setSelectedAuthor(author)}
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
                        setAuthorToEdit(author);
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
                      onClick={() => handleDelete(author)}
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

      {!searchResult && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button
            variant="outline-primary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline-primary"
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </Button>
        </div>
      )}

      {/* Modal detalle del autor */}
      <Modal
        show={!!selectedAuthor}
        onHide={() => setSelectedAuthor(null)}
        centered
      >
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
            <strong>Nombre:</strong> {selectedAuthor?.name}
          </p>
          <p>
            <strong>País:</strong>{" "}
            {selectedAuthor?.country || "No especificado"}
          </p>
          <p>
            <strong>Biografía:</strong>
          </p>
          <p className="text-secondary">
            {selectedAuthor?.bio || "No hay biografía registrada."}
          </p>
        </Modal.Body>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Advertencia importante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás segura/o que deseas eliminar al autor{" "}
          <strong>{authorToDelete?.name}</strong>?<br />
          <span className="text-danger">
            Esto también eliminará todos los libros asociados a este autor.
          </span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

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
