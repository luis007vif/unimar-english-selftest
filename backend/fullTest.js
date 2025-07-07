const express = require("express");
const router = express.Router();
const db = require("./db");
const verifyToken = require("./middleware/verifyToken");

router.get("/full-test-questions", verifyToken, async (req, res) => {
  try {
    // Preguntas de gramática: 5
    const grammarResult = await db.query(
      "SELECT id, question, option_a, option_b, option_c, option_d, correct_option FROM grammar_questions ORDER BY RANDOM() LIMIT 5"
    );

    // Preguntas de vocabulario: 5
    // OJO: correct_definition, NO como correct_option
    const vocabularyResult = await db.query(
      "SELECT id, word AS question, option_a, option_b, option_c, option_d, correct_definition FROM vocabulary_questions ORDER BY RANDOM() LIMIT 5"
    );

    // Preguntas de comprensión lectora: 3
    const readingResult = await db.query(
      `SELECT rq.id, rp.passage AS passage, rq.question, rq.option_a, rq.option_b, rq.option_c, rq.option_d, rq.correct_option
       FROM reading_questions rq
       JOIN reading_passages rp ON rq.passage_id = rp.id
       ORDER BY RANDOM() LIMIT 3`
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