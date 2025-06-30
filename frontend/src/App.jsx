import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

import LoginPage from "./LoginPage";
import AdminPanel from "./AdminPanel";
import BancoPreguntas from "./BancoPreguntas";
import UsuariosRegistrados from "./UsuariosRegistrados";
import ResultadosPruebas from "./ResultadosPruebas";
import GrammarQuestions from "./GrammarQuestions";
import VocabularyQuestions from "./VocabularyQuestions";
import ReadingPassages from "./ReadingPassages";
import ReadingQuestions from "./ReadingQuestions";
import Instructions from "./Instructions"; 
import Evaluation from "./Evaluation";    
import SelfTest from "./SelfTest";
import StudentDashboard from "./StudentDashboard";
import StudentAttempts from "./StudentAttempts";
import StudentAttemptDetail from "./StudentAttemptDetail";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLoggedIn(true);
        setRole(decoded.role);
      } catch (error) {
        console.error("Token inválido:", error);
        setLoggedIn(false);
        setRole(null);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? (
              role === "admin" ? (
                <Navigate to="/admin-panel" />
              ) : (
                <Navigate to="/instructions" />  // <-- Aquí el cambio importante
              )
            ) : (
              <LoginPage onLogin={() => setLoggedIn(true)} />
            )
          }
        />

        {/* Rutas del administrador */}
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/admin/preguntas" element={<BancoPreguntas />} />
        <Route path="/admin/usuarios" element={<UsuariosRegistrados />} />
        <Route path="/admin/resultados" element={<ResultadosPruebas />} />
        <Route path="/admin/preguntas/grammar" element={<GrammarQuestions />} />
        <Route path="/admin/preguntas/vocabulary" element={<VocabularyQuestions />} />
        <Route path="/admin/preguntas/reading-passages" element={<ReadingPassages />} />
        <Route path="/admin/preguntas/reading-questions" element={<ReadingQuestions />} />

        {/* Rutas del estudiante */}
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/selftest" element={<SelfTest />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-attempts" element={<StudentAttempts />} />
        <Route path="/student-attempts/:attemptId" element={<StudentAttemptDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
