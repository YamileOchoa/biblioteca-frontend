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
              className="favorite-card card shadow-sm mb-4 p-3 mx-auto"
              key={book.id}
              style={{
                maxWidth: "600px",
                borderRadius: "1rem",
                transition: "transform 0.3s ease",
              }}
            >
              <div className="d-flex justify-content-between">
                {/* Portada */}
                <img
                  src={
                    book.cover_image_url ||
                    `/books/card${book.id}.webp?${Date.now()}`
                  }
                  alt={book.title}
                  style={{
                    width: "90px",
                    height: "135px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/books/sin-portada.webp";
                  }}
                />

                <div className="flex-grow-1 ms-3 me-3">
                  <h5 className="fw-semibold">{book.title}</h5>
                  <p className="mb-1 text-muted">
                    {book.year || "¿Año?"} · {book.pages || "¿?"} páginas
                  </p>
                  <p
                    className="text-truncate mb-2"
                    style={{ maxWidth: "100%", color: "#444" }}
                  >
                    {book.synopsis || "Sin sinopsis disponible..."}
                  </p>
                </div>

                <div className="d-flex flex-column align-items-end justify-content-center">
                  <button
                    className="btn btn-ver mb-2"
                    style={{ minWidth: "100px" }}
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    Ver
                  </button>
                  <button
                    className="btn btn-eliminar"
                    style={{ minWidth: "100px" }}
                    onClick={() => eliminarFavorito(book.id)}
                  >
                    Eliminar
                  </button>
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
