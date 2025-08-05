const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // Información básica (requerida)
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      index: "text",
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      index: "text",
    },

    // Metadata del libro
    isbn: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Permite múltiples documentos sin ISBN
    },
    isbn13: String,
    year: {
      type: Number,
      min: [1000, "Year must be valid"],
      max: [
        new Date().getFullYear() + 1,
        "Year cannot be too far in the future",
      ],
    },
    publishedDate: Date,
    publisher: String,
    edition: String,

    // Categorización avanzada
    genre: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Science Fiction",
        "Fantasy",
        "Mystery",
        "Thriller",
        "Romance",
        "Historical Fiction",
        "Biography",
        "Autobiography",
        "History",
        "Science",
        "Technology",
        "Philosophy",
        "Religion",
        "Politics",
        "Economics",
        "Psychology",
        "Self-Help",
        "Health",
        "Art",
        "Music",
        "Photography",
        "Travel",
        "Cooking",
        "Sports",
        "Children",
        "Young Adult",
        "Poetry",
        "Drama",
        "Essays",
        "Reference",
        "Textbook",
        "Academic",
        "Business",
        "Geopolitics",
        "Cold War History",
        "Political History",
        "Zionism",
        "Political Philosophy",
        "Historical Revisionism",
        "LGBT Studies",
        "Conspiracy Theory",
        "Political Pamphlet",
        "Fascism",
        "9/11 Conspiracy",
        "Political Analysis",
        "U.S. History",
        "Space Opera",
        "Other",
      ],
      default: "Other",
    },
    subCategories: [String], // Para categorías más específicas
    tags: [String],

    // Descripción y contenido
    description: {
      type: String,
      trim: true,
      index: "text",
    },
    summary: String,
    tableOfContents: [String],

    // Información física del libro
    pages: {
      type: Number,
      min: [1, "Pages must be at least 1"],
    },
    pageCount: Number, // Alias para pages
    format: {
      type: String,
      enum: [
        "Hardcover",
        "Paperback",
        "eBook",
        "Audiobook",
        "PDF",
        "EPUB",
        "MOBI",
        "Other",
      ],
      default: "eBook",
    },
    language: {
      type: String,
      default: "English",
    },
    originalLanguage: String,
    translator: String,

    // Archivos y URLs
    fileUrl: String, // Google Drive link o similar
    filePath: String, // Ruta local original (para referencia)
    fileType: {
      type: String,
      enum: ["PDF", "EPUB", "MOBI", "TXT", "DOCX", "Other"],
    },
    fileSize: Number, // En bytes

    // Imágenes y multimedia
    coverImage: String, // URL de la portada
    coverImageLocal: String, // Portada local si se sube
    images: [String], // Imágenes adicionales

    // Rating y reviews del usuario
    rating: {
      type: Number,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
    userReview: String,
    userNotes: String,

    // Estado de lectura del usuario
    readingStatus: {
      type: String,
      enum: [
        "want-to-read",
        "reading",
        "completed",
        "paused",
        "abandoned",
        "reference",
      ],
      default: "want-to-read",
    },
    progress: {
      type: Number,
      min: [0, "Progress must be between 0 and 100"],
      max: [100, "Progress must be between 0 and 100"],
      default: 0,
    },
    currentPage: {
      type: Number,
      min: [0, "Current page cannot be negative"],
      default: 0,
    },

    // Fechas de lectura
    startedReadingAt: Date,
    finishedReadingAt: Date,
    lastReadAt: Date,

    // Flags y estados
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },

    // Series y colecciones
    series: String,
    seriesNumber: Number,
    collection: String,

    // Metadata externa (APIs como Google Books, Open Library, etc.)
    googleBooksId: String,
    openLibraryId: String,
    goodreadsId: String,
    amazonAsin: String,

    // Ratings externos
    averageRating: Number,
    ratingsCount: Number,

    // Información del usuario propietario
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Metadata de importación
    importSource: {
      type: String,
      enum: ["manual", "file-scan", "api", "bulk-import"],
      default: "manual",
    },
    originalData: mongoose.Schema.Types.Mixed, // Para guardar data original de APIs

    // Búsqueda y indexado
    searchKeywords: [String], // Keywords generadas automáticamente
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
bookSchema.virtual("notes", {
  ref: "BookNote",
  localField: "_id",
  foreignField: "bookId",
});

bookSchema.virtual("fullTitle").get(function () {
  return this.series
    ? `${this.series} #${this.seriesNumber}: ${this.title}`
    : this.title;
});

bookSchema.virtual("displayAuthor").get(function () {
  return this.author;
});

bookSchema.virtual("readingTime").get(function () {
  if (this.startedReadingAt && this.finishedReadingAt) {
    return Math.ceil(
      (this.finishedReadingAt - this.startedReadingAt) / (1000 * 60 * 60 * 24)
    );
  }
  return null;
});

// Indexes para búsqueda optimizada
bookSchema.index({
  title: "text",
  author: "text",
  description: "text",
  tags: "text",
});
bookSchema.index({ userId: 1, readingStatus: 1 });
bookSchema.index({ userId: 1, category: 1 });
bookSchema.index({ userId: 1, isFavorite: 1 });
bookSchema.index({ userId: 1, createdAt: -1 });
bookSchema.index({ isbn: 1 }, { sparse: true });
bookSchema.index({ googleBooksId: 1 }, { sparse: true });

// Middleware para generar keywords de búsqueda
bookSchema.pre("save", function (next) {
  if (
    this.isModified("title") ||
    this.isModified("author") ||
    this.isModified("tags")
  ) {
    this.searchKeywords = [
      ...this.title.toLowerCase().split(" "),
      ...this.author.toLowerCase().split(" "),
      ...(this.tags || []).map((tag) => tag.toLowerCase()),
      ...(this.category ? [this.category.toLowerCase()] : []),
      ...(this.genre ? this.genre.toLowerCase().split(" ") : []),
    ].filter((keyword) => keyword.length > 2); // Filtrar palabras muy cortas
  }
  next();
});

module.exports = mongoose.model("Book", bookSchema);
