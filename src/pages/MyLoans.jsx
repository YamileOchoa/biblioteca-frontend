import { useEffect, useState } from "react";
import { Modal, Card, Container, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
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

      const loanData = await loanRes.json();
      setLoans(loanData);

      const bookPromises = loanData.map((loan) =>
        fetch(`http://localhost:8000/api/books/${loan.book_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json())
      );

      const booksData = await Promise.all(bookPromises);
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching loans or books:", error);
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
          <p className="subtitle text-muted">Consulta tu historial completo</p>
        </div>

        {isLoggedIn && isLoading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-2 fw-semibold">Cargando préstamos...</p>
          </div>
        ) : isLoggedIn && loans.length === 0 ? (
          <div className="text-center my-5">
            No tienes préstamos registrados 😢
          </div>
        ) : (
          <Row className="favorites-list">
            {loans.map((loanItem, index) => (
              <Col key={loanItem.id} md={6} lg={4} className="mb-4">
                <Card className="shadow-sm h-100">
                  <Card.Body className="d-flex gap-3">
                    <img
                      src={
                        books[index]?.cover_image_url || "/books/default.webp"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/books/default.webp";
                      }}
                      alt={books[index]?.title}
                      className="portada-fav"
                      style={{ width: "100px", height: "auto" }}
                    />
                    <div>
                      <h5 className="fw-semibold">{books[index]?.title}</h5>
                      <p className="mb-1 text-muted">
                        <strong>Correo:</strong> {userEmail}
                      </p>
                      <p className="mb-1 text-muted">
                        <strong>Fecha de préstamo:</strong> {loanItem.loan_date}
                      </p>
                      <p className="mb-1 text-muted">
                        <strong>Estado:</strong>{" "}
                        <span
                          style={{
                            color: loanItem.return_date ? "green" : "#1DB5BE",
                            fontWeight: "600",
                          }}
                        >
                          {loanItem.return_date ? "Devuelto" : "Activo"}
                        </span>
                      </p>
                      {loanItem.return_date && (
                        <p className="mb-0 text-muted">
                          <strong>Fecha de devolución:</strong>{" "}
                          {loanItem.return_date}
                        </p>
                      )}
                    </div>
                  </Card.Body>
                </Card>
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
    </div>
  );
}

export default MyLoans;
