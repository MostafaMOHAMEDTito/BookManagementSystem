import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    publishedDate: "",
    description: "",
  });
  const [searchTitle, setSearchTitle] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [error, setError] = useState(null);

  // Fetch books when searchTitle or filterYear change
  useEffect(() => {
    fetchBooks();
  }, [searchTitle, filterYear]);

  // Single fetch function
  const fetchBooks = async () => {
    try {
      const params = {};
      if (searchTitle) params.title = searchTitle;
      if (filterYear) params.year = filterYear;
      const response = await axios.get("http://localhost:3000/books/book", {
        params,
      });
      console.log(response.data);

      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch books. Please try again later.");
    }
  };

  const addBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/books", newBook);
      setNewBook({ title: "", author: "", publishedDate: "", description: "" });
      fetchBooks(); // Fetch books after adding a new one
      setError(null);
    } catch (err) {
      setError("Failed to add book. Please try again.");
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/books/${id}`);
      fetchBooks(); // Fetch books after deleting
      setError(null);
    } catch (err) {
      setError("Failed to delete book. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Book Management System</h1>

      {/* Error Message Display */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={addBook} className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={newBook.publishedDate}
            onChange={(e) =>
              setNewBook({ ...newBook, publishedDate: e.target.value })
            }
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={newBook.description}
            onChange={(e) =>
              setNewBook({ ...newBook, description: e.target.value })
            }
          />
        </div>
        <div className="col-md-12">
          <button type="submit" className="btn btn-primary w-100">
            Add Book
          </button>
        </div>
      </form>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="number"
            className="form-control"
            placeholder="Filter by year"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          />
        </div>
      </div>

      <ul className="list-group">
        {books.map((book) => (
          <li
            key={book.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>{book.title}</h5>
              <p className="mb-1">
                by {book.author} -{" "}
                {new Date(book.publishedDate).toLocaleDateString()}
              </p>
              <small>{book.description}</small>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => deleteBook(book.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
