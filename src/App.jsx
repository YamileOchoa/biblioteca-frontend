import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import BookDetail from "./pages/BookDetail";
import PrivateRoute from "./components/ProtectedRoute";
import AllBooks from "./pages/AllBooks";
import MyLoans from "./pages/MyLoans";

// Admin
import AdminLayout from "./Administrador/layouts/AdminLayout";
import Dashboard from "./Administrador/pages/Dashboard";
import Users from "./Administrador/pages/Users";
import Books from "./Administrador/pages/Books";
import Authors from "./Administrador/pages/Authors";
import Categories from "./Administrador/pages/Categories";
import Loans from "./Administrador/pages/Loans";

function App() {
  const { user, checkingAuth } = useContext(AuthContext);

  if (checkingAuth && window.location.pathname.startsWith("/admin")) {
    return <p className="text-center mt-5">Verificando sesión...</p>;
  }

  return (
    <Routes>
      {/* Layout público */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/libros" element={<AllBooks />} />
        <Route path="/mis-prestamos" element={<MyLoans />} />
      </Route>

      {/* Layout admin protegido */}
      <Route element={<PrivateRoute role="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="authors" element={<Authors />} />
          <Route path="categories" element={<Categories />} />
          <Route path="users" element={<Users />} />
          <Route path="loans" element={<Loans />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
