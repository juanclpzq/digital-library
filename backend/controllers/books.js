const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose"); // Added for ObjectId casting in stats
const Book = require("../models/Book");

// Helper function to escape special characters for RegExp
const escapeRegex = (string) => {
  if (!string) return "";
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

// @desc    Get all books for user with advanced filtering
// @route   GET /api/books
// @access  Private
const getBooks = asyncHandler(async (req, res) => {
  const {
    status,
    category,
    genre,
    author,
    series,
    format,
    language,
    rating,
    search,
    tags,
    isFavorite,
    year,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // --- CORRECTION: Combined all filtering logic into a dynamic $and block ---
  // This ensures that all filter conditions and the global search work together correctly.
  const filterConditions = [{ userId: req.user._id }];

  if (status) filterConditions.push({ readingStatus: status });
  if (category) filterConditions.push({ category });
  if (genre)
    filterConditions.push({ genre: new RegExp(escapeRegex(genre), "i") });
  if (author)
    filterConditions.push({ author: new RegExp(escapeRegex(author), "i") });
  if (series)
    filterConditions.push({ series: new RegExp(escapeRegex(series), "i") });
  if (format) filterConditions.push({ format });
  if (language) filterConditions.push({ language });
  if (isFavorite === "true") filterConditions.push({ isFavorite: true });

  // Rating filter
  if (rating) {
    const ratingNum = parseInt(rating);
    if (!isNaN(ratingNum)) {
      filterConditions.push({ rating: { $gte: ratingNum } });
    }
  }

  // Year filter
  if (year) {
    if (year.includes("-")) {
      const [startYear, endYear] = year.split("-").map((y) => parseInt(y));
      if (!isNaN(startYear) && !isNaN(endYear)) {
        filterConditions.push({
          publishedYear: { $gte: startYear, $lte: endYear },
        });
      }
    } else {
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) {
        filterConditions.push({ publishedYear: yearNum });
      }
    }
  }

  // Tags filter
  if (tags) {
    const tagArray = tags.split(",").map((tag) => tag.trim());
    filterConditions.push({ tags: { $in: tagArray } });
  }

  // Search functionality - busca en múltiples campos
  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    filterConditions.push({
      $or: [
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex },
        { tags: searchRegex }, // Correct way to search in a string array
        { isbn: searchRegex },
        { publisher: searchRegex },
      ],
    });
  }

  const filter = { $and: filterConditions };

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  const limitValue = parseInt(limit);
  const pageValue = parseInt(page);
  const skipValue = (pageValue - 1) * limitValue;

  const books = await Book.find(filter)
    .sort(sortOptions)
    .limit(limitValue)
    .skip(skipValue)
    .populate("notes")
    .select("-originalData"); // Excluir datos originales de importación

  const total = await Book.countDocuments(filter);

  // --- REFACTOR: Aggregation for stats to be more efficient and clear ---
  // Calculates stats based on the same filtered query.
  const statsAggregation = await Book.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        // --- CORRECTION: Renamed 'totalPages' to 'totalPageCount' for clarity ---
        totalPageCount: { $sum: "$pages" },
        avgRating: { $avg: "$rating" },
        completedBooks: {
          $sum: { $cond: [{ $eq: ["$readingStatus", "completed"] }, 1, 0] },
        },
      },
    },
  ]);

  const stats = statsAggregation[0] || {
    totalPageCount: 0,
    avgRating: 0,
    completedBooks: 0,
  };

  res.json({
    success: true,
    data: books,
    pagination: {
      currentPage: pageValue,
      totalPages: Math.ceil(total / limitValue),
      totalBooks: total,
      hasNextPage: pageValue < Math.ceil(total / limitValue),
      hasPrevPage: pageValue > 1,
    },
    stats: stats,
    filters: req.query, // Echo back all provided filters
  });
});

// @desc    Get single book with full metadata
// @route   GET /api/books/:id
// @access  Private
const getBook = asyncHandler(async (req, res) => {
  // --- CORRECTION: Check for valid ObjectId to prevent CastError ---
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid book ID" });
  }

  const book = await Book.findOne({
    _id: req.params.id,
    userId: req.user._id,
  }).populate("notes");

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found or you do not have permission to view it",
    });
  }

  res.json({
    success: true,
    data: book,
  });
});

