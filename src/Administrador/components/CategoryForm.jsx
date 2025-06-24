import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const CategoryForm = ({ onSuccess, onCancel, categoryToEdit }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (categoryToEdit) {
      setName(categoryToEdit.name);
    }
  }, [categoryToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    const method = categoryToEdit ? "PUT" : "POST";
    const url = categoryToEdit
      ? `${API}/categories/${categoryToEdit.id}`
      : `${API}/categories`;

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
        console.error("Error al guardar categoría");
      }
    } catch (err) {
      console.error("Error de red:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 bg-white p-4 rounded shadow-sm border"
      style={{ borderColor: "#10274C" }}
    >
      <h5 style={{ color: "#10274C" }}>
        {categoryToEdit ? "✏️ Editar Categoría" : "➕ Nueva Categoría"}
      </h5>
      <input
        className="form-control"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Nombre de la categoría"
      />
      <div className="mt-3">
        <button className="btn btn-success me-2" type="submit">
          {categoryToEdit ? "Actualizar" : "Crear"}
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

export default CategoryForm;
