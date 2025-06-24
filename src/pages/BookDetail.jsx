import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/BookDetail.css";
import BooksSection from "../components/BooksSection";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/books/available`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener libros disponibles");
        return res.json();
      })
      .then((data) => {
        const found = data.find((b) => b.id === parseInt(id));
        setBook(found || false);
      })
      .catch((err) => {
        console.error("Error al obtener el libro:", err.message);
        setBook(false);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const solicitarPrestamo = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setModalMessage("Debes iniciar sesión para solicitar un préstamo.");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 2500);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/loans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al obtener préstamos");

      const loans = await res.json();
      const tienePrestamoActivo = loans.some(
        (loan) => loan.return_date === null
      );

      if (tienePrestamoActivo) {
        setModalMessage(
          "Ya tienes un préstamo activo. No puedes solicitar otro por ahora."
        );
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3500);
        return;
      }

      const postRes = await fetch(`${API_URL}/loans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book_id: book.id }),
      });

      if (!postRes.ok) throw new Error("Error al registrar el préstamo");

      setModalMessage(
        "Tu solicitud ha sido registrada con éxito. Será evaluada pronto.\n\nSerás redirigido al inicio en unos segundos."
      );
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/");
      }, 5000);
    } catch (error) {
      console.error("Error al procesar préstamo:", error);
      setModalMessage("Ocurrió un error inesperado al procesar tu solicitud.");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3500);
    }
  };

  const handleAgregarAFavoritos = async (
    bookId,
    setModalMessage,
    setShowModal,
    navigate
  ) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setModalMessage(
        "Debes acceder a tu cuenta para agregar libros a tu lista de favoritos."
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

  if (loading || book === null) {
    return <div className="text-center my-5">Cargando libro...</div>;
  }

  if (book === false) {
    return <div className="text-center my-5">Libro no encontrado 😢</div>;
  }

  return (
    <>
      <div className="book-detail-page">
        <div className="book-detail-bg">
          <div className="container book-detail-card">
            <div className="row justify-content-center">
              <div className="col-md-4 text-center">
                <img
                  src={
                    book.cover_image_url
                      ? book.cover_image_url
                      : `/books/card${book.id}.webp?${Date.now()}`
                  }
                  alt={book.title}
                  className="img-fluid rounded mb-4 book-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/books/sin-portada.webp";
                  }}
                />

                <div className="text-start px-3">
                  <div className="book-info-line">
                    <span>
                      <strong>ISBN:</strong>
                    </span>
                    <span>{book.isbn || "N/A"}</span>
                  </div>
                  <hr />
                  <div className="book-info-line">
                    <span>
                      <strong>Autor:</strong>
                    </span>
                    <span>{book.author?.name || "Desconocido"}</span>
                  </div>
                  <hr />
                  <div className="book-info-line">
                    <span>
                      <strong>Editorial:</strong>
                    </span>
                    <span>{book.editorial || "Desconocida"}</span>
                  </div>
                  <hr />
                  <div className="book-info-line">
                    <span>
                      <strong>Año de edición:</strong>
                    </span>
                    <span>{book.year || "N/A"}</span>
                  </div>
                  <hr />
                  <div className="book-info-line">
                    <span>
                      <strong>Páginas:</strong>
                    </span>
                    <span>{book.pages || "N/A"}</span>
                  </div>
                  <hr />
                </div>
              </div>

              <div className="col-md-8">
                <h2 className="fw-bold">{book.title}</h2>
                <p className="mb-4">
                  <span className="fw-semibold" style={{ color: "#1DB5BE" }}>
                    Por:
                  </span>{" "}
                  <strong>{book.author?.name || "Desconocido"}</strong>
                </p>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="quantity-box d-flex align-items-center border rounded">
                    <button className="btn btn-light" disabled>
                      -
                    </button>
                    <span className="px-3">1</span>
                    <button className="btn btn-light" disabled>
                      +
                    </button>
                  </div>

                  <button
                    className="btn btn-prestamo"
                    onClick={solicitarPrestamo}
                  >
                    SOLICITAR PRÉSTAMO
                  </button>
                </div>

                <div
                  className="d-flex align-items-center mb-4"
                  style={{ marginTop: "1rem", cursor: "pointer" }}
                  onClick={() =>
                    handleAgregarAFavoritos(
                      book.id,
                      setModalMessage,
                      setShowModal,
                      navigate
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="red"
                    className="me-2"
                  >
                    <path d="M1 8.475q0-2.35 1.575-3.912T6.5 3q1.3 0 2.475.55T11 5.1q.85-1 2.025-1.55T15.5 3q1.775 0 3.05.888t1.925 2.287q.175.375.025.763t-.525.562t-.763.025T18.65 7q-.45-1-1.325-1.5T15.5 5q-1.15 0-2.1.65t-1.65 1.6q-.125.2-.325.288T11 7.624t-.425-.1t-.325-.275q-.7-.95-1.65-1.6T6.5 5q-1.425 0-2.462.988T3 8.474q0 .825.35 1.675t1.25 1.963t2.45 2.6T11 18.3l2.225-1.95q.3-.275.7-.25t.675.3q.3.3.288.738t-.338.712l-2.225 1.975q-.275.25-.625.375t-.7.125t-.7-.125t-.625-.4q-1.125-1-2.612-2.275t-2.838-2.737t-2.287-3.063T1 8.475Z" />
                    <path d="M18 14h-2q-.425 0-.712-.288T15 13t.288-.712T16 12h2v-2q0-.425.288-.712T19 9t.713.288T20 10v2h2q.425 0 .713.288T23 13t-.288.713T22 14h-2v2q0 .425-.288.713T19 17t-.712-.288T18 16z" />
                  </svg>

                  <span className="fw-semibold">Agregar a mis favoritos</span>
                </div>

                <div style={{ marginTop: "2rem" }}>
                  <h5 className="sinopsis-title">Sinopsis:</h5>
                  <div className="sinopsis-text">
                    <p>
                      En un rincón olvidado del mundo, donde la magia era
                      considerada un mito y los antiguos textos yacían cubiertos
                      de polvo, un joven bibliotecario encuentra un manuscrito
                      sellado que cambiará su vida para siempre.
                    </p>
                    <p>
                      Lo que comienza como una simple curiosidad se convierte en
                      una carrera contrarreloj para descifrar secretos
                      milenarios, enfrentar criaturas de sombras y revivir un
                      poder que podría restaurar el equilibrio de un reino
                      dividido por el odio y la ambición.
                    </p>
                    <p>
                      Acompañado por una valiente cartógrafa y un misterioso
                      guardián del bosque, el protagonista recorrerá paisajes
                      épicos, enfrentará dilemas morales y descubrirá que el
                      verdadero poder no reside en lo que se hereda, sino en lo
                      que se elige proteger.
                    </p>
                    <p>
                      Esta historia épica te atrapará desde el primer capítulo y
                      te dejará reflexionando mucho después de haber leído la
                      última página.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BooksSection
        title="ARTÍCULOS RELACIONADOS"
        limit={6}
        ads={[
          "/src/assets/Img/anuncio4.webp",
          "/src/assets/Img/anuncio5.webp",
          "/src/assets/Img/anuncio6.webp",
        ]}
      />

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
    </>
  );
};

export default BookDetail;