// @desc    Create new book with rich metadata
// @route   POST /api/books
// @access  Private
const createBook = asyncHandler(async (req, res) => {
  const bookData = {
    ...req.body,
    userId: req.user._id,
  };

  // Validar ISBN único si se proporciona
  if (bookData.isbn) {
    const existingBook = await Book.findOne({
      isbn: bookData.isbn,
      userId: req.user._id,
    });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "A book with this ISBN already exists in your library",
      });
    }
  }

  const book = await Book.create(bookData);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data: book,
  });
});

// @desc    Update book metadata
// @route   PUT /api/books/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid book ID" });
  }

  // --- CORRECTION: Check ownership before attempting to update ---
  const bookExists = await Book.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!bookExists) {
    return res.status(404).json({
      success: false,
      message: "Book not found or you do not have permission to edit it",
    });
  }

  // Validar ISBN único si se está actualizando
  if (req.body.isbn && req.body.isbn !== bookExists.isbn) {
    const existingBook = await Book.findOne({
      isbn: req.body.isbn,
      userId: req.user._id,
      _id: { $ne: req.params.id },
    });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: "Another book in your library already has this ISBN",
      });
    }
  }

  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Book updated successfully",
    data: book,
  });
});

// --- ADDED: Missing deleteBook function ---
// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid book ID" });
  }

  const book = await Book.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found or you do not have permission to delete it",
    });
  }

  await Book.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});

// --- ADDED: Missing updateReadingStatus function ---
// @desc    Update a book's reading status
// @route   PATCH /api/books/:id/status
// @access  Private
const updateReadingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = [
    "reading",
    "completed",
    "on-hold",
    "dropped",
    "plan-to-read",
  ];

  if (!status || !validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: "A valid status is required." });
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid book ID" });
  }

  const book = await Book.findOne({ _id: req.params.id, userId: req.user._id });

  if (!book) {
    return res.status(404).json({ success: false, message: "Book not found" });
  }

  const updateData = { readingStatus: status };
  // Set finishedOn date only if status is changing to 'completed' and it's not already set
  if (status === "completed" && !book.finishedOn) {
    updateData.finishedOn = new Date();
  } else if (status !== "completed") {
    // Optionally clear the finishedOn date if status changes from completed
    updateData.finishedOn = null;
  }

  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Reading status updated successfully",
    data: updatedBook,
  });
});

// @desc    Get books by category/genre
// @route   GET /api/books/categories/:category
// @access  Private
const getBooksByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const limitValue = parseInt(limit);
  const pageValue = parseInt(page);
  const skipValue = (pageValue - 1) * limitValue;

  const filter = {
    userId: req.user._id,
    $or: [
      { category: new RegExp(escapeRegex(category), "i") },
      { subCategories: new RegExp(escapeRegex(category), "i") },
    ],
  };

  const books = await Book.find(filter)
    .sort({ createdAt: -1 })
    .limit(limitValue)
    .skip(skipValue);

  const total = await Book.countDocuments(filter);

  res.json({
    success: true,
    data: books,
    pagination: {
      currentPage: pageValue,
      totalPages: Math.ceil(total / limitValue),
      totalBooks: total,
    },
  });
});

// @desc    Get reading statistics with detailed metadata
// @route   GET /api/books/stats
// @access  Private
// --- REFACTOR: Major efficiency improvement using a single $facet aggregation ---
const getReadingStats = asyncHandler(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.user._id);

  const results = await Book.aggregate([
    { $match: { userId } },
    {
      $facet: {
        generalStats: [
          {
            $group: {
              _id: null,
              totalBooks: { $sum: 1 },
              totalPagesRead: { $sum: "$pages" },
              avgRating: { $avg: "$rating" },
              completedBooks: {
                $sum: {
                  $cond: [{ $eq: ["$readingStatus", "completed"] }, 1, 0],
                },
              },
              favoriteBooks: { $sum: { $cond: ["$isFavorite", 1, 0] } },
            },
          },
        ],
        statusStats: [
          {
            $group: {
              _id: "$readingStatus",
              count: { $sum: 1 },
              totalPages: { $sum: "$pages" },
            },
          },
        ],
        categoryStats: [
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
              avgRating: { $avg: "$rating" },
            },
          },
          { $sort: { count: -1 } },
        ],
        yearStats: [
          { $match: { publishedYear: { $exists: true, $ne: null } } },
          { $group: { _id: "$publishedYear", count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
        ],
        formatStats: [{ $group: { _id: "$format", count: { $sum: 1 } } }],
      },
    },
  ]);

  // Process the faceted results
  const stats = results[0];
  const general = stats.generalStats[0] || {
    totalBooks: 0,
    totalPagesRead: 0,
    avgRating: 0,
    completedBooks: 0,
    favoriteBooks: 0,
  };

  res.json({
    success: true,
    data: {
      general,
      byStatus: stats.statusStats,
      byCategory: stats.categoryStats,
      byYear: stats.yearStats,
      byFormat: stats.formatStats,
    },
  });
});

