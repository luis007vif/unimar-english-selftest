const express = require("express");
const router = express.Router();
const db = require("./db");
const verifyToken = require("./middleware/verifyToken");

router.get("/evaluation-questions", verifyToken, async (req, res) => {
  try {
    // Preguntas de gramática (ya tienen 'question' directamente)
    const grammarResult = await db.query(
      "SELECT id, question, option_a, option_b, option_c, option_d, correct_option FROM grammar_questions ORDER BY RANDOM() LIMIT 10"
    );

    // Preguntas de vocabulario (usamos 'word' como pregunta, y 'correct_definition' como correcta)
    const vocabularyResult = await db.query(
        `SELECT id, word, correct_definition, option_a, option_b, option_c, option_d
        FROM vocabulary_questions
        ORDER BY RANDOM() LIMIT 10`
    );

    // Preguntas de comprensión lectora (normal como lo teníamos)
    const readingResult = await db.query(
      `SELECT rq.id, p.title AS passage_title, p.passage AS passage_text, rq.question, rq.option_a, rq.option_b, rq.option_c, rq.option_d, rq.correct_option 
       FROM reading_questions rq
       JOIN reading_passages p ON rq.passage_id = p.id
       ORDER BY RANDOM() LIMIT 5`
    );

    res.json({
      grammar: grammarResult.rows,
      vocabulary: vocabularyResult.rows,
      reading: readingResult.rows
    });

  } catch (error) {
    console.error("Error al obtener las preguntas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
