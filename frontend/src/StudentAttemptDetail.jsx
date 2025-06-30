import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentAttemptDetail() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchAttemptDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:3001/api/test-attempt-answers/${attemptId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Error al obtener detalle de intento");
        }

        const data = await response.json();
        setAnswers(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchAttemptDetail();
  }, [attemptId]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Detalle del Examen
        </h1>

        {answers.length === 0 ? (
          <p className="text-center">Cargando respuestas...</p>
        ) : (
          answers.map((a, idx) => (
            <div key={a.id} className="mb-4 p-4 border rounded bg-gray-50">
              <p className="mb-2">
                <strong>Pregunta {idx + 1} ({a.question_type.toUpperCase()}):</strong>
              </p>
              <p className="mb-2 text-gray-800">{a.question_text}</p>

              <div className="mt-2">
                <p>
                  Tu respuesta:{" "}
                  <span
                    className={
                      a.is_correct
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {a.student_answer}
                  </span>
                  {a.is_correct ? " ✅" : " ❌"}
                </p>

                {!a.is_correct && (
                  <p>
                    Respuesta correcta:{" "}
                    <span className="text-green-600 font-bold">
                      {a.correct_answer}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/student-attempts")}
            className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800"
          >
            Volver al historial
          </button>
        </div>
      </div>
    </div>
  );
}
