import axios from "axios";

// Strips hyphens/spaces so "978-0-13-468599-1" and "9780134685991" both work
const cleanIsbn = (raw) => raw.replace(/[^0-9Xx]/g, "");

const tryGoogleBooks = async (isbn) => {
  const { data } = await axios.get(
    "https://www.googleapis.com/books/v1/volumes",
    { params: { q: `isbn:${isbn}` } },
  );

  const item = data.items?.[0];
  if (!item) return null;

  const info = item.volumeInfo || {};

  return {
    title: info.title || "",
    author: info.authors?.join(", ") || "",
    description: info.description || "",
    coverUrl: info.imageLinks?.thumbnail?.replace("http://", "https://") || "",
    isbn,
    source: "google",
  };
};

const tryOpenLibrary = async (isbn) => {
  const { data } = await axios.get("https://openlibrary.org/api/books", {
    params: {
      bibkeys: `ISBN:${isbn}`,
      format: "json",
      jscmd: "data",
    },
  });

  const book = data[`ISBN:${isbn}`];
  if (!book) return null;

  return {
    title: book.title || "",
    author: book.authors?.map((a) => a.name).join(", ") || "",
    description:
      typeof book.notes === "string" ? book.notes : book.notes?.value || "",
    coverUrl: book.cover?.large || book.cover?.medium || "",
    isbn,
    source: "openlibrary",
  };
};

// GET /api/books/lookup?isbn=9780134685991
export const lookupByIsbn = async (req, res) => {
  try {
    const rawIsbn = req.query.isbn;

    if (!rawIsbn || !rawIsbn.trim()) {
      return res.status(400).json({ success: false, message: "ISBN is required" });
    }

    const isbn = cleanIsbn(rawIsbn.trim());

    if (isbn.length !== 10 && isbn.length !== 13) {
      return res.status(400).json({
        success: false,
        message: "That doesn't look like a valid ISBN (should be 10 or 13 digits)",
      });
    }

    // Try Google Books first (larger catalog, better cover images)
    let result = null;

    try {
      result = await tryGoogleBooks(isbn);
    } catch (err) {
      console.warn("Google Books lookup failed:", err.message);
    }

    // Fall back to Open Library if Google Books had nothing
    if (!result) {
      try {
        result = await tryOpenLibrary(isbn);
      } catch (err) {
        console.warn("Open Library lookup failed:", err.message);
      }
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No book found for this ISBN. Try entering details manually.",
      });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};