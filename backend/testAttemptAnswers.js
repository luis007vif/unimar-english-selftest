const express = require("express");
const router = express.Router();
const db = require("./db");
const verifyToken = require("./middleware/verifyToken");

// Guardar respuestas del intento (sin cambios)
router.post("/test-attempt-answers", verifyToken, async (req, res) => {
  try {
    const { attempt_id, answers } = req.body;
    if (!attempt_id || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    for (const ans of answers) {
      await db.query(
        `INSERT INTO test_attempt_answers 
          (attempt_id, question_type, question_id, student_answer, correct_answer, is_correct)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          attempt_id,
          ans.question_type,
          ans.question_id,
          ans.student_answer,
          ans.correct_answer,
          ans.is_correct
        ]
      );
    }

    res.json({ message: "Respuestas guardadas correctamente." });
  } catch (error) {
    console.error("Error al guardar respuestas:", error);
    res.status(500).json({ message: "Error al guardar respuestas." });
  }
});

// Obtener detalle enriquecido del intento
router.get("/test-attempt-answers/:attemptId", verifyToken, async (req, res) => {
  try {
    const attemptId = req.params.attemptId;
    const studentId = req.user.id;

    // 1. Validar que el intento le pertenece al estudiante
    const check = await db.query(
      `SELECT id FROM test_attempts WHERE id = $1 AND student_id = $2`,
      [attemptId, studentId]
    );
    if (check.rowCount === 0) {
      return res.status(403).json({ message: "No autorizado." });
    }

    // 2. Obtener todas las respuestas del intento
    const result = await db.query(
      `SELECT id, question_type, question_id, student_answer, correct_answer, is_correct 
       FROM test_attempt_answers 
       WHERE attempt_id = $1 ORDER BY id`,
      [attemptId]
    );

    const enrichedAnswers = [];

    // 3. Recorrer y enriquecer cada respuesta
    for (const row of result.rows) {
      let questionText = "";
      let correctAnswerText = "";
      let studentAnswerText = "";

      // Para gramática y comprensión (opciones A, B, C, D)
      if (row.question_type === "gramatica" || row.question_type === "comprension") {
        // Consulta las opciones de la pregunta
        let optionsQuery, optionNames;
        if (row.question_type === "gramatica") {
          optionsQuery = await db.query(
            `SELECT question, option_a, option_b, option_c, option_d FROM grammar_questions WHERE id = $1`,
            [row.question_id]
          );
        } else {
          optionsQuery = await db.query(
            `SELECT question, option_a, option_b, option_c, option_d FROM reading_questions WHERE id = $1`,
            [row.question_id]
          );
        }
        if (optionsQuery.rowCount > 0) {
          const q = optionsQuery.rows[0];
          questionText = q.question;
          // Mapping letras a texto
          const letraMap = { A: "option_a", B: "option_b", C: "option_c", D: "option_d" };
          correctAnswerText = q[letraMap[row.correct_answer?.toUpperCase()]] || "";
          studentAnswerText = q[letraMap[row.student_answer?.toUpperCase()]] || "";
        }
      } else if (row.question_type === "vocabulario") {
        // Vocabulario: el "word" es la pregunta y las opciones son definiciones
        const q = await db.query(
          `SELECT word, option_a, option_b, option_c, option_d, correct_definition FROM vocabulary_questions WHERE id = $1`,
          [row.question_id]
        );
        if (q.rowCount > 0) {
          const v = q.rows[0];
          questionText = v.word;
          // Busca cuál opción es igual al campo correct_definition
          correctAnswerText =
            [v.option_a, v.option_b, v.option_c, v.option_d].find(opt => opt.trim().toLowerCase() === v.correct_definition.trim().toLowerCase()) || v.correct_definition;
          // El estudiante responde el texto (definición), así que lo mostramos directo
          studentAnswerText = row.student_answer;
        }
      }

      enrichedAnswers.push({
        id: row.id,
        question_type: row.question_type,
        question_id: row.question_id,
        question_text: questionText,
        student_answer: row.student_answer,
        student_answer_text: studentAnswerText,
        correct_answer: row.correct_answer,
        correct_answer_text: correctAnswerText,
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
