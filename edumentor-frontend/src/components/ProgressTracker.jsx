import { useState, useEffect } from "react";
import axios from "axios";

function ProgressTracker({ refreshTrigger }) {
  const [quizzes, setQuizzes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQuizzes = async (newPage = 1, reset = false) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/quiz/progress?page=${newPage}&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuizzes(reset ? res.data.quizzes : [...quizzes, ...res.data.quizzes]);
      setHasMore(res.data.hasMore);
      setPage(newPage);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes(1, true); // fetch first page on mount or refresh
  }, [refreshTrigger]);

  return (
    <div className="flex flex-col gap-3 max-h-96 overflow-y-auto p-2">
      {quizzes.length === 0 && !loading && (
        <p className="text-gray-500 text-center py-10">No quizzes taken yet.</p>
      )}

      {quizzes.map((q, idx) => (
        <div key={q._id} className="p-3 border rounded-lg bg-blue-50 shadow-sm">
          <p className="font-medium text-blue-700">
            {q.noteTitle || "Untitled Note"}
          </p>
          <p className="text-gray-700">
            Score: {q.score} / {q.total}
          </p>
          <p className="text-gray-400 text-sm">
            {q.submittedAt
              ? new Date(q.submittedAt).toLocaleString()
              : "Not submitted"}
          </p>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={() => fetchQuizzes(page + 1)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}

export default ProgressTracker;
