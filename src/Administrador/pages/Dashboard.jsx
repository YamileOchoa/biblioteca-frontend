import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    Promise.all([
      fetch(`${API}/books`, { headers }),
      fetch(`${API}/users`, { headers }),
      fetch(`${API}/loans`, { headers }),
    ])
      .then(async ([booksRes, usersRes, loansRes]) => {
        if ([booksRes, usersRes, loansRes].some((r) => r.status === 401)) {
          navigate("/login");
          return;
        }

        const [booksData, usersData, loansData] = await Promise.all([
          booksRes.json(),
          usersRes.json(),
          loansRes.json(),
        ]);

        setBooks(booksData);
        setUsers(usersData);
        setLoans(loansData);
      })
      .catch((err) =>
        console.error("Error cargando datos del dashboard:", err)
      );
  }, []);

  const totalBooks = books.length;
  const totalUsers = users.length;
  const activeLoans = loans.filter((l) => l.status === "aprobado").length;
  const noStock = books.filter((b) => b.stock <= 0).length;

  const loansByMonth = {};
  loans.forEach((loan) => {
    const month = new Date(loan.loan_date).toLocaleString("default", {
      month: "short",
    });
    loansByMonth[month] = (loansByMonth[month] || 0) + 1;
  });

  const chartData = Object.keys(loansByMonth).map((month) => ({
    name: month,
    préstamos: loansByMonth[month],
  }));

  const latestLoans = [...loans]
    .sort((a, b) => new Date(b.loan_date) - new Date(a.loan_date))
    .slice(0, 5);

  return (
    <div
      style={{
        backgroundColor: "#F2F7FF",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2
        style={{ color: "#10274C", fontWeight: "bold", marginBottom: "2rem" }}
      >
        📊 Panel de Administración
      </h2>

      {/* Tarjetas */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div style={cardStyle("#10274C", "#1F3A63")}>
            <h5>📚 Libros</h5>
            <p className="fs-3 fw-bold">{totalBooks}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div style={cardStyle("#1F3A63", "#36598C")}>
            <h5>👥 Usuarios</h5>
            <p className="fs-3 fw-bold">{totalUsers}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div style={cardStyle("#1F3A63", "#5482B4")}>
            <h5>📄 Préstamos activos</h5>
            <p className="fs-3 fw-bold">{activeLoans}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div style={cardStyle("#8B0000", "#B22222")}>
            <h5>🛑 Sin stock</h5>
            <p className="fs-3 fw-bold">{noStock}</p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="mb-5">
        <h4 style={{ color: "#10274C" }}>📈 Préstamos por mes</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="préstamos" fill="#1F3A63" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Últimos préstamos */}
      <div>
        <h4 style={{ color: "#10274C" }}>📋 Últimos préstamos</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-striped mt-3">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Libro</th>
                <th>Fecha de préstamo</th>
              </tr>
            </thead>
            <tbody>
              {latestLoans.map((loan, index) => {
                const user = users.find((u) => u.id === loan.user_id);
                const book = books.find((b) => b.id === loan.book_id);
                return (
                  <tr key={loan.id}>
                    <td>{index + 1}</td>
                    <td>{user?.name || "Desconocido"}</td>
                    <td>{book?.title || "Desconocido"}</td>
                    <td>{loan.loan_date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const cardStyle = (fromColor, toColor) => ({
  background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
  color: "white",
  borderRadius: "12px",
  padding: "1.5rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  height: "100%",
});

export default Dashboard;
