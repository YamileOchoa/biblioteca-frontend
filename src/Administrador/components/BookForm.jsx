import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

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
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [continueCreation, setContinueCreation] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API}/authors`, { headers: authHeaders })
      .then((res) => res.json())
      .then(setAuthors)
      .catch(console.error);

    fetch(`${API}/categories`, { headers: authHeaders })
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

    if (!bookToEdit && !continueCreation) {
      try {
        const checkRes = await fetch(`${API}/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const allBooks = await checkRes.json();
        const existing = allBooks.find(
          (b) =>
            b.title.trim().toLowerCase() === form.title.trim().toLowerCase()
        );
        if (existing) {
          setShowDuplicateModal(true);
          return;
        }
      } catch (err) {
        console.error("Error verificando título duplicado:", err);
      }
    }

    const method = bookToEdit ? "POST" : "POST";
    const url = bookToEdit
      ? `${API}/books/${bookToEdit.id}?_method=PUT`
      : `${API}/books`;

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.ok) {
        onSuccess();
        const data = await res.json();
        console.log("Libro guardado:", data);
      } else {
        const errorData = await res.json();
        console.error("Error al guardar libro:", errorData);
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mb-4 bg-white p-4 rounded shadow-sm border border-2"
        style={{ borderColor: "#10274C" }}
      >
        <h4 className="mb-3" style={{ color: "#10274C", fontWeight: "600" }}>
          {bookToEdit ? "Editar Libro" : "Nuevo Libro"}
        </h4>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark">Título</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark">ISBN</label>
            <input
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold text-dark">Año</label>
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
            <label className="form-label fw-semibold text-dark">Autor</label>
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
            <label className="form-label fw-semibold text-dark">
              Categoría
            </label>
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
            <label className="form-label fw-semibold text-dark">
              Editorial
            </label>
            <input
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-dark">Páginas</label>
            <input
              name="pages"
              value={form.pages}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold text-dark">Stock</label>
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold text-dark">Sinopsis</label>
            <textarea
              name="synopsis"
              value={form.synopsis}
              onChange={handleChange}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold text-dark">
              Archivo de portada (imagen)
            </label>
            <input
              name="cover_image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  cover_image: e.target.files[0],
                }))
              }
              className="form-control"
              required={!bookToEdit}
            />
          </div>

          <div className="col-md-6 d-flex align-items-end">
            {form.cover_image && typeof form.cover_image === "object" && (
              <img
                src={URL.createObjectURL(form.cover_image)}
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
            {bookToEdit && !form.cover_image && bookToEdit.cover_image_url && (
              <img
                src={bookToEdit.cover_image_url}
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
          <button
            type="submit"
            className="btn me-2"
            style={{
              backgroundColor: "#1F3A63",
              color: "#fff",
              fontWeight: "500",
            }}
          >
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

      <Modal
        show={showDuplicateModal}
        onHide={() => setShowDuplicateModal(false)}
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1F3A63", color: "#fff" }}
        >
          <Modal.Title>Título Duplicado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ya existe un libro con ese título en el sistema. ¿Deseas crearlo de
          todas formas?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDuplicateModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowDuplicateModal(false);
              setContinueCreation(true);
              setTimeout(() => {
                document
                  .querySelector("form")
                  .dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true })
                  );
              }, 0);
            }}
          >
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookForm;
