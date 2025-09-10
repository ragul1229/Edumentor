import Quiz from "../models/Quiz.js";
import Note from "../models/Note.js";

export const generateQuiz = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const summary = note.summary;

    if (!summary || summary.length < 20) {
      return res.status(400).json({ message: "Summary too short to generate quiz" });
    }

    // Split summary into sentences
    const sentences = summary.split(/[.?!]/).filter(s => s.trim().length > 15);

    if (sentences.length === 0) {
      return res.status(400).json({ message: "Not enough content to generate quiz" });
    }

    // Extract all words for distractors
    const allWords = summary.split(/\s+/).map(w => w.replace(/[^a-zA-Z0-9]/g, "")).filter(Boolean);

    const questions = sentences.slice(0, 5).map((sentence, idx) => {
      const words = sentence.trim().split(" ");
      const randomIndex = Math.floor(Math.random() * words.length);
      const answer = words[randomIndex].replace(/[^a-zA-Z0-9]/g, ""); // clean punctuation

      // Blank out the word in sentence
      const questionText = sentence.replace(words[randomIndex], "_____");

      // Pick distractors from summary
      let distractors = [];
      while (distractors.length < 3) {
        const randWord = allWords[Math.floor(Math.random() * allWords.length)];
        if (randWord && randWord !== answer && !distractors.includes(randWord)) {
          distractors.push(randWord);
        }
      }

      // Combine answer + distractors, then shuffle
      const options = [answer, ...distractors].sort(() => Math.random() - 0.5);

      return {
        question: `Q${idx + 1}: ${questionText}`,
        options,
        answer
      };
    });

    const quiz = new Quiz({ userId, noteId, questions });
    await quiz.save();

    res.status(201).json({ message: "Quiz generated successfully", quiz });
  } catch (err) {
    console.error("Quiz generation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
