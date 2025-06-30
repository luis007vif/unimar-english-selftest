const express = require("express");
const router = express.Router();
const db = require("./db");
const verifyToken = require("./middleware/verifyToken");

// Guardar nuevo intento
router.post("/test-attempts", verifyToken, async (req, res) => {
  try {
    const { total_questions, answered_questions, correct_answers, incorrect_answers, score, passed } = req.body;
    const studentId = req.user.id;

    const result = await db.query(
      `INSERT INTO test_attempts (student_id, total_questions, answered_questions, correct_answers, incorrect_answers, score, passed)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [studentId, total_questions, answered_questions, correct_answers, incorrect_answers, score, passed]
    );

    const attemptId = result.rows[0].id;

    res.status(201).json({ message: "Intento guardado correctamente.", attempt_id: attemptId });
  } catch (error) {
    console.error("Error al guardar intento:", error);
    res.status(500).json({ message: "Error interno al guardar el intento." });
  }
});

// Obtener últimos 3 intentos del estudiante
router.get("/test-attempts", verifyToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await db.query(
      `SELECT id, attempt_date, total_questions, answered_questions, correct_answers, incorrect_answers, score, passed
       FROM test_attempts
       WHERE student_id = $1
       ORDER BY attempt_date DESC
       LIMIT 3`,
      [studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener intentos:", error);
    res.status(500).json({ message: "Error al obtener historial de intentos." });
  }
});

module.exports = router;
