const asyncHandler = require("express-async-handler");
const BookNote = require("../models/BookNote");
const Book = require("../models/Book");

// @desc    Get all notes for a book
// @route   GET /api/books/:bookId/notes
// @access  Private
const getBookNotes = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  // Verify book belongs to user
  const book = await Book.findOne({
    _id: bookId,
    userId: req.user._id,
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  const notes = await BookNote.find({
    bookId,
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: notes,
  });
});

// @desc    Create new note for book
// @route   POST /api/books/:bookId/notes
// @access  Private
const createBookNote = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  // Verify book belongs to user
  const book = await Book.findOne({
    _id: bookId,
    userId: req.user._id,
  });

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  const noteData = {
    ...req.body,
    bookId,
    userId: req.user._id,
  };

  const note = await BookNote.create(noteData);

  res.status(201).json({
    success: true,
    message: "Note created successfully",
    data: note,
  });
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateBookNote = asyncHandler(async (req, res) => {
  let note = await BookNote.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    });
  }

  note = await BookNote.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    message: "Note updated successfully",
    data: note,
  });
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteBookNote = asyncHandler(async (req, res) => {
  const note = await BookNote.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!note) {
    return res.status(404).json({
      success: false,
      message: "Note not found",
    });
  }

  await BookNote.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Note deleted successfully",
  });
});

module.exports = {
  getBookNotes,
  createBookNote,
  updateBookNote,
  deleteBookNote,
};
