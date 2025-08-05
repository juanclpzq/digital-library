const axios = require("axios");

class BookMetadataService {
  // Google Books API
  static async searchGoogleBooks(query, apiKey) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes`,
        {
          params: {
            q: query,
            key: apiKey,
            maxResults: 10,
          },
        }
      );

      return (
        response.data.items?.map((item) => ({
          googleBooksId: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.join(", "),
          description: item.volumeInfo.description,
          isbn: item.volumeInfo.industryIdentifiers?.find(
            (id) => id.type === "ISBN_13"
          )?.identifier,
          isbn13: item.volumeInfo.industryIdentifiers?.find(
            (id) => id.type === "ISBN_13"
          )?.identifier,
          publishedDate: item.volumeInfo.publishedDate,
          publisher: item.volumeInfo.publisher,
          pages: item.volumeInfo.pageCount,
          categories: item.volumeInfo.categories,
          averageRating: item.volumeInfo.averageRating,
          ratingsCount: item.volumeInfo.ratingsCount,
          coverImage: item.volumeInfo.imageLinks?.thumbnail,
          language: item.volumeInfo.language,
        })) || []
      );
    } catch (error) {
      console.error("Google Books API Error:", error.message);
      return [];
    }
  }

  // Open Library API
  static async searchOpenLibrary(query) {
    try {
      const response = await axios.get(`https://openlibrary.org/search.json`, {
        params: {
          q: query,
          limit: 10,
        },
      });

      return (
        response.data.docs?.map((doc) => ({
          openLibraryId: doc.key,
          title: doc.title,
          author: doc.author_name?.join(", "),
          isbn: doc.isbn?.[0],
          publishedDate: doc.first_publish_year,
          publisher: doc.publisher?.[0],
          pages: doc.number_of_pages_median,
          subjects: doc.subject,
          language: doc.language?.[0],
        })) || []
      );
    } catch (error) {
      console.error("Open Library API Error:", error.message);
      return [];
    }
  }

  // Combinar resultados de múltiples APIs
  static async enrichBookMetadata(bookData) {
    const searchQuery = `${bookData.title} ${bookData.author}`.trim();

    const [googleResults, openLibraryResults] = await Promise.all([
      this.searchGoogleBooks(searchQuery, process.env.GOOGLE_BOOKS_API_KEY),
      this.searchOpenLibrary(searchQuery),
    ]);

    // Encontrar la mejor coincidencia
    const bestMatch = googleResults[0] || openLibraryResults[0];

    if (bestMatch) {
      return {
        ...bookData,
        ...bestMatch,
        // Preservar datos originales si existen
        title: bookData.title || bestMatch.title,
        author: bookData.author || bestMatch.author,
        description: bookData.description || bestMatch.description,
        enriched: true,
        enrichmentDate: new Date(),
      };
    }

    return bookData;
  }

  // Obtener metadata por ISBN
  static async getBookByISBN(isbn) {
    try {
      // Probar Google Books primero
      const googleResponse = await axios.get(
        `https://www.googleapis.com/books/v1/volumes`,
        {
          params: {
            q: `isbn:${isbn}`,
            key: process.env.GOOGLE_BOOKS_API_KEY,
          },
        }
      );

      if (googleResponse.data.items && googleResponse.data.items.length > 0) {
        const book = googleResponse.data.items[0];
        return {
          source: "google-books",
          googleBooksId: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors?.join(", "),
          description: book.volumeInfo.description,
          isbn: isbn,
          publishedDate: book.volumeInfo.publishedDate,
          publisher: book.volumeInfo.publisher,
          pages: book.volumeInfo.pageCount,
          categories: book.volumeInfo.categories,
          averageRating: book.volumeInfo.averageRating,
          ratingsCount: book.volumeInfo.ratingsCount,
          coverImage: book.volumeInfo.imageLinks?.thumbnail,
          language: book.volumeInfo.language,
        };
      }

      // Si Google Books no encuentra nada, probar Open Library
      const openLibraryResponse = await axios.get(
        `https://openlibrary.org/api/books`,
        {
          params: {
            bibkeys: `ISBN:${isbn}`,
            format: "json",
            jscmd: "data",
          },
        }
      );

      const openLibraryData = openLibraryResponse.data[`ISBN:${isbn}`];
      if (openLibraryData) {
        return {
          source: "open-library",
          openLibraryId: openLibraryData.key,
          title: openLibraryData.title,
          author: openLibraryData.authors?.map((a) => a.name).join(", "),
          isbn: isbn,
          publishedDate: openLibraryData.publish_date,
          publisher: openLibraryData.publishers?.[0]?.name,
          pages: openLibraryData.number_of_pages,
          subjects: openLibraryData.subjects?.map((s) => s.name),
          coverImage: openLibraryData.cover?.medium,
        };
      }

      return null;
    } catch (error) {
      console.error("ISBN lookup error:", error.message);
      return null;
    }
  }
}

module.exports = BookMetadataService;
