import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

const AuthorForm = ({ onSuccess, onCancel, authorToEdit }) => {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (authorToEdit) {
      setName(authorToEdit.name || "");
      setCountry(authorToEdit.country || "");
      setBio(authorToEdit.bio || "");
    } else {
      setName("");
      setCountry("");
      setBio("");
    }
  }, [authorToEdit]);

  const checkDuplicate = async () => {
    try {
      const res = await fetch(`${API}/authors`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const authors = await res.json();
        const found = authors.find(
          (a) => a.name.toLowerCase().trim() === name.toLowerCase().trim()
        );
        if (found && (!authorToEdit || found.id !== authorToEdit.id)) {
          return true;
        }
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
        body: JSON.stringify({ name, country, bio }),
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
    <>
      <form
        onSubmit={handleSubmit}
        className="mb-4 bg-white p-4 rounded shadow-sm border border-2"
        style={{ borderColor: "#10274C" }}
      >
        <h4 className="mb-3" style={{ color: "#10274C" }}>
          {authorToEdit ? "Editar Autor" : "Nuevo Autor"}
        </h4>

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nombre del autor"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">País</label>
          <input
            className="form-control"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder="País del autor"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Biografía</label>
          <textarea
            className="form-control"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Escriba una breve biografía"
            rows={4}
            minLength={10}
            required
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
            {authorToEdit ? "Actualizar" : "Crear"}
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
          <Modal.Title>Autor duplicado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ya existe un autor registrado con ese nombre. Por favor verifica antes
          de continuar.
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

export default AuthorForm;
