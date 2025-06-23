const express = require("express");
const router = express.Router();
const db = require("./db");
const verifyToken = require("./middleware/verifyToken");

// Obtener lista de preguntas con paginación
router.get("/reading-questions", verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      `SELECT rq.id, rq.passage_id, p.title AS passage_title, rq.question, rq.option_a, rq.option_b, rq.option_c, rq.option_d, rq.correct_option
       FROM reading_questions rq
       JOIN reading_passages p ON rq.passage_id = p.id
       ORDER BY rq.id LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const totalResult = await db.query("SELECT COUNT(*) FROM reading_questions");
    const total = parseInt(totalResult.rows[0].count);

    res.json({ data: result.rows, total });
  } catch (error) {
    console.error("Error al obtener las preguntas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Crear nueva pregunta
router.post("/reading-questions", verifyToken, async (req, res) => {
  try {
    const { passage_id, question, option_a, option_b, option_c, option_d, correct_option } = req.body;

    await db.query(
      `INSERT INTO reading_questions (passage_id, question, option_a, option_b, option_c, option_d, correct_option)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [passage_id, question, option_a, option_b, option_c, option_d, correct_option]
    );

    res.status(201).json({ message: "Pregunta creada exitosamente" });
  } catch (error) {
    console.error("Error al crear la pregunta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Eliminar pregunta
router.delete("/reading-questions/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM reading_questions WHERE id = $1", [id]);
    res.json({ message: "Pregunta eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la pregunta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
