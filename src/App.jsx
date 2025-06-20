import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Todas las páginas que comparten el mismo layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
