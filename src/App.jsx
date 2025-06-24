import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import MainLayout from "./layouts/MainLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import BookDetail from "./pages/BookDetail";
import PrivateRoute from "./components/ProtectedRoute";

// Admin
import AdminLayout from "./Administrador/layouts/AdminLayout";
import Dashboard from "./Administrador/pages/Dashboard";
import Users from "./Administrador/pages/Users";
import Books from "./Administrador/pages/Books";
import Authors from "./Administrador/pages/Authors";
import Categories from "./Administrador/pages/Categories";
import Loans from "./Administrador/pages/Loans";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true); // <- para evitar parpadeo

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCheckingAuth(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  if (checkingAuth)
    return <p className="text-center mt-5">Verificando sesión...</p>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout público */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={
              checkingAuth ? (
                <p className="text-center mt-5">Verificando sesión...</p>
              ) : user?.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : user ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            }
          />

          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/favoritos" element={<Favorites />} />
        </Route>

        {/* Layout administrador */}
        <Route element={<PrivateRoute user={user} role="admin" />}>
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
    </BrowserRouter>
  );
}

export default App;
