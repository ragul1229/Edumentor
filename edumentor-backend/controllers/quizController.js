import Quiz from "../models/Quiz.js";
import Note from "../models/Note.js";

// ... your existing constants & helper functions ...
const STOPWORDS = new Set([
  "the","and","a","an","is","are","was","were","in","on","at","to","for","of","with",
  "that","this","it","be","by","as","from","or","we","you","I","your","our"
]);

const FALLBACK_DISTRACTORS = [
  "knowledge","experience","technology","development","practice","training",
  "project","system","method","process","skill","responsibility"
];

// 🛠️ Helper functions
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function cleanWord(w) {
  return w.replace(/[^a-zA-Z0-9-]/g, "").trim();
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export const generateQuiz = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user?.id || null;

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const summary = (note.summary || "").trim();
    if (!summary || summary.length < 20) {
      return res.status(400).json({ message: "Summary too short to generate quiz" });
    }

    const sentences = summary
      .split(/[.?!]/)
      .map(s => s.trim())
      .filter(s => s.length > 20);

    if (sentences.length === 0) {
      return res.status(400).json({ message: "Not enough content to generate quiz" });
    }

    const allWordsRaw = summary.split(/\s+/);
    const allWordsFiltered = Array.from(new Set(
      allWordsRaw
        .map(cleanWord)
        .filter(w => w && !STOPWORDS.has(w.toLowerCase()) && w.length > 2)
    ));

    const questions = [];

    for (let i = 0; i < Math.min(5, sentences.length); i++) {
      const sentence = sentences[i];
      const wordsInSentence = sentence.split(/\s+/)
        .map(cleanWord)
        .filter(w => w && !STOPWORDS.has(w.toLowerCase()) && w.length > 2);

      let answer = null;
      if (wordsInSentence.length) {
        wordsInSentence.sort((a,b) => b.length - a.length);
        answer = wordsInSentence[0];
      } else {
        const fallback = sentence.split(/\s+/).map(cleanWord).filter(Boolean);
        answer = fallback.sort((a,b) => b.length - a.length)[0] || null;
      }

      if (!answer) continue;

      const re = new RegExp(`\\b${escapeRegExp(answer)}\\b`);
      let questionText = sentence.replace(re, "_____");

      const distractors = new Set();
      while (distractors.size < 3) {
        const pickSource = Math.random() < 0.8 ? allWordsFiltered : FALLBACK_DISTRACTORS;
        const candidate = pickSource[Math.floor(Math.random() * pickSource.length)];
        if (!candidate) break;
        if (candidate.toLowerCase() !== answer.toLowerCase() && !distractors.has(candidate)) {
          distractors.add(candidate);
        }
        if (distractors.size < 3 && allWordsFiltered.length < 4) {
          for (const f of FALLBACK_DISTRACTORS) {
            if (distractors.size >= 3) break;
            if (f.toLowerCase() !== answer.toLowerCase()) distractors.add(f);
          }
        }
      }

      const options = shuffle([answer, ...Array.from(distractors)]);
      while (options.length < 4) {
        const filler = FALLBACK_DISTRACTORS[Math.floor(Math.random() * FALLBACK_DISTRACTORS.length)];
        if (!options.includes(filler)) options.push(filler);
      }

      questions.push({
        question: `Q${i + 1}: ${questionText}`,
        options,
        answer
      });
    }

    if (questions.length === 0) {
      return res.status(400).json({ message: "Could not create quiz from content" });
    }

    const quiz = new Quiz({ userId, noteId, questions });
    await quiz.save();

    res.status(201).json({ message: "Quiz generated successfully", quiz });
  } catch (err) {
    console.error("Quiz generation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add this function below generateQuiz

// Submit quiz answers and calculate score
// controllers/quizController.js
export const submitQuiz = async (req, res) => {
  try {
    const { noteId, answers } = req.body;
    const userId = req.user.id;

    // find the quiz to grade
    const quiz = await Quiz.findOne({ userId, noteId });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // calculate score
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] && answers[i] === q.answer) score++;
    });

    quiz.score = score;
    quiz.submittedAt = Date.now();  // ✅ always set submission time

    await quiz.save();

    res.json({ score, total: quiz.questions.length });
  } catch (err) {
    console.error("Submit quiz error:", err);
    res.status(500).json({ message: "Failed to submit quiz" });
  }
};


// Get paginated quiz progress for a user
export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken middleware
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const totalQuizzes = await Quiz.countDocuments({ userId });

    const quizzes = await Quiz.find({ userId })
      .sort({ submittedAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("noteId", "title"); // fetch note title if you want

    res.json({
      quizzes: quizzes.map(q => ({
        _id: q._id,
        noteTitle: q.noteId?.title || "Untitled Note",
        score: q.score,
        total: q.questions.length,
        submittedAt: q.submittedAt,
      })),
      hasMore: page * limit < totalQuizzes,
    });
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ message: "Failed to fetch quiz history" });
  }
};