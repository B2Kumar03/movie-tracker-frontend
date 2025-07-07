import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRec, setLoadingRec] = useState(false);

  const GEMINI_API_KEY = "AIzaSyCGjPYkXJBuuanXquJovzuzyskTi6Cifo0"; // Use environment variable

  const fetchRecommendations = async (title, director, genre) => {
    setLoadingRec(true);
    const prompt = `Suggest 3 movies similar to '${title}' directed by ${director} in the ${genre} genre. Return only JSON: [{ "title": "Title", "director": "Director" }]`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonStart = rawText.indexOf("[");
      const jsonEnd = rawText.lastIndexOf("]");
      const jsonString = rawText.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);
      setRecommendations(parsed);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoadingRec(false);
    }
  };

  useEffect(() => {
    const movies = JSON.parse(localStorage.getItem("movies")) || [];
    const found = movies.find((m) => m.id === id);
    if (found) {
      setMovie(found);
      fetchRecommendations(found.title, found.director, found.genre);
    }
  }, [id]);

  const deleteMovie = () => {
    const movies = JSON.parse(localStorage.getItem("movies")) || [];
    localStorage.setItem("movies", JSON.stringify(movies.filter((m) => m.id !== id)));
    navigate("/");
  };

  if (!movie) return <p className="p-6">Movie not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate("/")} className="text-blue-600 mb-4">← Back to Home</button>
      <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
      <p><strong>Director:</strong> {movie.director}</p>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Year:</strong> {movie.year}</p>
      <p><strong>Rating:</strong> ⭐ {movie.rating}</p>
      {movie.synopsis && <p><strong>Synopsis:</strong> {movie.synopsis}</p>}
      <button
        onClick={deleteMovie}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Delete
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">AI Recommendations</h2>

        {loadingRec ? (
          <p className="text-gray-600">Loading recommendations...</p>
        ) : recommendations.length > 0 ? (
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="border p-3 rounded shadow-sm">
                🎬 <strong>{rec.title}</strong> – Directed by {rec.director}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recommendations available.</p>
        )}
      </div>
    </div>
  );
}

export default MovieDetail;
