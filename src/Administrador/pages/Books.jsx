import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookForm from "../components/BookForm";

const API = import.meta.env.VITE_API_URL;

const Books = () => {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchBooks = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API}/books`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
          throw new Error("No autorizado");
        }
        return res.json();
      })
      .then(setBooks)
      .catch((err) => console.error("Error cargando libros:", err));
  };

  useEffect(fetchBooks, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este libro?")) return;

    try {
      const res = await fetch(`${API}/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      if (res.ok) {
        fetchBooks();
        setMensaje("🗑️ Libro eliminado con éxito");
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch (err) {
      console.error("Error al eliminar libro:", err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F2F7FF",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: "#10274C", fontWeight: "bold" }}>📚 Libros</h2>
        {!showForm ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              setBookToEdit(null);
              setShowForm(true);
            }}
          >
            ➕ Nuevo libro
          </button>
        ) : (
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setBookToEdit(null);
              setShowForm(false);
            }}
          >
            ✖️ Cancelar
          </button>
        )}
      </div>

      {mensaje && (
        <div
          className="alert alert-success"
          style={{
            borderColor: "#10274C",
            backgroundColor: "#eaf1ff",
            color: "#10274C",
          }}
        >
          {mensaje}
        </div>
      )}

      {showForm && (
        <BookForm
          bookToEdit={bookToEdit}
          onSuccess={() => {
            fetchBooks();
            setShowForm(false);
            setBookToEdit(null);
            setMensaje("✅ Libro guardado con éxito");
            setTimeout(() => setMensaje(""), 3000);
          }}
          onCancel={() => {
            setShowForm(false);
            setBookToEdit(null);
          }}
        />
      )}

      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Año</th>
              <th>Editorial</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.year}</td>
                <td>{book.publisher}</td>
                <td>{book.stock}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => {
                      setBookToEdit(book);
                      setShowForm(true);
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(book.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>
        {`
          .table-hover tbody tr:hover {
            background-color: #eaf1ff;
          }
          .table-bordered th, .table-bordered td {
            border-color: #10274C !important;
          }
        `}
      </style>
    </div>
  );
};

export default Books;
