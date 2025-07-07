import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

export default function ResultadosPruebas() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener estadísticas");

        const data = await response.json();
        setStats(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando estadísticas...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!stats) return null;

  const data = [
    { name: "Intentos realizados", value: stats.totalAttempts },
    { name: "Estudiantes", value: stats.totalStudents },
    { name: "Preguntas respondidas", value: Number(stats.avgAnswered) },
    { name: "Preguntas correctas", value: Number(stats.avgCorrect) },
    { name: "Promedio puntaje %", value: Number(stats.avgScore) },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="statistics">📊</span> Resultados Generales de Pruebas
      </h1>

      <ul className="list-disc pl-8 text-gray-700 mb-10 text-lg space-y-3">
        <li>Total de estudiantes: <strong>{stats.totalStudents}</strong></li>
        <li>Total de intentos realizados: <strong>{stats.totalAttempts}</strong></li>
        <li>Promedio de puntaje: <strong>{stats.avgScore}%</strong></li>
        <li>Promedio de preguntas respondidas: <strong>{stats.avgAnswered}</strong></li>
        <li>Promedio de preguntas correctas: <strong>{stats.avgCorrect}</strong></li>
      </ul>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
          barSize={50}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-20}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 14 }}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 14 }}
            width={50}
          />
          <Tooltip
            wrapperStyle={{ fontSize: "14px" }}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/admin-panel")}
          className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800"
        >
          Volver al Panel
        </button>
      </div>
    </div>
  );
}
