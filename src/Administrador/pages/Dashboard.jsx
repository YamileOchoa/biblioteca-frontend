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
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

  const getMonthlyData = (list, dateKey) => {
    const data = {};
    list.forEach((item) => {
      const month = new Date(item[dateKey]).toLocaleString("default", {
        month: "short",
      });
      data[month] = (data[month] || 0) + 1;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  };

  const getWeeklyData = (list, dateKey) => {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const data = {};
    list.forEach((item) => {
      const date = new Date(item[dateKey]);
      const dayName = days[date.getDay()];
      data[dayName] = (data[dayName] || 0) + 1;
    });

    return days
      .filter((day) => data[day])
      .map((day) => ({ name: day, value: data[day] }));
  };

  const loansChart = getMonthlyData(loans, "loan_date");
  const usersChart = getWeeklyData(users, "created_at");

  const latestLoans = [...loans]
    .sort((a, b) => new Date(b.loan_date) - new Date(a.loan_date))
    .slice(0, 5);

  const today = new Date().toISOString().split("T")[0];
  const todayUsers = users.filter((u) =>
    u.created_at?.startsWith(today)
  ).length;
  const todayLoans = loans.filter((l) => l.loan_date?.startsWith(today)).length;
  const todayReturns = loans.filter((l) =>
    l.return_date?.startsWith(today)
  ).length;

  const lowStockCount = books.filter((b) => b.stock <= 2).length;
  const lowStockPercent =
    totalBooks > 0 ? Math.round((lowStockCount / totalBooks) * 100) : 0;

  return (
    <div
      style={{
        backgroundColor: "#F2F7FF",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: "#10274C", fontWeight: "600", marginBottom: "2rem" }}>
        Panel de Administración
      </h2>

      <div className="container-fluid py-4">
        <div className="row g-4 mb-4">
          {[
            { label: "Libros", value: totalBooks },
            { label: "Usuarios", value: totalUsers },
            { label: "Préstamos activos", value: activeLoans },
            { label: "Sin stock", value: noStock },
          ].map(({ label, value }, i) => (
            <div key={i} className="col-6 col-md-3">
              <div style={cardStyle(i)}>
                <h6 className="mb-1">{label}</h6>
                <p className="fs-3 fw-bold m-0">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-lg-9">
            <div className="row g-4 mb-4">
              <div className="col-lg-6">
                <div className="bg-white rounded shadow-sm p-3">
                  <h5 className="mb-3" style={{ color: "#10274C" }}>
                    Préstamos por mes
                  </h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={loansChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#1F3A63"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="bg-white rounded shadow-sm p-3">
                  <h5 className="mb-3" style={{ color: "#10274C" }}>
                    Usuarios registrados por día
                  </h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={usersChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#36598C"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h5 className="mb-3" style={{ color: "#10274C" }}>
                Últimos préstamos
              </h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped">
                  <thead
                    style={{ backgroundColor: "#eaf1ff", color: "#10274C" }}
                  >
                    <tr>
                      <th>#</th>
                      <th>Usuario</th>
                      <th>Libro</th>
                      <th>Fecha de préstamo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestLoans.map((loan, i) => {
                      const user = users.find((u) => u.id === loan.user_id);
                      const book = books.find((b) => b.id === loan.book_id);
                      return (
                        <tr key={loan.id}>
                          <td>{i + 1}</td>
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

            <div className="bg-white rounded shadow-sm p-4">
              <h5 className="mb-4" style={{ color: "#10274C" }}>
                Resumen del día
              </h5>
              <div className="row text-center">
                <div className="col-6 col-md-3">
                  <p className="mb-1 text-muted">Usuarios hoy</p>
                  <h4 className="fw-bold">{todayUsers}</h4>
                </div>
                <div className="col-6 col-md-3">
                  <p className="mb-1 text-muted">Préstamos hoy</p>
                  <h4 className="fw-bold">{todayLoans}</h4>
                </div>
                <div className="col-6 col-md-3">
                  <p className="mb-1 text-muted">Devoluciones hoy</p>
                  <h4 className="fw-bold">{todayReturns}</h4>
                </div>
                <div className="col-6 col-md-3">
                  <p className="mb-1 text-muted">Stock bajo (%)</p>
                  <h4 className="fw-bold">{lowStockPercent}%</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="bg-white rounded shadow-sm p-4 h-100 d-flex flex-column justify-content-around">
              <h5 className="mb-4 text-center" style={{ color: "#10274C" }}>
                Indicadores de hoy
              </h5>
              {[
                { label: "Usuarios hoy", value: todayUsers },
                { label: "Préstamos hoy", value: todayLoans },
                { label: "Stock bajo", value: lowStockPercent + "%" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="mb-4 text-center"
                  style={{ width: "70%", margin: "0 auto" }}
                >
                  <CircularProgressbar
                    value={
                      typeof item.value === "number"
                        ? item.value
                        : parseInt(item.value)
                    }
                    text={`${item.value}`}
                    styles={buildStyles({
                      textSize: "16px",
                      textColor: "#10274C",
                      pathColor: "#1F3A63",
                      trailColor: "#eaf1ff",
                    })}
                  />
                  <p className="mt-2 text-muted" style={{ fontSize: "14px" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const cardStyle = (index) => {
  const colors = [
    ["#10274C", "#1F3A63"],
    ["#1F3A63", "#36598C"],
    ["#36598C", "#5482B4"],
    ["#6A7BA2", "#9CB2D9"],
  ];
  const [from, to] = colors[index];
  return {
    background: `linear-gradient(135deg, ${from}, ${to})`,
    color: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    height: "100%",
  };
};

export default Dashboard;
