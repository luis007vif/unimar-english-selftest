import { useNavigate } from "react-router-dom";

export default function BancoPreguntas() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-4">Banco de Preguntas</h1>

        <button onClick={() => navigate("/admin/preguntas/grammar")} className="bg-blue-900 text-white w-full p-3 rounded hover:bg-blue-800">
          📝 Preguntas de Gramática
        </button>

        <button onClick={() => navigate("/admin/preguntas/vocabulary")} className="bg-blue-900 text-white w-full p-3 rounded hover:bg-blue-800">
          📝 Preguntas de Vocabulario
        </button>

        <button onClick={() => navigate("/admin/preguntas/reading-passages")} className="bg-blue-900 text-white w-full p-3 rounded hover:bg-blue-800">
          📚 Lecturas (Reading Passages)
        </button>

        <button onClick={() => navigate("/admin/preguntas/reading-questions")} className="bg-blue-900 text-white w-full p-3 rounded hover:bg-blue-800">
          📝 Preguntas de Comprensión Lectora
        </button>

        <button onClick={() => navigate("/admin-panel")} className="bg-gray-400 text-white w-full p-3 rounded hover:bg-gray-500">
          🔙 Volver al Panel
        </button>
      </div>
    </div>
  );
}
