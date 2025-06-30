const express = require("express");
const router = express.Router();
const db = require("./db");
const verifyToken = require("./middleware/verifyToken");

// Obtener detalle enriquecido del intento
router.get("/test-attempt-answers/:attemptId", verifyToken, async (req, res) => {
  try {
    const attemptId = req.params.attemptId;
    const studentId = req.user.id;

    // Primero verificamos que el intento le pertenece al usuario
    const check = await db.query(
      `SELECT id FROM test_attempts WHERE id = $1 AND student_id = $2`,
      [attemptId, studentId]
    );

    if (check.rowCount === 0) {
      return res.status(403).json({ message: "No autorizado." });
    }

    // Obtenemos todas las respuestas del intento
    const result = await db.query(
      `SELECT id, question_type, question_id, student_answer, correct_answer, is_correct 
       FROM test_attempt_answers 
       WHERE attempt_id = $1 ORDER BY id`,
      [attemptId]
    );

    const enrichedAnswers = [];

    // Recorremos cada respuesta para traer el texto de la pregunta
    for (const row of result.rows) {
      let questionText = "";

      if (row.question_type === "gramatica") {
        const q = await db.query(
          `SELECT question FROM grammar_questions WHERE id = $1`,
          [row.question_id]
        );
        if (q.rowCount > 0) {
          questionText = q.rows[0].question;
        }
      } else if (row.question_type === "vocabulario") {
        const q = await db.query(
          `SELECT word FROM vocabulary_questions WHERE id = $1`,
          [row.question_id]
        );
        if (q.rowCount > 0) {
          questionText = q.rows[0].word; // El vocabulario es la definición
        }
      } else if (row.question_type === "comprension") {
        const q = await db.query(
          `SELECT question FROM reading_questions WHERE id = $1`,
          [row.question_id]
        );
        if (q.rowCount > 0) {
          questionText = q.rows[0].question;
        }
      }

      enrichedAnswers.push({
        id: row.id,
        question_type: row.question_type,
        question_id: row.question_id,
        question_text: questionText,
        student_answer: row.student_answer,
        correct_answer: row.correct_answer,
        is_correct: row.is_correct
      });
    }

    res.json(enrichedAnswers);

  } catch (error) {
    console.error("Error al obtener detalle enriquecido:", error);
    res.status(500).json({ message: "Error al obtener detalle del intento." });
  }
});

module.exports = router;
