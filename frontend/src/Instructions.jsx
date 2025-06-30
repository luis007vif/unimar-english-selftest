import React from "react";
import { useNavigate } from "react-router-dom";

export default function Instructions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-lg text-center space-y-6">
        <h1 className="text-2xl font-bold text-blue-900">Bienvenido a la prueba de autoevaluación</h1>
        <p className="text-gray-700">
          Esta prueba evalúa tu nivel de <strong>gramática</strong>, <strong>vocabulario técnico</strong> y <strong>comprensión lectora</strong>.
        </p>
        <p className="text-gray-600">Duración estimada: 20 minutos</p>
        <button
          onClick={() => navigate("/selftest")}
          className="bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-800 transition"
        >
          Comenzar prueba
        </button>
      </div>
    </div>
  );
}
