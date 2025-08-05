const asyncHandler = require("express-async-handler");
const Book = require("../models/Book");
const BookMetadataService = require("../services/bookMetadataService");

// @desc    Enrich book metadata from external APIs
// @route   POST /api/books/:id/enrich
// @access  Private
const enrichBookMetadata = asyncHandler(async (req, res) => {
  const book = await Book.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  try {
    const enrichedData = await BookMetadataService.enrichBookMetadata({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
    });

    // Actualizar solo campos que no están ya presentes
    const updateData = {};
    Object.keys(enrichedData).forEach((key) => {
      if (!book[key] && enrichedData[key]) {
        updateData[key] = enrichedData[key];
      }
    });

    if (Object.keys(updateData).length > 0) {
      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: "Book metadata enriched successfully",
        data: updatedBook,
        enrichedFields: Object.keys(updateData),
      });
    } else {
      res.json({
        success: true,
        message: "No additional metadata found",
        data: book,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error enriching metadata",
      error: error.message,
    });
  }
});

// @desc    Search book metadata by ISBN
// @route   GET /api/metadata/isbn/:isbn
// @access  Private
const getMetadataByISBN = asyncHandler(async (req, res) => {
  const { isbn } = req.params;

  try {
    const metadata = await BookMetadataService.getBookByISBN(isbn);

    if (metadata) {
      res.json({
        success: true,
        data: metadata,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No metadata found for this ISBN",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching metadata",
      error: error.message,
    });
  }
});

// @desc    Bulk enrich all books without complete metadata
// @route   POST /api/books/bulk-enrich
// @access  Private
const bulkEnrichBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({
    userId: req.user._id,
    $or: [
      { description: { $exists: false } },
      { description: "" },
      { coverImage: { $exists: false } },
      { coverImage: "" },
    ],
  }).limit(10); // Procesar de a 10 para no sobrecargar las APIs

  const results = {
    processed: 0,
    enriched: 0,
    errors: 0,
    details: [],
  };

  for (const book of books) {
    try {
      results.processed++;

      const enrichedData = await BookMetadataService.enrichBookMetadata({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
      });

      const updateData = {};
      Object.keys(enrichedData).forEach((key) => {
        if (!book[key] && enrichedData[key]) {
          updateData[key] = enrichedData[key];
        }
      });

      if (Object.keys(updateData).length > 0) {
        await Book.findByIdAndUpdate(book._id, updateData);
        results.enriched++;
        results.details.push({
          bookId: book._id,
          title: book.title,
          status: "enriched",
          fieldsUpdated: Object.keys(updateData),
        });
      } else {
        results.details.push({
          bookId: book._id,
          title: book.title,
          status: "no_updates",
          message: "No additional metadata found",
        });
      }

      // Delay para respetar rate limits de las APIs
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      results.errors++;
      results.details.push({
        bookId: book._id,
        title: book.title,
        status: "error",
        error: error.message,
      });
    }
  }

  res.json({
    success: true,
    message: `Bulk enrichment completed. ${results.enriched} books enriched out of ${results.processed} processed.`,
    data: results,
  });
});

module.exports = {
  enrichBookMetadata,
  getMetadataByISBN,
  bulkEnrichBooks,
};
