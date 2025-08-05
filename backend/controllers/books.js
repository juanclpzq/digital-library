const db = require("../db");

// Obtener todos los libros
exports.getAllBooks = (req, res) => {
  const sql = "SELECT * FROM books";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Obtener libro por id
exports.getBookById = (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM books WHERE id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.json(row);
  });
};

// Crear libro
exports.createBook = (req, res) => {
  const { title, author, year } = req.body;
  const sql = "INSERT INTO books (title, author, year) VALUES (?, ?, ?)";
  db.run(sql, [title, author, year], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, title, author, year });
  });
};
