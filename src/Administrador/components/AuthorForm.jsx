import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const AuthorForm = ({ onSuccess, onCancel, authorToEdit }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (authorToEdit) {
      setName(authorToEdit.name);
    } else {
      setName("");
    }
  }, [authorToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    const method = authorToEdit ? "PUT" : "POST";
    const url = authorToEdit
      ? `${API}/authors/${authorToEdit.id}`
      : `${API}/authors`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.ok) {
        onSuccess();
      } else {
        console.error("Error al guardar autor");
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 bg-white p-4 rounded shadow-sm border"
      style={{ borderColor: "#10274C" }}
    >
      <h5 style={{ color: "#10274C" }}>
        {authorToEdit ? "✏️ Editar Autor" : "➕ Nuevo Autor"}
      </h5>
      <input
        className="form-control"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Nombre del autor"
      />
      <div className="mt-3">
        <button className="btn btn-success me-2" type="submit">
          {authorToEdit ? "Actualizar" : "Crear"}
        </button>
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AuthorForm;
