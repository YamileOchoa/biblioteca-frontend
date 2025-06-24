// src/admin/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Libros", path: "/admin/books" },
    { name: "Autores", path: "/admin/authors" },
    { name: "Categorías", path: "/admin/categories" },
    { name: "Usuarios", path: "/admin/users" },
    { name: "Préstamos", path: "/admin/loans" },
  ];

  return (
    <div
      style={{
        width: "240px",
        backgroundColor: "#10274C",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        position: "sticky",
        top: 0,
      }}
    >
      <h3 className="mb-4 text-white">📚 Admin Panel</h3>
      <ul className="nav flex-column">
        {menu.map((item) => (
          <li className="nav-item mb-2" key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link text-white ${
                  isActive ? "fw-bold bg-primary bg-opacity-25" : ""
                }`
              }
              style={{
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "4px",
              }}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
