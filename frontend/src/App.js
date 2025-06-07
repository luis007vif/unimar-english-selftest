function App() {
  return (
    <div className="min-h-screen bg-unimar-gris flex items-center justify-center text-center px-4">
      <div className="max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-unimar-azul mb-4">Autoevaluación de Inglés</h1>
        <p className="text-gray-700">
          Bienvenido. Esta prueba evalúa tu nivel de gramática, vocabulario técnico y comprensión lectora.
        </p>
        <button className="mt-6 px-4 py-2 bg-unimar-azul text-white rounded hover:bg-unimar-dorado">
          Comenzar prueba
        </button>
      </div>
    </div>
  );
}

export default App;
