import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function StudentAttemptDetail() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttemptDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3001/api/test-attempt-answers/${attemptId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener detalle de intento");
        }

        const data = await response.json();
        setAnswers(data);
      } catch (error) {
        setError("No se pudo cargar el detalle del examen.");
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptDetail();
  }, [attemptId]);

  const exportarAPdf = () => {
    const input = document.getElementById("detalle-examen");
    const pdf = new jsPDF("p", "mm", "a4");
    const scale = 2;

    html2canvas(input, { scale, scrollY: -window.scrollY }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save("resultado_examen.pdf");
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div
        id="detalle-examen"
        className="bg-white shadow-md p-6 rounded-xl w-full max-w-4xl"
      >
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
          Detalle del Examen
        </h1>

        {loading ? (
          <p className="text-center">Cargando respuestas...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : answers.length === 0 ? (
          <p className="text-center text-gray-600">
            No se encontraron respuestas para este intento.
          </p>
        ) : (
          answers.map((a, idx) => (
            <div
              key={a.id}
              className="mb-4 p-4 border rounded bg-gray-50 break-inside-avoid"
            >
              <p className="mb-2">
                <strong>
                  Pregunta {idx + 1} ({a.question_type.toUpperCase()}):
                </strong>
              </p>
              <p className="mb-2 text-gray-800">{a.question_text}</p>

              <div className="mt-2">
                <p>
                  <span className="font-semibold">Tu respuesta:</span>{" "}
                  <span
                    className={
                      a.is_correct
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {(a.question_type === "gramatica" ||
                    a.question_type === "comprension") ? (
                      <>
                        {a.student_answer}
                        {a.student_answer_text ? ` - ${a.student_answer_text}` : ""}
                      </>
                    ) : (
                      <>{a.student_answer_text || a.student_answer}</>
                    )}
                  </span>
                  {a.is_correct ? " ✅" : " ❌"}
                </p>

                {!a.is_correct && (
                  <p>
                    <span className="font-semibold">Respuesta correcta:</span>{" "}
                    <span className="text-green-600 font-bold">
                      {(a.question_type === "gramatica" ||
                      a.question_type === "comprension") ? (
                        <>
                          {a.correct_answer}
                          {a.correct_answer_text ? ` - ${a.correct_answer_text}` : ""}
                        </>
                      ) : (
                        <>{a.correct_answer_text || a.correct_answer}</>
                      )}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => navigate("/student-attempts")}
          className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800"
        >
          Volver al historial
        </button>
        {answers.length > 0 && (
          <button
            onClick={exportarAPdf}
            className="bg-green-700 text-white py-2 px-6 rounded hover:bg-green-600"
          >
            Exportar a PDF
          </button>
        )}
      </div>
    </div>
  );
}
