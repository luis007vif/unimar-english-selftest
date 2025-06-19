const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();

const router = express.Router();
const SECRET = process.env.SECRET_KEY;

// Registro solo para estudiantes
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 8);

    await db.query(
      "INSERT INTO students (email, password, name) VALUES ($1, $2, $3)",
      [email, hashed, name]
    );

    const result = await db.query("SELECT id FROM students WHERE email = $1", [email]);
    const token = jwt.sign({ id: result.rows[0].id, role: "student" }, SECRET, {
      expiresIn: "2h",
    });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al registrar" });
  }
});

// Login tanto para admin como estudiante
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;
    let role;
    let table;

    // Determinar de qué tabla consultar
    if (email === "admin@unimar.edu.ve") {
      table = "admins";
      role = "admin";
    } else {
      table = "students";
      role = "student";
    }

    const result = await db.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);
    user = result.rows[0];

    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id, role }, SECRET, { expiresIn: "2h" });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

module.exports = router;
