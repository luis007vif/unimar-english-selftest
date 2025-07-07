import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const opciones = ["option_a", "option_b", "option_c", "option_d"];
const letras = ["A", "B", "C", "D"];

const SelfTest = () => {
  const [seccionActual, setSeccionActual] = useState("gramatica");
  const [respuestas, setRespuestas] = useState({});
  const [tiempoRestante, setTiempoRestante] = useState(300);
  const [preguntas, setPreguntas] = useState({
    gramatica: [],
    vocabulario: [],
    comprension: []
  });
  const [finalizado, setFinalizado] = useState(false);
  const [resultado, setResultado] = useState({ total: 0, correctas: 0, incorrectas: 0, porcentaje: 0 });
  const [ultimoAttemptId, setUltimoAttemptId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/full-test-questions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Error al obtener las preguntas");
        }

        const data = await response.json();
        setPreguntas(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    obtenerPreguntas();
  }, []);

  useEffect(() => {
    if (tiempoRestante <= 0) {
      handleSiguiente();
      return;
    }
    const timer = setInterval(() => {
      setTiempoRestante(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante]);

  const manejarRespuesta = (preguntaId, valor) => {
    const key = `${seccionActual}-${preguntaId}`;
    setRespuestas(prev => {
      const valorActual = prev[key];
      if (valorActual === valor) {
        const nuevasRespuestas = { ...prev };
        delete nuevasRespuestas[key];
        return nuevasRespuestas;
      }
      return {
        ...prev,
        [key]: valor
      };
    });
  };

  const handleSiguiente = () => {
    if (seccionActual === "gramatica") {
      setSeccionActual("vocabulario");
      setTiempoRestante(300);
    } else if (seccionActual === "vocabulario") {
      setSeccionActual("comprension");
      setTiempoRestante(600);
    } else if (seccionActual === "comprension") {
      finalizarPrueba();
    }
  };

  const finalizarPrueba = async () => {
    let total = 0;
    let correctas = 0;
    const detalleRespuestas = [];

    // Gramática
    preguntas.gramatica.forEach((p) => {
      total++;
      const key = `gramatica-${p.id}`;
      const respuestaEstudiante = (respuestas[key] || "").trim().toUpperCase();
      const respuestaCorrecta = (p.correct_option || "").trim().toUpperCase();
      const esCorrecta = respuestaEstudiante === respuestaCorrecta;
      if (respuestaEstudiante && esCorrecta) correctas++;

      detalleRespuestas.push({
        question_type: "gramatica",
        question_id: p.id,
        student_answer: respuestaEstudiante,
        correct_answer: respuestaCorrecta,
        is_correct: esCorrecta
      });
    });

    // Vocabulario
    preguntas.vocabulario.forEach((p) => {
      total++;
      const key = `vocabulario-${p.id}`;
      const respuestaEstudiante = (respuestas[key] || "").trim().toLowerCase();
      const respuestaCorrecta = (p.correct_definition || "").trim().toLowerCase();
      const esCorrecta = respuestaEstudiante && respuestaEstudiante === respuestaCorrecta;
      if (esCorrecta) correctas++;

      detalleRespuestas.push({
        question_type: "vocabulario",
        question_id: p.id,
        student_answer: respuestaEstudiante,
        correct_answer: respuestaCorrecta,
        is_correct: esCorrecta
      });
    });

    // Comprensión
    preguntas.comprension.forEach((p) => {
      total++;
      const key = `comprension-${p.id}`;
      const respuestaEstudiante = (respuestas[key] || "").trim().toUpperCase();
      const respuestaCorrecta = (p.correct_option || "").trim().toUpperCase();
      const esCorrecta = respuestaEstudiante === respuestaCorrecta;
      if (respuestaEstudiante && esCorrecta) correctas++;

      detalleRespuestas.push({
        question_type: "comprension",
        question_id: p.id,
        student_answer: respuestaEstudiante,
        correct_answer: respuestaCorrecta,
        is_correct: esCorrecta
      });
    });

    const incorrectas = total - correctas;
    const respondidas = Object.keys(respuestas).length;
    const porcentaje = ((correctas / total) * 100).toFixed(2);
    const aprobado = porcentaje >= 80;

    setResultado({
      total,
      correctas,
      incorrectas,
      porcentaje
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/test-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          total_questions: total,
          answered_questions: respondidas,
          correct_answers: correctas,
          incorrect_answers: incorrectas,
          score: porcentaje,
          passed: aprobado
        })
      });

      if (!response.ok) throw new Error("Error al guardar intento");

      const result = await response.json();
      setUltimoAttemptId(result.attempt_id); // Guardamos el id del intento

      await fetch("http://localhost:3001/api/test-attempt-answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          attempt_id: result.attempt_id,
          answers: detalleRespuestas
        })
      });

      console.log("Intento y detalle guardado correctamente.");
    } catch (error) {
      console.error("Error al guardar el intento:", error);
    }

    setFinalizado(true);
  };

  const formatearTiempo = (segundos) => {
    const min = Math.floor(segundos / 60).toString().padStart(2, "0");
    const sec = (segundos % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  if (finalizado) {
    const respondidas = Object.keys(respuestas).length;
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
        <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Resultados de la Autoevaluación</h1>
          <p className="text-xl mb-2">
            Total de preguntas: <strong>{resultado.total}</strong>
          </p>
          <p className="text-xl mb-2">
            Preguntas respondidas: <strong>{respondidas}</strong>
          </p>
          <p className="text-xl mb-2">
            Correctas: <strong>{resultado.correctas}</strong>
          </p>
          <p className="text-xl mb-2">
            Incorrectas: <strong>{resultado.incorrectas}</strong>
          </p>
          <p className="text-xl mb-2">
            Puntaje: <strong>{resultado.porcentaje}%</strong>
          </p>
          <p className="text-2xl font-semibold mt-4">
            {resultado.porcentaje >= 80
              ? "¡Apto para presentar la prueba oficial!"
              : resultado.porcentaje >= 60
              ? "Nivel aceptable, pero debes repasar."
              : "Debes prepararte mejor antes de presentar la prueba oficial."}
          </p>

          <div className="mt-6">
            <button
              onClick={() => {
                if (ultimoAttemptId) {
                  navigate(`/student-attempts/${ultimoAttemptId}`);
                }
              }}
              className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800"
              disabled={!ultimoAttemptId}
            >
              Ver resultados detallados
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={() => (window.location.href = "/student-dashboard")}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-500"
            >
              Volver al Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderiza preguntas
  const renderPreguntas = () => {
    let preguntasSeccion = preguntas[seccionActual];
    if (preguntasSeccion.length === 0) return <p>Cargando preguntas...</p>;

    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
        <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-5xl">
          <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            {seccionActual.toUpperCase()}
          </h1>

          {preguntasSeccion.map((p, idx) => {
            const key = `${seccionActual}-${p.id}`;
            return (
              <div key={key} className="mb-6 border p-4 rounded">
                {seccionActual === "comprension" && p.passage && (
                  <div className="mb-4 bg-blue-100 p-2 rounded">
                    <p>{p.passage}</p>
                  </div>
                )}
                <h3 className="font-bold mb-2">{idx + 1}. {p.question}</h3>
                {opciones.map((optionKey, i) => {
                  const optionLabel = p[optionKey];
                  if (!optionLabel) return null;
                  let value = optionLabel;
                  if (seccionActual === "gramatica" || seccionActual === "comprension") {
                    value = letras[i];
                  }
                  return (
                    <div key={optionKey} className="mb-1">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${key}`}
                          value={value}
                          checked={respuestas[key] === value}
                          onChange={() => manejarRespuesta(p.id, value)}
                          className="mr-2"
                        />
                        {optionLabel}
                      </label>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="text-center my-4">
        <h2 className="text-2xl font-semibold">
          Tiempo restante: <span className="text-red-600">{formatearTiempo(tiempoRestante)}</span>
        </h2>
      </div>
      {renderPreguntas()}
      <div className="flex justify-center my-6">
        <button
          onClick={handleSiguiente}
          className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800"
        >
          Siguiente sección
        </button>
      </div>
    </div>
  );
};

export default SelfTest;
