import React, { useEffect, useState } from "react";
import { apiFetch } from "./utils/apiFetch";

export default function GrammarQuestions() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: ""
  });

  const limit = 10;

  const fetchQuestions = async () => {
    try {
      const data = await apiFetch(`/grammar-questions?page=${page}&limit=${limit}`);
      setQuestions(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta pregunta?")) return;
    try {
      await apiFetch(`/grammar-questions/${id}`, { method: "DELETE" });
      fetchQuestions();
    } catch (error) {
      console.error("Error al eliminar pregunta:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion({ ...newQuestion, [name]: value });
  };

  const handleCreate = async () => {
    const { question, option_a, option_b, option_c, option_d, correct_option } = newQuestion;

    if (!question || !option_a || !option_b || !option_c || !option_d || !correct_option) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      await apiFetch(`/grammar-questions`, {
        method: "POST",
        body: JSON.stringify(newQuestion),
      });
      setNewQuestion({
        question: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: ""
      });
      fetchQuestions();
    } catch (error) {
      console.error("Error al crear pregunta:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Preguntas de Gramática</h1>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Agregar nueva pregunta</h2>
          <div className="grid grid-cols-1 gap-2">
            <input type="text" name="question" placeholder="Pregunta" value={newQuestion.question} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="text" name="option_a" placeholder="Opción A" value={newQuestion.option_a} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="text" name="option_b" placeholder="Opción B" value={newQuestion.option_b} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="text" name="option_c" placeholder="Opción C" value={newQuestion.option_c} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="text" name="option_d" placeholder="Opción D" value={newQuestion.option_d} onChange={handleInputChange} className="border p-2 rounded" />
            <input type="text" name="correct_option" placeholder="Respuesta correcta (A, B, C, D)" value={newQuestion.correct_option} onChange={handleInputChange} className="border p-2 rounded" />
            <button onClick={handleCreate} className="bg-blue-900 text-white py-2 rounded hover:bg-blue-800">Guardar pregunta</button>
          </div>
        </div>

        <table className="w-full border border-gray-300 mb-4">
          <thead>
            <tr>
              <th className="border p-2">Pregunta</th>
              <th className="border p-2">Correcta</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(questions) && questions.map(q => (
              <tr key={q.id}>
                <td className="border p-2">{q.question}</td>
                <td className="border p-2">{q.correct_option}</td>
                <td className="border p-2">
                  <button onClick={() => handleDelete(q.id)} className="bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center gap-4">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="bg-blue-900 text-white px-3 py-1 rounded">Anterior</button>
          <span>Página {page} de {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="bg-blue-900 text-white px-3 py-1 rounded">Siguiente</button>
        </div>
      </div>
    </div>
  );
}
