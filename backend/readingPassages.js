const express = require("express");
const router = express.Router();
const db = require("./db");
const verifyToken = require("./middleware/verifyToken");

// Obtener lista de passages con paginación
router.get("/reading-passages", verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      "SELECT * FROM reading_passages ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const totalResult = await db.query("SELECT COUNT(*) FROM reading_passages");
    const total = parseInt(totalResult.rows[0].count);

    res.json({ data: result.rows, total });
  } catch (error) {
    console.error("Error al obtener los passages:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Crear nuevo passage
router.post("/reading-passages", verifyToken, async (req, res) => {
  try {
    const { title, passage } = req.body;

    await db.query(
      "INSERT INTO reading_passages (title, passage) VALUES ($1, $2)",
      [title, passage]
    );

    res.status(201).json({ message: "Passage creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el passage:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Eliminar passage
router.delete("/reading-passages/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM reading_passages WHERE id = $1", [id]);
    res.json({ message: "Passage eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el passage:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
