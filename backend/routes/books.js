const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  updateReadingStatus,
  getReadingStats,
  getBooksByCategory,
  bulkImportBooks,
} = require("../controllers/books");
const {
  getBookNotes,
  createBookNote,
  updateBookNote,
  deleteBookNote,
} = require("../controllers/bookNotes");
const {
  enrichBookMetadata,
  bulkEnrichBooks,
} = require("../controllers/metadata");
const { protect } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");

// Validation rules
const bookValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
];

const bulkImportValidation = [
  body("books").isArray({ min: 1 }).withMessage("Books array is required"),
  body("books.*.title").notEmpty().withMessage("Each book must have a title"),
  body("books.*.author")
    .notEmpty()
    .withMessage("Each book must have an author"),
];

const noteValidation = [
  body("title").notEmpty().withMessage("Note title is required"),
  body("content").notEmpty().withMessage("Note content is required"),
];

// Apply auth middleware to all routes
router.use(protect);

// Book routes
router.get("/", getBooks);
router.get("/stats", getReadingStats);
router.post(
  "/bulk-import",
  bulkImportValidation,
  validateRequest,
  bulkImportBooks
);
router.post("/bulk-enrich", bulkEnrichBooks);
router.get("/categories/:category", getBooksByCategory);
router.get("/:id", getBook);
router.post("/", bookValidation, validateRequest, createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);
router.patch("/:id/status", updateReadingStatus);
router.post("/:id/enrich", enrichBookMetadata);

// Book notes routes
router.get("/:bookId/notes", getBookNotes);
router.post("/:bookId/notes", noteValidation, validateRequest, createBookNote);

module.exports = router;
