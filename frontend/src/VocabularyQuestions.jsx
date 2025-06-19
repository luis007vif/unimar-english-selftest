import React, { useEffect, useState } from "react";

export default function VocabularyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [word, setWord] = useState("");
  const [correctDefinition, setCorrectDefinition] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const token = localStorage.getItem("token");

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/vocabulary-questions?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setQuestions(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  const handleCreate = async () => {
    if (!word || !correctDefinition || !optionA || !optionB || !optionC || !optionD) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      await fetch(`/api/vocabulary-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          word,
          correct_definition: correctDefinition,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD
        })
      });

      setWord("");
      setCorrectDefinition("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      fetchQuestions();
    } catch (error) {
      console.error("Error al crear pregunta:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta pregunta?")) return;

    try {
      await fetch(`/api/vocabulary-questions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuestions();
    } catch (error) {
      console.error("Error al eliminar pregunta:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Preguntas de Vocabulario</h1>

        <div className="mb-6">
          <input className="border p-2 w-full mb-2" placeholder="Palabra" value={word} onChange={(e) => setWord(e.target.value)} />
          <input className="border p-2 w-full mb-2" placeholder="Definición correcta" value={correctDefinition} onChange={(e) => setCorrectDefinition(e.target.value)} />
          <input className="border p-2 w-full mb-2" placeholder="Opción A" value={optionA} onChange={(e) => setOptionA(e.target.value)} />
          <input className="border p-2 w-full mb-2" placeholder="Opción B" value={optionB} onChange={(e) => setOptionB(e.target.value)} />
          <input className="border p-2 w-full mb-2" placeholder="Opción C" value={optionC} onChange={(e) => setOptionC(e.target.value)} />
          <input className="border p-2 w-full mb-4" placeholder="Opción D" value={optionD} onChange={(e) => setOptionD(e.target.value)} />
          <button className="bg-blue-900 text-white px-4 py-2 rounded" onClick={handleCreate}>Guardar pregunta</button>
        </div>

        <table className="w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Palabra</th>
              <th className="border p-2">Definición Correcta</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td className="border p-2">{q.word}</td>
                <td className="border p-2">{q.correct_definition}</td>
                <td className="border p-2">
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(q.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-center items-center space-x-4">
          <button className="bg-blue-900 text-white px-3 py-1 rounded" disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
          <span>Página {page} de {totalPages}</span>
          <button className="bg-blue-900 text-white px-3 py-1 rounded" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}
