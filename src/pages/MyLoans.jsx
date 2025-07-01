import { useEffect, useState } from "react";
import { Modal, Card, Container, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MyLoans() {
  const [loan, setLoan] = useState(null);
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      setIsLoggedIn(false);
      setModalMessage(
        "Debes iniciar sesión para ver tus préstamos.\n\nSerás redirigido al inicio en unos segundos."
      );
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/login");
      }, 3500);
    } else {
      setIsLoggedIn(true);
      setUserEmail(user?.email || "");
      fetchLoanAndBook(token);
    }
  }, []);

  const fetchLoanAndBook = async (token) => {
    try {
      const loanRes = await fetch("http://localhost:8000/api/loans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const loans = await loanRes.json();
      const firstLoan = loans[0] || null;
      setLoan(firstLoan);

      if (firstLoan && firstLoan.book_id) {
        const bookRes = await fetch(
          `http://localhost:8000/api/books/${firstLoan.book_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const bookData = await bookRes.json();
        setBook(bookData);
      }
    } catch (error) {
      console.error("Error fetching loan or book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#D5FAFC",
        minHeight: "100vh",
        paddingTop: "3rem",
      }}
    >
      <Container>
        <div className="favorites-title text-center mb-4">
          <h2 className="fw-bold display-6">📖 Mis Préstamos</h2>
          <p className="subtitle text-muted">Consulta tu historial activo</p>
        </div>

        {isLoggedIn && isLoading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-2 fw-semibold">Cargando préstamo...</p>
          </div>
        ) : isLoggedIn && !loan ? (
          <div className="text-center my-5">No tienes préstamos activos 😢</div>
        ) : loan && book ? (
          <div className="favorites-list container px-3">
            <div
              className="favorite-card card shadow-sm mb-4 mx-auto"
              style={{
                maxWidth: "460px",
                width: "100%",
              }}
            >
              <div className="d-flex gap-3 align-items-start">
                <img
                  src={book.cover_image_url || "/books/default.webp"}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/books/default.webp";
                  }}
                  className="portada-fav"
                  alt={book.title}
                />

                <div className="flex-grow-1">
                  <h5 className="fw-semibold">{book.title}</h5>
                  <p className="mb-1 text-muted">
                    <strong>Correo:</strong> {userEmail}
                  </p>
                  <p className="mb-1 text-muted">
                    <strong>Fecha de préstamo:</strong> {loan.loan_date}
                  </p>
                  <p className="mb-1 text-muted">
                    <strong>Estado:</strong>{" "}
                    <span
                      style={{
                        color: loan.return_date ? "green" : "#1DB5BE",
                        fontWeight: "600",
                      }}
                    >
                      {loan.return_date ? "Devuelto" : "Activo"}
                    </span>
                  </p>
                  {loan.return_date && (
                    <p className="mb-0 text-muted">
                      <strong>Fecha de devolución:</strong> {loan.return_date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center">Cargando información del libro...</p>
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
    </div>
  );
}

export default MyLoans;
