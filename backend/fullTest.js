const express = require("express");
const router = express.Router();
const db = require("./db");
const verifyToken = require("./middleware/verifyToken");

router.get("/full-test-questions", verifyToken, async (req, res) => {
  try {
    // Preguntas de gramática
    const grammarResult = await db.query(
      "SELECT id, question, option_a, option_b, option_c, option_d, correct_option FROM grammar_questions ORDER BY RANDOM() LIMIT 10"
    );

    // Preguntas de vocabulario
    const vocabularyResult = await db.query(
      "SELECT id, word AS question, option_a, option_b, option_c, option_d, correct_definition AS correct_option FROM vocabulary_questions ORDER BY RANDOM() LIMIT 10"
    );

    // Preguntas de comprensión lectora
    const readingResult = await db.query(
      `SELECT rq.id, rp.passage AS passage, rq.question, rq.option_a, rq.option_b, rq.option_c, rq.option_d, rq.correct_option
       FROM reading_questions rq
       JOIN reading_passages rp ON rq.passage_id = rp.id
       ORDER BY RANDOM() LIMIT 10`
    );

    res.json({
      gramatica: grammarResult.rows,
      vocabulario: vocabularyResult.rows,
      comprension: readingResult.rows
    });
  } catch (error) {
    console.error("Error al obtener preguntas completas:", error);
    res.status(500).json({ message: "Error al obtener preguntas completas" });
  }
});

module.exports = router;
