import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchLoans = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API}/loans`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
          return [];
        }
        return res.json();
      })
      .then(setLoans)
      .catch((err) => console.error("Error cargando préstamos", err));
  };

  useEffect(fetchLoans, []);

  const handleMarkReturned = async (id) => {
    const res = await fetch(`${API}/loans/${id}/return`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (res.ok) fetchLoans();
    else if (res.status === 401) navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este préstamo?")) return;

    const res = await fetch(`${API}/loans/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (res.ok) fetchLoans();
    else if (res.status === 401) navigate("/login");
  };

  return (
    <div
      style={{
        backgroundColor: "#F2F7FF",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: "#10274C", fontWeight: "bold" }}>📄 Préstamos</h2>

      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Usuario ID</th>
              <th>Libro ID</th>
              <th>Fecha Préstamo</th>
              <th>Fecha Devolución</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.user_id}</td>
                <td>{loan.book_id}</td>
                <td>{loan.loan_date}</td>
                <td>{loan.return_date || "Pendiente"}</td>
                <td>{loan.status}</td>
                <td>
                  {!loan.return_date && (
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleMarkReturned(loan.id)}
                    >
                      ✅ Devolver
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(loan.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loans;
