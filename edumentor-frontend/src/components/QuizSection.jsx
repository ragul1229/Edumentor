// src/components/QuizSection.jsx
import { useState, useEffect } from "react";
import axios from "axios";

function QuizSection({ noteId, onQuizSubmit }) {
  const [quiz, setQuiz] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Reset quiz state when a new note is uploaded
  useEffect(() => {
    if (noteId) {
      resetQuizState();
    }
  }, [noteId]);

  const resetQuizState = () => {
    setQuiz(null);
    setQuizId(null);
    setAnswers({});
    setResult(null);
    setError(null);
    setSubmitted(false);
  };

  // Generate quiz
  const generateQuiz = async () => {
    if (!noteId) return alert("Please select a note first!");

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/quiz/generate",
        { noteId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuiz(res.data.quiz);
      setQuizId(res.data.quiz._id);
      setAnswers({});
      setResult(null);
      setSubmitted(false);
    } catch (err) {
      console.error(
        "Quiz generation failed:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswer = (qIndex, option) => {
    if (!submitted) {
      setAnswers({ ...answers, [qIndex]: option });
    }
  };

  // Submit quiz
  const submitQuiz = async () => {
    if (!quizId) return alert("Quiz not generated yet!");

    const totalQuestions = quiz.questions.length;
    if (Object.keys(answers).length < totalQuestions) {
      return alert("Please answer all questions before submitting.");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/quiz/submit",
        { quizId, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(res.data); // contains { score, total }
      setSubmitted(true);

      // ✅ Trigger parent refresh
      if (onQuizSubmit) onQuizSubmit();
    } catch (err) {
      console.error(
        "Quiz submission failed:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to submit quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Generate Quiz Button */}
      {!quiz && !result && (
        <button
          onClick={generateQuiz}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          disabled={loading || !noteId}
        >
          {loading ? "Generating Quiz..." : "Generate Quiz"}
        </button>
      )}

      {/* Quiz Questions */}
      {quiz && !submitted && (
        <div>
          <h4 className="text-lg font-semibold mb-2">Quiz</h4>

          {quiz.questions.map((q, index) => (
            <div key={index} className="mb-4 p-3 border rounded-lg bg-blue-50">
              <p className="font-medium mb-2">{q.question}</p>
              {q.options.map((opt, i) => (
                <label key={i} className="block mb-1 cursor-pointer">
                  <input
                    type="radio"
                    name={`q-${index}`}
                    value={opt}
                    checked={answers[index] === opt}
                    onChange={() => handleAnswer(index, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={submitQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-2"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Quiz"}
          </button>
        </div>
      )}

      {/* Result / Score */}
      {submitted && result && (
        <div className="mt-4 p-3 border rounded-lg bg-green-50 text-center">
          <h4 className="font-semibold text-green-700">✅ Quiz Submitted</h4>
          <p className="text-lg">
            You scored <span className="font-bold">{result.score}</span> out of{" "}
            <span className="font-bold">{result.total}</span>
          </p>

          {/* Retest Option */}
          {result.score / result.total < 0.7 && (
            <button
              onClick={resetQuizState}
              className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              🔄 Take a Retest
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-2 font-medium">{error}</p>}
    </div>
  );
}

export default QuizSection;
