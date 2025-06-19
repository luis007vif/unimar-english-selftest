const express = require("express");
const db = require("./db");
const router = express.Router();
const verifyToken = require("./middleware/verifyToken");

// Obtener usuarios paginados
router.get("/users", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const users = await db.query(
      "SELECT id, name, email, created_at FROM students ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const total = await db.query("SELECT COUNT(*) FROM students");

    res.json({
      data: users.rows,
      total: parseInt(total.rows[0].count),
      page,
      limit
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
});

// Eliminar usuario por ID
router.delete("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM students WHERE id = $1", [id]);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
});

module.exports = router;
