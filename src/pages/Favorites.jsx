import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Favorites.css";

export function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [expanded, setExpanded] = useState({}); // Para controlar sinopsis expandida
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener favoritos");

        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error al obtener favoritos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const eliminarFavorito = (bookId) => {
    fetch(`${API_URL}/favorites/${bookId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo eliminar el libro");
        return res.json();
      })
      .then(() => {
        setFavorites((prev) => prev.filter((b) => b.id !== bookId));
        setModalMessage("📕 Libro eliminado de tus favoritos.");
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2500);
      })
      .catch((err) => console.error(err));
  };

  const mostrarMas = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const toggleExpand = (bookId) => {
    setExpanded((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  if (loading) {
    return (
      <div className="text-center my-5">Cargando tus libros favoritos...</div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-title text-center mb-4">
        <h2 className="fw-bold display-6">📚 Mis Libros Favoritos</h2>
        <p className="subtitle text-muted">
          Tu colección especial de lecturas mágicas
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center my-5">
          No tienes libros favoritos aún 😢
        </div>
      ) : (
        <div className="favorites-list container px-3">
          {favorites.slice(0, visibleCount).map((book) => (
            <div
              className={`favorite-card card shadow-sm mb-4 mx-auto ${
                expanded[book.id] ? "expanded" : ""
              }`}
              key={book.id}
            >
              <div className="d-flex gap-3">
                {/* Portada */}
                <img
                  src={book.cover_image_url || "/books/default.webp"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/books/default.webp";
                  }}
                  className="portada-fav"
                  alt={book.title}
                  onClick={() => navigate(`/books/${book.id}`)}
                />

                {/* Info */}
                <div className="flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="fw-semibold">{book.title}</h5>
                    <p className="mb-1 text-muted">
                      {book.year || "¿Año?"} · {book.pages || "¿?"} páginas
                    </p>
                    <p className="mb-2 text-muted">
                      Editorial: {book.publisher || "Desconocida"}
                    </p>

                    <p className="sinopsis-preview">
                      {expanded[book.id]
                        ? book.synopsis
                        : book.synopsis?.substring(0, 150) +
                          (book.synopsis?.length > 150 ? "..." : "")}
                    </p>

                    {book.synopsis?.length > 150 && (
                      <button
                        className="btn btn-link p-0"
                        onClick={() => toggleExpand(book.id)}
                        style={{ fontSize: "0.9rem" }}
                      >
                        {expanded[book.id] ? "Ver menos ▲" : "Ver más ▼"}
                      </button>
                    )}
                  </div>

                  <div className="mt-3 d-flex gap-2">
                    <button
                      className="btn btn-ver"
                      onClick={() => navigate(`/books/${book.id}`)}
                    >
                      Ver
                    </button>
                    <button
                      className="btn btn-eliminar"
                      onClick={() => eliminarFavorito(book.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleCount < favorites.length && (
        <div className="text-center mt-4">
          <button className="btn btn-outline-secondary" onClick={mostrarMas}>
            Ver más
          </button>
        </div>
      )}

      <Modal show={showModal} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center p-4">
          <i
            className="bi bi-info-circle-fill"
            style={{ fontSize: "3rem", color: "#1DB5BE" }}
          ></i>
          <p className="mt-3 fw-semibold" style={{ whiteSpace: "pre-line" }}>
            {modalMessage}
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Favorites;
