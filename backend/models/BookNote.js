const mongoose = require("mongoose");

const bookNoteSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Note content is required"],
    },
    page: {
      type: Number,
      min: [1, "Page must be at least 1"],
    },
    chapter: String,
    noteType: {
      type: String,
      enum: ["highlight", "note", "quote", "question"],
      default: "note",
    },
    color: {
      type: String,
      enum: ["yellow", "green", "blue", "red", "purple"],
      default: "yellow",
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
bookNoteSchema.index({ bookId: 1, userId: 1 });

module.exports = mongoose.model("BookNote", bookNoteSchema);
