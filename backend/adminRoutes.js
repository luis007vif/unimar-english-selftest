const express = require("express");
const router = express.Router();
const pool = require("./db");
const verifyToken = require("./middleware/verifyToken");

router.post("/admin/grammar-questions", verifyToken, async (req, res) => {
  if (req.user.email !== "admin@unimar.edu.ve") {
    return res.status(403).json({ message: "Acceso denegado: no eres administrador" });
  }

  const {
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    option_e,
    correct_option,
    category,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO grammar_questions 
      (question, option_a, option_b, option_c, option_d, option_e, correct_option, category) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [question, option_a, option_b, option_c, option_d, option_e, correct_option, category]
    );

    res.status(201).json({ message: "Pregunta guardada exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al guardar la pregunta" });
  }
});

module.exports = router;
