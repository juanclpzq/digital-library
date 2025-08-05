require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Importar rutas (ajusta la ruta según tu estructura)
const booksRoutes = require("./routes/books");
const metadataRoutes = require("./routes/metadata");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar MongoDB:", err));

// Rutas
app.use("/api/books", booksRoutes);
app.use("/api/metadata", metadataRoutes);
// Ruta base
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando");
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
