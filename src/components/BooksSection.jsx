import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import "../styles/BookSection.css";

const BooksSection = ({ title, ads = [], limit = 12 }) => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const getCategoryFilter = () => {
    if (title.includes("LITERARIAS")) return ["Literatura"];
    if (title.includes("PERUANA")) return ["Narrativa peruana"];
    if (title.includes("COMICS")) return ["Cómics", "Mangas"];
    if (title.includes("SOÑAR")) return ["Juvenil", "Romance", "Fantasía"];
    return null;
  };

  useEffect(() => {
    fetch(`${API_URL}/books/available`)
      .then((res) => {
        if (!res.ok) throw new Error("Error HTTP: " + res.status);
        return res.json();
      })
      .then((data) => {
        const categoryFilters = getCategoryFilter();
        let filteredBooks = data;

        if (categoryFilters) {
          filteredBooks = data.filter((book) =>
            categoryFilters.some(
              (filter) =>
                book.category?.name?.toLowerCase() === filter.toLowerCase()
            )
          );
        }

        const maxBooks = title.includes("PERUANA") ? 6 : limit;
        setBooks(filteredBooks.slice(0, maxBooks));
      })
      .catch((err) => console.error("Error al obtener libros:", err));
  }, []);

  const handleAgregarAFavoritos = async (bookId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setModalMessage(
        "Debes acceder a tu cuenta para agregar libros a favoritos."
      );
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 3000);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book_id: bookId }),
      });

      if (!response.ok) throw new Error("No se pudo agregar a favoritos");

      setModalMessage("¡Libro agregado a tus favoritos!");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2500);
    } catch (error) {
      console.error("Error al agregar a favoritos:", error);
      setModalMessage("Ocurrió un error al agregar el libro a favoritos.");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2500);
    }
  };

  return (
    <Container className="my-5">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        <div className="section-line"></div>
      </div>

      <Row>
        {books.map((book) => (
          <Col xs={12} sm={6} md={4} lg={2} className="mb-4" key={book.id}>
            <Card className="book-card h-100 position-relative">
              <div
                className="favorite-icon"
                onClick={() => handleAgregarAFavoritos(book.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={25}
                  height={25}
                  viewBox="0 0 24 24"
                  fill="black"
                >
                  <path
                    fill="currentColor"
                    d="M1 8.475q0-2.35 1.575-3.912T6.5 3q1.3 0 2.475.55T11 5.1q.85-1 2.025-1.55T15.5 3q1.775 0 3.05.888t1.925 2.287q.175.375.025.763t-.525.562t-.763.025T18.65 7q-.45-1-1.325-1.5T15.5 5q-1.15 0-2.1.65t-1.65 1.6q-.125.2-.325.288T11 7.624t-.425-.1t-.325-.275q-.7-.95-1.65-1.6T6.5 5q-1.425 0-2.462.988T3 8.474q0 .825.35 1.675t1.25 1.963t2.45 2.6T11 18.3l2.225-1.95q.3-.275.7-.25t.675.3q.3.3.288.738t-.338.712l-2.225 1.975q-.275.25-.625.375t-.7.125t-.7-.125t-.625-.4q-1.125-1-2.612-2.275t-2.838-2.737t-2.287-3.063T1 8.475M18 14h-2q-.425 0-.712-.288T15 13t.288-.712T16 12h2v-2q0-.425.288-.712T19 9t.713.288T20 10v2h2q.425 0 .713.288T23 13t-.288.713T22 14h-2v2q0 .425-.288.713T19 17t-.712-.288T18 16z"
                  />
                </svg>
              </div>

              <div className="cover-wrapper">
                <img
                  src={book.cover_image_url || "/books/default.webp"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/books/default.webp";
                  }}
                  className="book-cover"
                  alt={book.title}
                />
              </div>

              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="book-title">{book.title}</Card.Title>
                  <Card.Text className="book-info d-flex flex-column">
                    <span className="book-author">
                      {book.author?.name || "Desconocido"}
                    </span>
                    <span className="book-stock">
                      Stock:{" "}
                      <span style={{ color: "#A08FE2", fontWeight: "bold" }}>
                        {book.stock > 0 ? book.stock : "Sin stock"}
                      </span>
                    </span>
                  </Card.Text>
                </div>

                <Button
                  className="ver-button mt-auto"
                  onClick={() => (window.location.href = `/books/${book.id}`)}
                  style={{
                    backgroundColor: "#1DB5BE",
                    borderRadius: "10px",
                    border: "none",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Ver
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {ads.length > 0 && (
        <Row className="anuncio-container mt-4">
          {ads.map((src, index) => (
            <Col key={index} md={12 / ads.length}>
              <img
                src={src}
                alt={`Anuncio ${index + 1}`}
                className="img-fluid anuncio-img w-100"
              />
            </Col>
          ))}
        </Row>
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
    </Container>
  );
};

export default BooksSection;
