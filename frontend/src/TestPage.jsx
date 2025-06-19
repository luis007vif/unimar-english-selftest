import { useState } from "react";
import Instructions from "./Instructions";

export default function TestPage() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {!started ? (
        <Instructions onStart={() => setStarted(true)} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-green-100">
          <h1 className="text-2xl font-bold text-green-900">¡Aquí va la primera pregunta! 🎯</h1>
        </div>
      )}
    </>
  );
}
