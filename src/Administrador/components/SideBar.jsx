import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaThLarge,
  FaUser,
  FaSignOutAlt,
  FaUserFriends,
  FaTags,
  FaList,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <FaThLarge /> },
    { name: "Libros", path: "/admin/books", icon: <FaBook /> },
    { name: "Autores", path: "/admin/authors", icon: <FaUser /> },
    { name: "Categorías", path: "/admin/categories", icon: <FaTags /> },
    { name: "Usuarios", path: "/admin/users", icon: <FaUserFriends /> },
    { name: "Préstamos", path: "/admin/loans", icon: <FaList /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      style={{
        width: "240px",
        backgroundColor: "#10274C",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
      }}
    >
      <div>
        <div className="text-center mb-4">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "150px", height: "auto", objectFit: "contain" }}
          />
        </div>

        <ul className="nav flex-column">
          {menu.map((item) => (
            <li className="nav-item" key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link text-white d-flex align-items-center gap-2 py-2 ${
                    isActive ? "fw-bold bg-white bg-opacity-10 rounded" : ""
                  }`
                }
                style={{ textDecoration: "none" }}
              >
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                {item.name}
              </NavLink>
              <hr style={{ borderColor: "#ffffff33", margin: "4px 0" }} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-top border-white border-opacity-25">
        <button
          onClick={handleLogout}
          className="btn text-white w-100 d-flex align-items-center gap-2 justify-content-center"
          style={{ backgroundColor: "transparent", border: "none" }}
        >
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
