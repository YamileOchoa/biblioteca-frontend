import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../styles/BookSection.css";

const BooksSection = ({
  title = "NOVEDADES LITERARIAS QUE NO TE PUEDES PERDER",
  ads = [],
  limit = 12,
}) => {
  const [books, setBooks] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/books/available`)
      .then((res) => {
        if (!res.ok) throw new Error("Error HTTP: " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Libros desde la API:", data);
        setBooks(data.slice(0, limit));
      })
      .catch((err) => console.error("Error al obtener libros:", err));
  }, []);

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
              <div className="favorite-icon">
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
                <Card.Img
                  variant="top"
                  src={
                    book.cover_image_url
                      ? book.cover_image_url
                      : `/books/card${book.id}.webp?${Date.now()}`
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/books/sin-portada.webp";
                  }}
                  className="book-cover"
                />
              </div>

              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="book-title">{book.title}</Card.Title>
                  <Card.Text className="book-info">
                    <strong>Autor:</strong> {book.author?.name || "Desconocido"}
                    <br />
                    <strong>Stock:</strong> {book.stock}
                  </Card.Text>
                </div>
                <Button
                  className="ver-button mt-auto"
                  onClick={() => (window.location.href = `/books/${book.id}`)}
                  style={{
                    backgroundColor: "#1DB5BE",
                    borderRadius: "10px",
                    border: "none",
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
    </Container>
  );
};

export default BooksSection;
