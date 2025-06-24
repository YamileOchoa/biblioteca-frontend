import { NavLink } from "react-router-dom";

const AdminHeader = () => {
  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#10274C" : "#444",
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
    padding: "0.5rem 1rem",
  });

  return (
    <header style={{ backgroundColor: "#10274C" }}>
      {/* Título */}
      <div className="text-center text-white py-3">
        <h1 className="fs-3 m-0">Backstage de la Biblioteca</h1>
      </div>

      {/* Navbar interna */}
      <nav
        style={{ backgroundColor: "white", borderTop: "1px solid #ccc" }}
        className="d-flex justify-content-center flex-wrap"
      >
        <NavLink to="/admin/books" style={navLinkStyle}>
          📚 Libros
        </NavLink>
        <NavLink to="/admin/categories" style={navLinkStyle}>
          🗃️ Categorías
        </NavLink>
        <NavLink to="/admin/users" style={navLinkStyle}>
          🙍‍♂️ Usuarios
        </NavLink>
        <NavLink to="/admin/requests" style={navLinkStyle}>
          📥 Solicitudes
        </NavLink>
        <NavLink to="/admin/loans" style={navLinkStyle}>
          🔁 Préstamos
        </NavLink>
      </nav>
    </header>
  );
};

export default AdminHeader;
