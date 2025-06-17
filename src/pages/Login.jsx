// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Credenciales incorrectas");

      const data = await res.json();
      alert("Inicio de sesión exitoso");
      navigate("/");
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 w-100"
      style={{
        backgroundColor: "#D5FAFC",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3
          className="text-center mb-4"
          style={{ color: "#1DB5BE", fontWeight: 600 }}
        >
          Accede a tu cuenta
        </h3>

        <div className="mb-3">
          <label className="form-label fw-semibold">Correo electrónico:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-semibold">Contraseña:</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3 text-end">
          <Link
            to="#"
            style={{
              color: "#1DB5BE",
              fontSize: "0.9rem",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            ¿Olvidaste la contraseña?
          </Link>
        </div>

        <button
          type="submit"
          className="btn w-100 fw-semibold"
          style={{ backgroundColor: "#1DB5BE", color: "#000" }}
        >
          Iniciar sesión
        </button>

        <p className="text-center mt-3" style={{ fontWeight: 500 }}>
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            style={{
              color: "#1DB5BE",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
