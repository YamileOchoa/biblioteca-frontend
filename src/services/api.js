const API_URL = import.meta.env.VITE_API_URL;

export const obtenerLibros = async () => {
  const res = await fetch(`${API_URL}/books`);
  if (!res.ok) throw new Error("Error al obtener libros");
  return res.json();
};
