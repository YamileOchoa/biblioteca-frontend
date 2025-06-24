import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const BookForm = ({ onSuccess, onCancel, bookToEdit }) => {
  const [form, setForm] = useState({
    title: "",
    isbn: "",
    year: "",
    author_id: "",
    category_id: "",
    synopsis: "",
    pages: "",
    publisher: "",
    stock: "",
    cover_image: "",
  });

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API}/authors`)
      .then((res) => res.json())
      .then(setAuthors)
      .catch(console.error);

    fetch(`${API}/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (bookToEdit) {
      setForm(bookToEdit);
    }
  }, [bookToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    const method = bookToEdit ? "PUT" : "POST";
    const url = bookToEdit ? `${API}/books/${bookToEdit.id}` : `${API}/books`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.ok) {
        onSuccess();
      } else {
        console.error("Error al guardar libro");
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 bg-white p-4 rounded shadow-sm border border-2"
      style={{ borderColor: "#10274C" }}
    >
      <h4 className="mb-3" style={{ color: "#10274C" }}>
        {bookToEdit ? "✏️ Editar Libro" : "➕ Nuevo Libro"}
      </h4>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Título</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">ISBN</label>
          <input
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Año</label>
          <input
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Autor</label>
          <select
            name="author_id"
            value={form.author_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Categoría</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Seleccione</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Editorial</label>
          <input
            name="publisher"
            value={form.publisher}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Páginas</label>
          <input
            name="pages"
            value={form.pages}
            onChange={handleChange}
            className="form-control"
            type="number"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Stock</label>
          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="form-control"
            type="number"
          />
        </div>
        <div className="col-12">
          <label className="form-label">Sinopsis</label>
          <textarea
            name="synopsis"
            value={form.synopsis}
            onChange={handleChange}
            className="form-control"
            rows="3"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Nombre del archivo de portada</label>
          <input
            name="cover_image"
            value={form.cover_image}
            onChange={handleChange}
            className="form-control"
            placeholder="Ej: card12.webp"
            required
          />
        </div>
        <div className="col-md-6 d-flex align-items-end">
          {form.cover_image && (
            <img
              src={`/books/${form.cover_image}`}
              alt="preview"
              style={{
                width: "90px",
                height: "130px",
                objectFit: "cover",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          )}
        </div>
      </div>

      <div className="mt-4">
        <button type="submit" className="btn btn-success me-2">
          {bookToEdit ? "Actualizar" : "Crear"}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default BookForm;
