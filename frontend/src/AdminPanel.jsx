import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-900">👋 Bienvenido, Admin</h1>
        <p className="text-center text-gray-600">¿Qué deseas hacer hoy?</p>

        <div className="space-y-3">
          <button
            onClick={() => goTo("/admin/preguntas")}
            className="bg-blue-900 text-white w-full p-3 rounded hover:bg-blue-800"
          >
            📚 Gestionar Banco de Preguntas
          </button>

          <button
            onClick={() => goTo("/admin/usuarios")}
            className="bg-blue-900 text-white w-full p-3 rounded hover:bg-blue-800"
          >
            👤 Ver Usuarios Registrados
          </button>

          <button
            onClick={() => goTo("/admin/resultados")}
            className="bg-blue-900 text-white w-full p-3 rounded hover:bg-blue-800"
          >
            📊 Ver Resultados de Pruebas
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="bg-red-600 text-white w-full p-3 rounded hover:bg-red-500"
          >
            🔓 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
