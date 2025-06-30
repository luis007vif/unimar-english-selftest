import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentAttempts() {
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/test-attempts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Error al obtener intentos");
        }

        const data = await response.json();
        setAttempts(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAttempts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Mis Últimos Intentos
        </h1>

        {attempts.length === 0 ? (
          <p className="text-center">Aún no has realizado ningún intento.</p>
        ) : (
          attempts.map((attempt, idx) => (
            <div key={attempt.id} className="mb-4 p-4 border rounded">
              <p><strong>Intento #{idx + 1}</strong> — {new Date(attempt.attempt_date).toLocaleString()}</p>
              <p>Total preguntas: {attempt.total_questions}</p>
              <p>Respondidas: {attempt.answered_questions}</p>
              <p>Correctas: {attempt.correct_answers}</p>
              <p>Incorrectas: {attempt.incorrect_answers}</p>
              <p>Puntaje: {attempt.score}%</p>
              <p>Resultado: {attempt.passed ? "✅ Apto" : "❌ No apto"}</p>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => navigate(`/student-attempts/${attempt.id}`)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          ))
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/student-dashboard")}
            className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    </div>
  );
}
