const API_URL = "http://localhost:3000/api/books";

export async function fetchBooks() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function addBook(book) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return res.json();
}
