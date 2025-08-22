// backend/index.js - ARREGLAR CORS COMPLETAMENTE

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
const PORT = process.env.PORT || 5000;

// ✅ CORS CONFIGURACIÓN COMPLETA PARA DESARROLLO
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173", // Vite default port
      "http://localhost:3001",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
      "Pragma",
    ],
    credentials: true,
    optionsSuccessStatus: 200, // Para legacy browsers
  })
);

// ✅ Manejo explícito de preflight requests
app.options("*", cors());

// ✅ Headers adicionales para asegurar CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // Responder a preflight requests inmediatamente
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ✅ Middleware JSON (DESPUÉS de CORS)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Logging para debug
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.path} - Origin: ${req.headers.origin || "No origin"}`
  );
  next();
});

// Conectar a MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// ✅ Ruta de test
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Servidor Digital Library funcionando",
    port: PORT,
    cors: "enabled",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/metadata", metadataRoutes);

// ✅ Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ✅ Middleware de error
app.use(errorHandler);

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en: http://localhost:${PORT}/api`);
  console.log(`🔧 CORS configurado para puertos: 3000, 5173, 3001`);
  console.log(`🌐 Frontend esperado en: http://localhost:5173`);
});

module.exports = app;
