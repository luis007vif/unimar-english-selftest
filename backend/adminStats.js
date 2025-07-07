const express = require("express");
const router = express.Router();
const db = require("./db");
const verifyToken = require("./middleware/verifyToken");

// Middleware para verificar que el usuario sea admin
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "No autorizado." });
};

router.get("/admin/stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalStudents = await db.query(`SELECT COUNT(*) FROM students`);
    const totalAttempts = await db.query(`SELECT COUNT(*) FROM test_attempts`);
    const avgScore = await db.query(`SELECT AVG(score) FROM test_attempts`);
    const avgAnswered = await db.query(`SELECT AVG(answered_questions) FROM test_attempts`);
    const avgCorrect = await db.query(`SELECT AVG(correct_answers) FROM test_attempts`);

    res.json({
      totalStudents: Number(totalStudents.rows[0].count),
      totalAttempts: Number(totalAttempts.rows[0].count),
      avgScore: parseFloat(avgScore.rows[0].avg).toFixed(2),
      avgAnswered: parseFloat(avgAnswered.rows[0].avg).toFixed(2),
      avgCorrect: parseFloat(avgCorrect.rows[0].avg).toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Error fetching admin stats" });
  }
});

module.exports = router;
