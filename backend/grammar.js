const express = require("express");
const router = express.Router();
const db = require("./db");
const verifyToken = require("./middleware/verifyToken");

// Obtener todas las preguntas de gramática (con paginación opcional)
router.get("/grammar-questions", verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      "SELECT * FROM grammar_questions ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const totalResult = await db.query("SELECT COUNT(*) FROM grammar_questions");
    const total = parseInt(totalResult.rows[0].count);

    res.json({ data: result.rows, total });
  } catch (error) {
    console.error("Error al obtener preguntas de gramática:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Crear nueva pregunta de gramática
router.post("/grammar-questions", verifyToken, async (req, res) => {
  try {
    const { question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;

    await db.query(
      `INSERT INTO grammar_questions (question, option_a, option_b, option_c, option_d, correct_option)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [question_text, option_a, option_b, option_c, option_d, correct_option]
    );

    res.json({ message: "Pregunta de gramática creada correctamente" });
  } catch (error) {
    console.error("Error al crear pregunta de gramática:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Eliminar pregunta de gramática
router.delete("/grammar-questions/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM grammar_questions WHERE id = $1", [id]);

    res.json({ message: "Pregunta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar pregunta de gramática:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
