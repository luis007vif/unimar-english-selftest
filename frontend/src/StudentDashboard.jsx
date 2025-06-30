import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const nombre = decoded.name || "Estudiante";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Bienvenido, {nombre} 👋</h1>
        <p className="mb-6 text-gray-700">¿Qué deseas hacer hoy?</p>

        <button
          onClick={() => navigate("/instructions")}
          className="bg-blue-900 text-white py-2 px-6 rounded mb-4 w-full hover:bg-blue-800"
        >
          Iniciar Autoevaluación
        </button>

        <button
          onClick={() => navigate("/student-attempts")}
          className="bg-blue-600 text-white py-2 px-6 rounded mb-4 w-full hover:bg-blue-500"
        >
          Ver mis intentos
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-6 rounded w-full hover:bg-red-500"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
