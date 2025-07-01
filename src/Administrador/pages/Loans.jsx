import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [booksMap, setBooksMap] = useState({});
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [deleteLoanId, setDeleteLoanId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchLoans = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const [loansRes, usersRes, booksRes] = await Promise.all([
        fetch(`${API}/loans`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
        fetch(`${API}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
        fetch(`${API}/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
      ]);

      if ([loansRes, usersRes, booksRes].some((res) => res.status === 401)) {
        navigate("/login");
        return;
      }

      const loansData = await loansRes.json();
      const usersData = await usersRes.json();
      const booksData = await booksRes.json();

      const users = {};
      usersData.forEach((u) => (users[u.id] = u.name));

      const books = {};
      booksData.forEach((b) => (books[b.id] = b.title));

      setUsersMap(users);
      setBooksMap(books);
      setLoans(loansData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleMarkReturned = async (loan) => {
    try {
      const res = await fetch(`${API}/loans/${loan.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_date: new Date().toISOString().split("T")[0],
        }),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.ok) {
        fetchLoans();
        setMensaje("📘 Préstamo marcado como devuelto.");
        setTimeout(() => setMensaje(""), 3000);
      } else {
        alert("Error al marcar como devuelto.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/loans/${deleteLoanId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        fetchLoans();
        setDeleteLoanId(null);
      } else if (res.status === 401) navigate("/login");
    } catch (err) {
      console.error("Error al eliminar préstamo:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;

    try {
      const res = await fetch(`${API}/loans/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setSearchResult(data);
        setCurrentPage(1);
      } else {
        setSearchResult(null);
        alert("Préstamo no encontrado.");
      }
    } catch (err) {
      console.error("Error al buscar préstamo:", err);
    }
  };

  const handleClearSearch = () => {
    setSearchId("");
    setSearchResult(null);
    setCurrentPage(1);
  };

  const paginatedLoans = searchResult
    ? [searchResult]
    : loans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(loans.length / itemsPerPage);

  return (
    <div
      style={{
        backgroundColor: "#F2F7FF",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: "#10274C", fontWeight: "600", marginBottom: "2rem" }}>
        Gestión de Préstamos
      </h2>

      {mensaje && (
        <div className="alert alert-success text-center">{mensaje}</div>
      )}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
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
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead style={{ backgroundColor: "#eaf1ff", color: "#10274C" }}>
            <tr className="text-center">
              <th>ID</th>
              <th>Usuario</th>
              <th>Libro</th>
              <th>Fecha Préstamo</th>
              <th>Fecha Devolución</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLoans.map((loan) => (
              <tr key={loan.id} className="text-center align-middle">
                <td>{loan.id}</td>
                <td>{usersMap[loan.user_id] || `ID ${loan.user_id}`}</td>
                <td>{booksMap[loan.book_id] || `ID ${loan.book_id}`}</td>
                <td>{loan.loan_date}</td>
                <td>
                  {loan.return_date || (
                    <span className="text-muted">Pendiente</span>
                  )}
                </td>
                <td>{loan.status}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    {loan.status === "aprobado" && !loan.return_date && (
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "#198754",
                          color: "#fff",
                          fontWeight: "500",
                        }}
                        onClick={() => handleMarkReturned(loan)}
                      >
                        Marcar Devuelto
                      </button>
                    )}
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#DC3545",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      onClick={() => setDeleteLoanId(loan.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!searchResult && loans.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay préstamos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!searchResult && totalPages > 1 && (
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
        show={deleteLoanId !== null}
        onHide={() => setDeleteLoanId(null)}
        centered
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1F3A63", color: "white" }}
        >
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este préstamo?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteLoanId(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
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

export default Loans;
