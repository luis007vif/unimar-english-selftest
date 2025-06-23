import React, { useState, useEffect } from "react";
import { apiFetch } from "./utils/apiFetch";

export default function Evaluation() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const fetchQuestions = async () => {
    try {
      const data = await apiFetch("/evaluation-questions");
      const combined = [
        ...data.grammar.map(q => ({ ...q, type: "grammar" })),
        ...data.vocabulary.map(q => ({ ...q, type: "vocabulary" })),
        ...data.reading.map(q => ({
          ...q,
          type: "reading",
          passage: q.passage_text,
          passage_title: q.passage_title
        }))
      ];
      setQuestions(combined);
    } catch (err) {
      console.error("Error al obtener preguntas:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => {
      const key = `${q.type}-${q.id}`;
      if (
        (q.type === "vocabulary" && answers[key] === q.word) || 
        (q.type !== "vocabulary" && answers[key]?.toUpperCase() === q.correct_option.toUpperCase())
      ) {
        correct++;
      }
    });
    const percentage = (correct / questions.length) * 100;
    setScore(percentage.toFixed(2));
    setSubmitted(true);

    if (percentage >= 80) {
      setFeedback("¡Excelente! Estás listo para presentar la prueba oficial.");
    } else if (percentage >= 60) {
      setFeedback("Buen resultado, pero sería recomendable repasar algunos temas antes de la prueba.");
    } else {
      setFeedback("Se recomienda estudiar más antes de presentar la prueba oficial.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
        <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Resultados de la Autoevaluación</h1>
          <p className="text-xl mb-4">Puntaje: <span className="font-bold">{score}%</span></p>
          <p className="text-lg">{feedback}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Prueba de Autoevaluación de Inglés</h1>

        {questions.map((q, idx) => {
          const key = `${q.type}-${q.id}`;
          return (
            <div key={key} className="mb-6 border p-4 rounded">
              {q.type === "reading" && (
                <div className="mb-4 bg-blue-100 p-2 rounded">
                  <h3 className="font-bold mb-2">Lectura: {q.passage_title}</h3>
                  <p>{q.passage}</p>
                </div>
              )}

              <h3 className="font-bold mb-2">
                {idx + 1}.{" "}
                {q.type === "vocabulary"
                  ? `Which word corresponds to the following definition?`
                  : q.question}
              </h3>

              {q.type === "vocabulary" && (
                <p className="italic text-gray-700 mb-2">"{q.correct_definition}"</p>
              )}

              {["A", "B", "C", "D"].map(option => {
                const label = q[`option_${option.toLowerCase()}`];
                const value = (q.type === "vocabulary") ? label : option;
                return (
                  <div key={option} className="mb-1">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${key}`}
                        value={value}
                        checked={answers[key] === value}
                        onChange={(e) => handleAnswer(key, e.target.value)}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800"
          >
            Enviar respuestas
          </button>
        </div>
      </div>
    </div>
  );
}
