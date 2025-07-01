import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryForm from "../components/CategoryForm";
import { Modal, Button } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;
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

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API}/categories/${categoryToDelete.id}`, {
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
        setMensaje("Categoría eliminada con éxito");
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;

    try {
      const res = await fetch(`${API}/categories/${searchId}`, {
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
        alert("Categoría no encontrada.");
      }
    } catch (err) {
      console.error("Error al buscar categoría:", err);
    }
  };

  const handleClearSearch = () => {
    setSearchId("");
    setSearchResult(null);
  };

  const totalPages = Math.ceil(categories.length / categoriesPerPage);
  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = searchResult
    ? [searchResult]
    : categories.slice(indexOfFirst, indexOfLast);

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
            setMensaje("Categoría guardada con éxito");
            setTimeout(() => setMensaje(""), 3000);
          }}
          onCancel={() => {
            setShowForm(false);
            setCategoryToEdit(null);
          }}
        />
      )}

      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead style={{ backgroundColor: "#eaf1ff", color: "#10274C" }}>
            <tr className="text-center">
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category) => (
              <tr key={category.id} className="text-center align-middle">
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#6C757D",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      onClick={() => setSelectedCategory(category)}
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
                        setCategoryToEdit(category);
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
                      onClick={() => handleDelete(category)}
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

      <Modal
        show={!!selectedCategory}
        onHide={() => setSelectedCategory(null)}
        centered
      >
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
            <strong>Nombre:</strong> {selectedCategory?.name}
          </p>
          <p>
            <strong>Descripción:</strong>
          </p>
          <p className="text-secondary">
            {selectedCategory?.description || "No hay descripción registrada."}
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
          ¿Estás segura/o que deseas eliminar la categoría{" "}
          <strong>{categoryToDelete?.name}</strong>?<br />
          <span className="text-danger">
            Esto también eliminará todos los libros asociados a esta categoría.
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

export default Categories;
