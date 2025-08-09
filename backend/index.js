// backend/index.js - VERSIÓN CON SSL ARREGLADO
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Importar rutas
const authRoutes = require("./routes/auth");
const booksRoutes = require("./routes/books");
const metadataRoutes = require("./routes/metadata");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ CONEXIÓN SIMPLIFICADA CON MANEJO DE ERRORES SSL
const connectDB = async () => {
  // Opción 1: Conexión estándar
  try {
    console.log("🔄 Intentando conexión estándar...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
    });
    console.log(`✅ MongoDB Conectado (estándar): ${conn.connection.host}`);
    return;
  } catch (error) {
    console.error("❌ Conexión estándar falló:", error.message);
  }

  // Opción 2: Con SSL permisivo
  try {
    console.log("🔄 Intentando con SSL permisivo...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(
      `✅ MongoDB Conectado (SSL permisivo): ${conn.connection.host}`
    );
    return;
  } catch (error) {
    console.error("❌ SSL permisivo falló:", error.message);
  }

  // Opción 3: Connection string modificado
  try {
    console.log("🔄 Intentando con parámetros en URL...");
    const modifiedUri =
      process.env.MONGO_URI + "&ssl=true&tlsAllowInvalidCertificates=true";
    const conn = await mongoose.connect(modifiedUri, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log(
      `✅ MongoDB Conectado (URL modificada): ${conn.connection.host}`
    );
    return;
  } catch (error) {
    console.error("❌ URL modificada falló:", error.message);
  }

  // Si todo falla
  console.error("💥 No se pudo conectar a MongoDB con ningún método");
  console.log("🔧 Sugerencias:");
  console.log("   1. Verifica Network Access en MongoDB Atlas");
  console.log("   2. Asegúrate que tu IP esté en la whitelist");
  console.log("   3. Verifica usuario/password en Atlas");
  process.exit(1);
};

// Conectar base de datos
connectDB();

// Configurar rutas
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/metadata", metadataRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("🚀 Servidor Digital Library funcionando");
});

// Middleware de error
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
