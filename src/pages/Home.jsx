import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("movies")) || [];
    setMovies(stored);
  }, []);

  const filtered = movies
    .filter((movie) => genre === "All" || movie.genre === genre)
    .sort((a, b) =>
      sort === "Title"
        ? a.title.localeCompare(b.title)
        : sort === "Rating"
        ? b.rating - a.rating
        : 0
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎬 Movie Tracker</h1>
      <div className="flex gap-4 mb-4">
        <select onChange={(e) => setGenre(e.target.value)} className="border p-2">
          {["All", "Action", "Drama", "Sci-Fi"].map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <select onChange={(e) => setSort(e.target.value)} className="border p-2">
          <option value="">Sort</option>
          <option value="Title">Title</option>
          <option value="Rating">Rating</option>
        </select>
        <Link
          to="/add-movie"
          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Movie
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((m, i) => (
          <Link
            to={`/movie/${m.id}`}
            key={i}
            className="border rounded p-4 hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold">{m.title}</h2>
            <p>{m.director}</p>
            <p>{m.genre}</p>
            <p>{m.year}</p>
            <p>⭐ {m.rating}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
