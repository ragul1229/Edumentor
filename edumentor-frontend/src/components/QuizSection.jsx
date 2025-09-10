// src/components/QuizSection.js
import { useState } from "react";
import axios from "axios";

function QuizSection({ noteId }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const generateQuiz = async () => {
    if (!noteId) return alert("Please upload a note first!");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/quiz/generate",
        { noteId }, // <-- send noteId here
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuiz(res.data.quiz);
      setAnswers({});
      setResult(null);
    } catch (err) {
      console.error("Quiz generation failed:", err.response?.data || err.message);
      alert("Failed to generate quiz. Try uploading notes first.");
    }
  };


  const handleAnswer = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const submitQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/quiz/submit",
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      console.error("Quiz submission failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {!quiz ? (
        <button
          onClick={generateQuiz}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Generate Quiz
        </button>
      ) : (
        <div>
          <h4 className="text-lg font-semibold mb-2">Quiz</h4>
          {quiz.questions.map((q, index) => (
            <div key={index} className="mb-4">
              <p className="font-medium">{q.question}</p>
              {q.options.map((opt, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`q-${index}`}
                    value={opt}
                    onChange={() => handleAnswer(index, opt)}
                  />
                  <span className="ml-2">{opt}</span>
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={submitQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Submit Quiz
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 border rounded bg-gray-50">
          <h4 className="font-semibold text-green-600">Your Score</h4>
          <p>
            {result.score} / {result.total}
          </p>
        </div>
      )}
    </div>
  );
}

export default QuizSection;
