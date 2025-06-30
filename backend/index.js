const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth");
const adminRoutes = require("./adminRoutes");
const usersRouter = require("./users");
const grammarRouter = require("./grammar");
const vocabularyRouter = require("./vocabulary");
const readingPassagesRoutes = require("./readingPassages"); // <-- Lo agregamos aquí
const readingQuestionsRoutes = require("./readingQuestions");
const evaluationRoutes = require("./evaluation");
const fullTestRouter = require("./fullTest");
const testAttemptsRoutes = require("./testAttempts");
const testAttemptAnswersRoutes = require("./testAttemptAnswers");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas de registro y login
app.use("/api", authRoutes);

// Rutas protegidas de administración
app.use("/", adminRoutes);
app.use("/api", testAttemptsRoutes);
app.use("/api", testAttemptAnswersRoutes);

// Rutas de usuarios
app.use("/api", usersRouter);

// Rutas de gramática
app.use("/api", grammarRouter);

// Rutas de vocabulario
app.use("/api", vocabularyRouter);

// Rutas de Reading Passages 
app.use("/api", readingPassagesRoutes);

// Rutas de Reading Questions
app.use("/api", readingQuestionsRoutes);

app.use("/api", evaluationRoutes);

app.use("/api", fullTestRouter);

// Ahora sí al final arrancamos el servidor:
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
