import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

const CategoryForm = ({ onSuccess, onCancel, categoryToEdit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    if (categoryToEdit) {
      setName(categoryToEdit.name || "");
      setDescription(categoryToEdit.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [categoryToEdit]);

  const checkDuplicate = async () => {
    try {
      const res = await fetch(`${API}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const categories = await res.json();
        const found = categories.find(
          (c) =>
            c.name.toLowerCase().trim() === name.toLowerCase().trim() &&
            (!categoryToEdit || c.id !== categoryToEdit.id)
        );
        return !!found;
      }
    } catch (err) {
      console.error("Error verificando duplicados:", err);
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    const isDuplicate = await checkDuplicate();
    if (isDuplicate) {
      setShowDuplicateModal(true);
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
        body: JSON.stringify({ name, description }),
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
        <h4 className="mb-3" style={{ color: "#10274C" }}>
          {categoryToEdit ? "Editar Categoría" : "Nueva Categoría"}
        </h4>

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nombre de la categoría"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe brevemente la categoría"
            rows={4}
          ></textarea>
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
            {categoryToEdit ? "Actualizar" : "Crear"}
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
        centered
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#1F3A63", color: "#fff" }}
        >
          <Modal.Title>Categoría duplicada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ya existe una categoría registrada con ese nombre. Por favor verifica
          antes de continuar.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDuplicateModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CategoryForm;
