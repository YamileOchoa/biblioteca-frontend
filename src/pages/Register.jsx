import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
          password_confirmation: form.password_confirmation,
          role: "lector",
        }),
      });

      if (response.ok) {
        setShowSuccessModal(true);
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
    <>
      <div
        className="d-flex align-items-center justify-content-center w-100"
        style={{
          backgroundColor: "#D5FAFC",
          fontFamily: "Montserrat, sans-serif",
          minHeight: "calc(100vh - 150px)",
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
            Crea tu cuenta
          </h3>

          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre completo:</label>
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

          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Contraseña:</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
            <i
              className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              style={{
                position: "absolute",
                top: "36px",
                right: "10px",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <div className="mb-4 position-relative">
            <label className="form-label fw-semibold">
              Confirmar contraseña:
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirmation"
              className="form-control"
              value={form.password_confirmation}
              onChange={handleChange}
              required
            />
            <i
              className={`bi ${
                showConfirmPassword ? "bi-eye-slash" : "bi-eye"
              }`}
              style={{
                position: "absolute",
                top: "36px",
                right: "10px",
                cursor: "pointer",
              }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            ></i>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold"
            style={{ backgroundColor: "#1DB5BE", color: "#000" }}
          >
            Registrarse
          </button>

          <p className="text-center mt-3">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              style={{
                color: "#1DB5BE",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>

      {showSuccessModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
          }}
        >
          <div
            className="bg-white rounded p-4 text-center shadow"
            style={{ width: "90%", maxWidth: "400px" }}
          >
            <i
              className="bi bi-check-circle-fill mb-3"
              style={{ fontSize: "3rem", color: "#1DB5BE" }}
            ></i>
            <h5 className="fw-bold mb-2">¡Registro exitoso!</h5>
            <p className="mb-4">
              Tu cuenta ha sido creada correctamente. Ahora puedes iniciar
              sesión para acceder a la plataforma.
            </p>
            <button
              className="btn fw-semibold"
              style={{ backgroundColor: "#1DB5BE", color: "#000" }}
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/login");
              }}
            >
              CLICK AQUÍ
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
