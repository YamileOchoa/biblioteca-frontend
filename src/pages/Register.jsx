// src/pages/Register.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password, // mismo valor por ahora
          role: "lector",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Registro exitoso 🎉");
        console.log("Token:", data.token);
      } else if (response.status === 422) {
        const error = await response.json();
        alert("Error de validación: " + JSON.stringify(error.errors));
      } else {
        alert("Algo salió mal al registrar");
      }
    } catch (error) {
      console.error(error);
      alert("Error en la conexión con el servidor");
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
          className="text-center mb-4 font-semibold"
          style={{ color: "#1DB5BE" }}
        >
          Crea tu cuenta
        </h3>

        {/* campos */}
        <div className="mb-3">
          <label className="form-label">Nombre completo:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico:</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn w-100"
          style={{ backgroundColor: "#1DB5BE", color: "#000" }}
        >
          Registrarse
        </button>

        <p className="text-center mt-3">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            style={{ color: "#1DB5BE", textDecoration: "none" }}
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