// @desc    Bulk import books from an array
// @route   POST /api/books/import
// @access  Private
// --- REFACTOR: Major efficiency and logic improvement for bulk operations ---
const bulkImportBooks = asyncHandler(async (req, res) => {
  const { books } = req.body;
  if (!Array.isArray(books) || books.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body must be a non-empty array of books.",
    });
  }

  const results = { success: 0, duplicates: 0, errors: 0, details: [] };

  // 1. Get all potential identifiers from the incoming books
  const isbns = books.map((b) => b.isbn).filter(Boolean);
  const titleAuthorCombos = books.map(
    (b) => `${b.title?.toLowerCase()}|${b.author?.toLowerCase()}`
  );

  // 2. Query the database ONCE to find all existing books
  const existingBooks = await Book.find({
    userId: req.user._id,
    $or: [{ isbn: { $in: isbns } }],
  }).lean();

  const existingIsbns = new Set(existingBooks.map((b) => b.isbn));
  const existingTitleAuthors = new Set(
    existingBooks.map(
      (b) => `${b.title.toLowerCase()}|${b.author.toLowerCase()}`
    )
  );

  // Add all existing title/author combos to the set for checking
  for (const combo of titleAuthorCombos) {
    existingTitleAuthors.add(combo);
  }

  const booksToCreate = [];

  // 3. Process books in memory, not with individual DB calls
  for (const bookData of books) {
    if (!bookData.title || !bookData.author) {
      results.errors++;
      results.details.push({
        title: bookData.title || "Unknown",
        status: "error",
        message: "Missing title or author.",
      });
      continue;
    }

    const currentTitleAuthor = `${bookData.title.toLowerCase()}|${bookData.author.toLowerCase()}`;
    const isDuplicate =
      (bookData.isbn && existingIsbns.has(bookData.isbn)) ||
      existingTitleAuthors.has(currentTitleAuthor);

    if (isDuplicate) {
      results.duplicates++;
      results.details.push({
        title: bookData.title,
        status: "duplicate",
        message: "Book with same ISBN or title/author already exists.",
      });
    } else {
      booksToCreate.push({
        ...bookData,
        userId: req.user._id,
        importSource: "bulk-import",
      });
      // Add to set to prevent duplicate imports within the same batch
      existingTitleAuthors.add(currentTitleAuthor);
      if (bookData.isbn) existingIsbns.add(bookData.isbn);
    }
  }

  // 4. Insert all valid, non-duplicate books with a single DB command
  if (booksToCreate.length > 0) {
    try {
      const newBooks = await Book.insertMany(booksToCreate, { ordered: false });
      results.success = newBooks.length;
      newBooks.forEach((b) =>
        results.details.push({
          title: b.title,
          status: "success",
          message: "Book imported successfully.",
        })
      );
    } catch (error) {
      results.errors += booksToCreate.length - (error.result?.nInserted || 0);
      results.details.push({
        title: "Bulk Operation",
        status: "error",
        message: `Bulk insert failed: ${error.message}`,
      });
    }
  }

  res.status(201).json({
    success: true,
    message: `Import complete. Success: ${results.success}, Duplicates: ${results.duplicates}, Errors: ${results.errors}.`,
    data: results,
  });
});

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  updateReadingStatus,
  getReadingStats,
  getBooksByCategory,
  bulkImportBooks,
};
