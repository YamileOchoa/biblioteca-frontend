import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookForm from "../components/BookForm";
import { Modal, Button } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

const Books = () => {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchBooks = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API}/books`, {
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
      .then(setBooks)
      .catch((err) => console.error("Error cargando libros:", err));
  };

  useEffect(fetchBooks, []);

  const handleDelete = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API}/books/${bookToDelete.id}`, {
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
        fetchBooks();
        setMensaje("Libro eliminado con éxito");
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch (err) {
      console.error("Error al eliminar libro:", err);
    } finally {
      setShowDeleteModal(false);
      setBookToDelete(null);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;

    try {
      const res = await fetch(`${API}/books/${searchId}`, {
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
        alert("Libro no encontrado.");
      }
    } catch (err) {
      console.error("Error al buscar libro:", err);
    }
  };

  const handleClearSearch = () => {
    setSearchId("");
    setSearchResult(null);
  };

  const totalPages = Math.ceil(books.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = searchResult
    ? [searchResult]
    : books.slice(indexOfFirstBook, indexOfLastBook);

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
        Gestión de Libros
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
              setBookToEdit(null);
              setShowForm(true);
            }}
          >
            Nuevo libro
          </button>
        ) : (
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setBookToEdit(null);
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
        <BookForm
          bookToEdit={bookToEdit}
          onSuccess={() => {
            fetchBooks();
            setShowForm(false);
            setBookToEdit(null);
            setMensaje("Libro guardado con éxito");
            setTimeout(() => setMensaje(""), 3000);
          }}
          onCancel={() => {
            setShowForm(false);
            setBookToEdit(null);
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
              <th>Título</th>
              <th>Año</th>
              <th>Editorial</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book.id} className="text-center align-middle">
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.year}</td>
                <td>{book.publisher}</td>
                <td>{book.stock}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#6C757D",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      onClick={() => {
                        setSelectedBook(book);
                        setShowDetail(true);
                      }}
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
                        setBookToEdit(book);
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
                      onClick={() => handleDelete(book)}
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

      {showDetail && selectedBook && (
        <Modal
          show
          onHide={() => {
            setShowDetail(false);
            setSelectedBook(null);
          }}
          centered
          size="lg"
          backdrop="static"
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            style={{
              backgroundColor: "#1F3A63",
              color: "white",
              borderBottom: "none",
            }}
          >
            <Modal.Title style={{ fontWeight: "500" }}>
              Detalle del Libro
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="px-4 py-3">
            <div className="row">
              <div className="col-md-4 text-center mb-3">
                <img
                  src={selectedBook.cover_image_url || "/books/default.webp"}
                  alt={selectedBook.title}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/books/default.webp";
                  }}
                />
              </div>

              <div className="col-md-8">
                <h5 style={{ color: "#10274C", fontWeight: "600" }}>
                  {selectedBook.title}
                </h5>

                <div className="row mt-3">
                  <div className="col-sm-6">
                    <p>
                      <strong>ID:</strong> {selectedBook.id}
                    </p>
                    <p>
                      <strong>Año:</strong> {selectedBook.year}
                    </p>
                    <p>
                      <strong>Editorial:</strong> {selectedBook.publisher}
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <p>
                      <strong>ISBN:</strong> {selectedBook.isbn}
                    </p>
                    <p>
                      <strong>Páginas:</strong> {selectedBook.pages}
                    </p>
                    <p>
                      <strong>Stock:</strong> {selectedBook.stock}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p>
                    <strong>Sinopsis:</strong>
                  </p>
                  <p className="text-secondary">{selectedBook.synopsis}</p>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás segura/o que deseas eliminar el libro "
          <strong>{bookToDelete?.title}</strong>"?
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

export default Books;
