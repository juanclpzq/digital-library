// backend/index.js - VERSIÓN CORREGIDA
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ Importar TODAS las rutas
const authRoutes = require("./routes/auth"); // ← AGREGADO
const booksRoutes = require("./routes/books");
const metadataRoutes = require("./routes/metadata");

// ✅ Importar middleware de error (opcional pero recomendado)
const errorHandler = require("./middleware/errorHandler");

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

// ✅ CONFIGURAR TODAS LAS RUTAS
app.use("/api/auth", authRoutes); // ← ESTA LÍNEA FALTABA!
app.use("/api/books", booksRoutes);
app.use("/api/metadata", metadataRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("🚀 Servidor Digital Library funcionando");
});

// ✅ Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Levantar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
  console.log(`📚 Rutas disponibles:`);
  console.log(`   - GET  http://localhost:${PORT}/`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   - GET  http://localhost:${PORT}/api/books`);
  console.log(`   - GET  http://localhost:${PORT}/api/metadata/isbn/:isbn`);
});
