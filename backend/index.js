const express = require("express");
const cors = require("cors");
const authRoutes = require("./auth");
const adminRoutes = require("./adminRoutes");
const usersRouter = require("./users");
const grammarRouter = require("./grammar");
const vocabularyRouter = require("./vocabulary");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas de registro y login
app.use("/api", authRoutes);

// Rutas protegidas de administración
app.use("/", adminRoutes);

// Rutas de usuarios
app.use("/api", usersRouter);

// Rutas de gramática
app.use("/api", grammarRouter);

// Rutas de vocabulario
app.use("/api", vocabularyRouter);

// Ahora sí al final arrancamos el servidor:
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
