const express = require("express");
const router = express.Router();
const db = require("./db");
const verifyToken = require("./middleware/verifyToken");

// Obtener preguntas de vocabulario
router.get("/vocabulary-questions", verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      "SELECT * FROM vocabulary_questions ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const totalResult = await db.query("SELECT COUNT(*) FROM vocabulary_questions");
    const total = parseInt(totalResult.rows[0].count);

    res.json({ data: result.rows, total });
  } catch (error) {
    console.error("Error al obtener preguntas de vocabulario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Crear nueva pregunta de vocabulario (actualizado a tu estructura de tabla)
router.post("/vocabulary-questions", verifyToken, async (req, res) => {
  try {
    const { word, correct_definition, option_a, option_b, option_c, option_d } = req.body;

    await db.query(
      `INSERT INTO vocabulary_questions (word, correct_definition, option_a, option_b, option_c, option_d)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [word, correct_definition, option_a, option_b, option_c, option_d]
    );

    res.json({ message: "Pregunta de vocabulario creada correctamente" });
  } catch (error) {
    console.error("Error al crear pregunta de vocabulario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Eliminar pregunta de vocabulario
router.delete("/vocabulary-questions/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM vocabulary_questions WHERE id = $1", [id]);

    res.json({ message: "Pregunta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar pregunta de vocabulario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
