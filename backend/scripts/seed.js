require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Book = require("../models/Book");
const BookNote = require("../models/BookNote");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await BookNote.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // Create test user
    const testUser = await User.create({
      email: "test@example.com",
      password: "password123",
      firstName: "Juan",
      lastName: "Pérez",
    });

    console.log("👤 Created test user");

    // Create sample books
    const books = [
      {
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        year: 1967,
        genre: "Realismo mágico",
        category: "Fiction",
        description: "Una obra maestra de la literatura latinoamericana",
        pages: 417,
        language: "Spanish",
        readingStatus: "completed",
        rating: 5,
        progress: 100,
        userId: testUser._id,
      },
      {
        title: "El Quijote",
        author: "Miguel de Cervantes",
        year: 1605,
        genre: "Novela",
        category: "Fiction",
        description: "La obra cumbre de la literatura española",
        pages: 863,
        language: "Spanish",
        readingStatus: "reading",
        rating: 4,
        progress: 45,
        userId: testUser._id,
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        year: 2011,
        genre: "Historia",
        category: "Non-Fiction",
        description: "De animales a dioses: Breve historia de la humanidad",
        pages: 512,
        language: "Spanish",
        readingStatus: "want-to-read",
        progress: 0,
        userId: testUser._id,
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        year: 2008,
        genre: "Programming",
        category: "Technology",
        description: "A Handbook of Agile Software Craftsmanship",
        pages: 464,
        language: "English",
        readingStatus: "paused",
        rating: 5,
        progress: 30,
        userId: testUser._id,
      },
    ];

    const createdBooks = await Book.insertMany(books);
    console.log("📚 Created sample books");

    // Create sample notes
    const notes = [
      {
        bookId: createdBooks[0]._id,
        userId: testUser._id,
        title: "Reflexión sobre la soledad",
        content:
          "La soledad es un tema recurrente que conecta a todos los personajes de la familia Buendía.",
        page: 120,
        noteType: "note",
        color: "yellow",
      },
      {
        bookId: createdBooks[1]._id,
        userId: testUser._id,
        title: "Cita memorable",
        content:
          '"En un lugar de la Mancha, de cuyo nombre no quiero acordarme..."',
        page: 1,
        noteType: "quote",
        color: "blue",
      },
      {
        bookId: createdBooks[3]._id,
        userId: testUser._id,
        title: "Principio importante",
        content:
          "El código limpio es código que ha sido cuidado por alguien que se preocupa.",
        page: 14,
        noteType: "highlight",
        color: "green",
      },
    ];

    await BookNote.insertMany(notes);
    console.log("📝 Created sample notes");

    console.log(`
🎉 Seed completed successfully!

Test user credentials:
Email: test@example.com
Password: password123

Created:
- 1 user
- ${createdBooks.length} books
- ${notes.length} notes
    `);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
