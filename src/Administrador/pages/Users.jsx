import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const API = import.meta.env.VITE_API_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [filteredUser, setFilteredUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUsers = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
          return [];
        }
        return res.json();
      })
      .then(setUsers)
      .catch((err) => console.error("Error al cargar usuarios:", err));
  };

  useEffect(fetchUsers, []);

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`${API}/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        fetchUsers();
      } else if (res.status === 401) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleSearch = async () => {
    if (!searchId) return;
    try {
      const res = await fetch(`${API}/users/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("No se encontró el usuario");
      const data = await res.json();
      setFilteredUser(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClearSearch = () => {
    setSearchId("");
    setFilteredUser(null);
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editUser.name,
          email: editUser.email,
          role: editUser.role,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar usuario");
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUser
    ? [filteredUser]
    : users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#F2F7FF",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2 style={{ color: "#10274C", fontWeight: "600", marginBottom: "2rem" }}>
        Gestión de Usuarios
      </h2>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4 gap-3">
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
          <input
            type="number"
            placeholder="Buscar por ID"
            className="form-control"
            style={{ maxWidth: "220px", borderColor: "#cdd7e1" }}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button
            className="btn"
            style={{
              backgroundColor: "#1F3A63",
              color: "#fff",
              fontWeight: "500",
            }}
            onClick={handleSearch}
          >
            Buscar
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleClearSearch}
            title="Limpiar búsqueda"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover table-striped">
          <thead style={{ backgroundColor: "#eaf1ff", color: "#10274C" }}>
            <tr className="text-center">
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Creado</th>
              <th>Actualizado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((u) => (
              <tr key={u.id} className="text-center align-middle">
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td className="text-break">{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.created_at).toLocaleString()}</td>
                <td>{new Date(u.updated_at).toLocaleString()}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2 flex-wrap">
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#6C757D",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      onClick={() => setSelectedUser(u)}
                    >
                      Detalle
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#1F3A63",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      onClick={() => setEditUser(u)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{
                        backgroundColor: "#DC3545",
                        color: "#fff",
                        fontWeight: "500",
                      }}
                      onClick={() => handleDelete(u)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!filteredUser && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Button
            variant="outline-primary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline-primary"
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </Button>
        </div>
      )}

      {selectedUser && (
        <Modal show onHide={() => setSelectedUser(null)} centered>
          <Modal.Header
            closeButton
            style={{
              backgroundColor: "#1F3A63",
              color: "white",
              borderBottom: "none",
            }}
            closeVariant="white"
          >
            <Modal.Title style={{ fontWeight: "500" }}>
              Detalle del Usuario
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 py-3">
            <p>
              <strong>Nombre:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Rol:</strong> {selectedUser.role}
            </p>
            <p>
              <strong>Creado:</strong>{" "}
              {new Date(selectedUser.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Actualizado:</strong>{" "}
              {new Date(selectedUser.updated_at).toLocaleString()}
            </p>
          </Modal.Body>
        </Modal>
      )}

      {editUser && (
        <Modal show centered onHide={() => setEditUser(null)} backdrop="static">
          <Modal.Header
            closeButton
            style={{
              backgroundColor: "#1F3A63",
              color: "white",
              borderBottom: "none",
            }}
            closeVariant="white"
          >
            <Modal.Title style={{ fontWeight: "500" }}>
              Editar Usuario
            </Modal.Title>
          </Modal.Header>

          <Form onSubmit={handleEditSubmit}>
            <Modal.Body className="px-4 py-3">
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editUser?.name || ""}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editUser?.email || ""}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  name="role"
                  value={editUser?.role || ""}
                  onChange={handleEditChange}
                >
                  <option value="user">lector</option>
                  <option value="admin">admin</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button
                style={{ backgroundColor: "#1F3A63", border: "none" }}
                type="submit"
              >
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Advertencia importante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás segura/o que deseas eliminar al usuario{" "}
          <strong>{userToDelete?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
