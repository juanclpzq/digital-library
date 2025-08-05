import { useEffect, useState } from "react";
import { fetchBooks, addBook } from "./api/books.js";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks()
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando libros...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Libros</h1>
      {books.length === 0 ? (
        <p>No hay libros disponibles.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book._id} className="mb-2 border p-2 rounded">
              <h2 className="font-semibold">{book.title}</h2>
              <p>Autor: {book.author}</p>
              <p>{book.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
