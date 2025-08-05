const express = require("express");
const router = express.Router();
const { getMetadataByISBN } = require("../controllers/metadata");
const { protect } = require("../middleware/auth");

// Apply auth middleware to all routes
router.use(protect);

// Metadata routes
router.get("/isbn/:isbn", getMetadataByISBN);

module.exports = router;
