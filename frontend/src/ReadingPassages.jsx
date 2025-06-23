import React, { useState, useEffect } from "react";
import { apiFetch } from "./utils/apiFetch";

export default function ReadingPassages() {
  const [passages, setPassages] = useState([]);
  const [newPassage, setNewPassage] = useState({ title: "", passage: "" });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchPassages = async () => {
    try {
      const data = await apiFetch(`/reading-passages?page=${page}&limit=${limit}`);
      setPassages(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error("Error al obtener los pasajes:", error);
    }
  };

  useEffect(() => {
    fetchPassages();
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPassage({ ...newPassage, [name]: value });
  };

  const handleCreate = async () => {
    if (!newPassage.title || !newPassage.passage) {
      alert("Por favor completa todos los campos");
      return;
    }
    try {
      await apiFetch("/reading-passages", {
        method: "POST",
        body: JSON.stringify(newPassage)
      });
      setNewPassage({ title: "", passage: "" });
      setPage(1); // volver a la primera página para ver el nuevo agregado
      fetchPassages();
    } catch (error) {
      console.error("Error al crear el pasaje:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este pasaje?")) return;
    try {
      await apiFetch(`/reading-passages/${id}`, { method: "DELETE" });
      fetchPassages();
    } catch (error) {
      console.error("Error al eliminar el pasaje:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md p-6 rounded-xl w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Lecturas (Reading Passages)</h1>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Agregar nuevo pasaje</h2>
          <div className="grid grid-cols-1 gap-2">
            <input type="text" name="title" placeholder="Título" value={newPassage.title} onChange={handleInputChange} className="border p-2 rounded" />
            <textarea name="passage" placeholder="Texto del pasaje" value={newPassage.passage} onChange={handleInputChange} className="border p-2 rounded h-40" />
            <button onClick={handleCreate} className="bg-blue-900 text-white py-2 rounded hover:bg-blue-800">Guardar pasaje</button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2">Pasajes existentes</h2>
        <table className="w-full border border-gray-300 mb-4">
          <thead>
            <tr>
              <th className="border p-2">Título</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(passages) && passages.map(p => (
              <tr key={p.id}>
                <td className="border p-2">{p.title}</td>
                <td className="border p-2">
                  <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
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
