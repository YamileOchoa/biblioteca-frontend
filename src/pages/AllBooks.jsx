import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../styles/AllBooks.css";

const AllBooks = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const location = useLocation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/books/available`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Error al obtener libros");
        const data = await res.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error("Error al obtener libros:", error);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      try {
        const headers = {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [authorsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/authors`, { headers }),
          fetch(`${API_URL}/categories`, { headers }),
        ]);

        if (!authorsRes.ok || !categoriesRes.ok) {
          throw new Error("Error al cargar autores o categorías");
        }

        const [authorsData, categoriesData] = await Promise.all([
          authorsRes.json(),
          categoriesRes.json(),
        ]);

        setAuthors(authorsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error al obtener autores/categorías:", error);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  useEffect(() => {
    let filtered = books;

    if (isLoggedIn) {
      filtered = filtered.filter((book) => {
        const categoryMatch =
          selectedCategories.length === 0 ||
          selectedCategories.includes(book.category_id);
        const authorMatch =
          selectedAuthors.length === 0 ||
          selectedAuthors.includes(book.author_id);
        return categoryMatch && authorMatch;
      });
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBooks(filtered);
  }, [searchTerm, selectedCategories, selectedAuthors, books, isLoggedIn]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchFromURL = params.get("search");
    if (searchFromURL) {
      setSearchTerm(searchFromURL);
    }
  }, [location.search]);

  const handleCategoryChange = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleAuthorChange = (id) => {
    setSelectedAuthors((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="all-books-container">
      <Container className="py-4">
        <h2 className="all-books-title text-center mb-4">
          📚 Todos los Libros Disponibles
        </h2>

        <Row className="mb-4">
          <Col
            md={isLoggedIn ? 9 : 12}
            className={isLoggedIn ? "offset-md-3" : ""}
          >
            <Form.Control
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </Col>
        </Row>

        <Row>
          {isLoggedIn && (
            <Col md={3}>
              <div className="filters-box">
                <h5 className="fw-semibold mb-3">Filtros</h5>

                <div>
                  <strong className="d-block mb-2">Categorías</strong>
                  {categories
                    .slice(0, showAllCategories ? categories.length : 5)
                    .map((cat) => (
                      <Form.Check
                        key={cat.id}
                        label={cat.name}
                        value={cat.id}
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryChange(cat.id)}
                      />
                    ))}
                  {categories.length > 5 && (
                    <button
                      className="btn btn-link p-0 mt-1"
                      onClick={() => setShowAllCategories(!showAllCategories)}
                    >
                      {showAllCategories
                        ? "Mostrar menos"
                        : `Mostrar ${categories.length - 5} más`}
                    </button>
                  )}
                </div>

                <hr />

                <div>
                  <strong className="d-block mb-2">Autores</strong>
                  {authors
                    .slice(0, showAllAuthors ? authors.length : 5)
                    .map((auth) => (
                      <Form.Check
                        key={auth.id}
                        label={auth.name}
                        value={auth.id}
                        checked={selectedAuthors.includes(auth.id)}
                        onChange={() => handleAuthorChange(auth.id)}
                      />
                    ))}
                  {authors.length > 5 && (
                    <button
                      className="btn btn-link p-0 mt-1"
                      onClick={() => setShowAllAuthors(!showAllAuthors)}
                    >
                      {showAllAuthors
                        ? "Mostrar menos"
                        : `Mostrar ${authors.length - 5} más`}
                    </button>
                  )}
                </div>
              </div>
            </Col>
          )}

          <Col md={isLoggedIn ? 9 : 12}>
            <div className="books-grid">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <div className="grid-book" key={book.id}>
                    <Card className="book-card h-100 position-relative">
                      <div className="cover-wrapper">
                        <img
                          src={book.cover_image_url || "/books/default.webp"}
                          alt={book.title}
                          className="book-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/books/default.webp";
                          }}
                        />
                      </div>

                      <Card.Body className="d-flex flex-column justify-content-between">
                        <div>
                          <Card.Title className="book-title">
                            {book.title}
                          </Card.Title>
                          <Card.Text className="book-info d-flex flex-column">
                            <span className="book-author">
                              {book.author?.name || "Desconocido"}
                            </span>
                            <span className="book-stock">
                              Categoría:{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {book.category?.name || "Sin categoría"}
                              </span>
                            </span>
                          </Card.Text>
                        </div>

                        <Button
                          className="ver-button mt-auto"
                          onClick={() =>
                            (window.location.href = `/books/${book.id}`)
                          }
                        >
                          Ver
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                ))
              ) : (
                <p className="text-center mt-5">Libros cargando.</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AllBooks;
