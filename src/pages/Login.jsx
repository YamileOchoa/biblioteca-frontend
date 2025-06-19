import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      localStorage.setItem("token", data.token);

      const userRes = await fetch("http://127.0.0.1:8000/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
          Accept: "application/json",
        },
      });

      const userData = await userRes.json();
      localStorage.setItem("user", JSON.stringify(userData));

      window.dispatchEvent(new Event("login"));

      setShowModal(true);
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <>
      <div
        className="d-flex align-items-center justify-content-center w-100"
        style={{
          backgroundColor: "#D5FAFC",
          fontFamily: "Montserrat, sans-serif",
          minHeight: "calc(100vh - 300px)",
          paddingTop: "40px",
          paddingBottom: "40px",
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
            <label className="form-label fw-semibold">
              Correo electrónico:
            </label>
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
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control pe-5"
                value={form.password}
                onChange={handleChange}
                required
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#666",
                }}
              ></i>
            </div>
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

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="text-center p-4">
          <i
            className="bi bi-check-circle-fill"
            style={{ fontSize: "3rem", color: "#1DB5BE" }}
          ></i>
          <h4 className="mt-3 fw-bold">Has iniciado sesión correctamente</h4>
          <p className="mt-2">
            Explora libremente nuestra colección de libros y recursos
            disponibles.
          </p>
          <Button
            onClick={handleClose}
            style={{
              backgroundColor: "#1DB5BE",
              color: "#000",
              border: "none",
            }}
            className="fw-semibold mt-2 px-4"
          >
            INICIO
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Login;
