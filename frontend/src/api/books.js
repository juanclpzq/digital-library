// frontend/src/api/books.js - VERSIÓN CORREGIDA
const API_URL = "http://localhost:3000/api/books";

// Helper para obtener el token de autenticación
const getAuthHeaders = () => {
  const authTokens = JSON.parse(localStorage.getItem("authTokens") || "{}");
  const token = authTokens.accessToken;

  if (!token) {
    throw new Error("No authentication token found. Please login.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// GET /api/books - Obtener todos los libros del usuario
export async function fetchBooks() {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Authentication required. Please login.");
      }
      if (res.status === 403) {
        throw new Error("Access denied. Invalid token.");
      }
      throw new Error(`HTTP ${res.status}: Failed to fetch books`);
    }

    const response = await res.json();

    // El backend devuelve { success: true, data: books }
    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.message || "Invalid response format");
    }
  } catch (error) {
    console.error("fetchBooks error:", error);
    throw error;
  }
}

// POST /api/books - Crear nuevo libro
export async function addBook(book) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(book),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Authentication required. Please login.");
      }
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add book");
    }

    const response = await res.json();
    return response.success ? response.data : response;
  } catch (error) {
    console.error("addBook error:", error);
    throw error;
  }
}

// PUT /api/books/:id - Actualizar libro
export async function updateBook(bookId, updates) {
  try {
    const res = await fetch(`${API_URL}/${bookId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Authentication required. Please login.");
      }
      if (res.status === 404) {
        throw new Error("Book not found.");
      }
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update book");
    }

    const response = await res.json();
    return response.success ? response.data : response;
  } catch (error) {
    console.error("updateBook error:", error);
    throw error;
  }
}

// DELETE /api/books/:id - Eliminar libro
export async function deleteBook(bookId) {
  try {
    const res = await fetch(`${API_URL}/${bookId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Authentication required. Please login.");
      }
      if (res.status === 404) {
        throw new Error("Book not found.");
      }
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete book");
    }

    return true;
  } catch (error) {
    console.error("deleteBook error:", error);
    throw error;
  }
}

// GET /api/books/stats - Obtener estadísticas de lectura
export async function getReadingStats() {
  try {
    const res = await fetch(`${API_URL}/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Authentication required. Please login.");
      }
      throw new Error("Failed to fetch reading stats");
    }

    const response = await res.json();
    return response.success ? response.data : response;
  } catch (error) {
    console.error("getReadingStats error:", error);
    throw error;
  }
}

// PATCH /api/books/:id/status - Actualizar estado de lectura
export async function updateReadingStatus(bookId, status) {
  try {
    const res = await fetch(`${API_URL}/${bookId}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ readingStatus: status }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Authentication required. Please login.");
      }
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update reading status");
    }

    const response = await res.json();
    return response.success ? response.data : response;
  } catch (error) {
    console.error("updateReadingStatus error:", error);
    throw error;
  }
}
