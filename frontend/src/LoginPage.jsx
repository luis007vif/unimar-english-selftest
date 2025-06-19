import { useState } from "react";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "login" : "register";
    const body = isLogin
      ? { email: form.email, password: form.password }
      : form;

    try {
      const res = await axios.post(`http://localhost:3001/api/${url}`, body);
      localStorage.setItem("token", res.data.token);

      // Redirigir según el tipo de usuario
      if (form.email === "admin@unimar.edu.ve") {
        window.location.href = "/admin-panel";
      } else {
        window.location.href = "/student-dashboard";
      }

    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "No se pudo conectar"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-900">
          {isLogin ? "Iniciar Sesión" : "Registrarse"}
        </h2>

        {!isLogin && (
          <input
            name="name"
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Nombre"
            required
          />
        )}

        <input
          name="email"
          type="email"
          onChange={handleChange}
          className="border p-2 w-full rounded"
          placeholder="Correo"
          required
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            className="border p-2 w-full rounded pr-10"
            placeholder="Contraseña"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
          >
            {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
          </button>
        </div>

        <button className="bg-blue-900 text-white w-full p-2 rounded hover:bg-blue-800">
          {isLogin ? "Entrar" : "Registrar"}
        </button>

        <p className="text-sm text-center">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 underline"
          >
            {isLogin ? "Registrarse" : "Iniciar sesión"}
          </button>
        </p>
      </form>
    </div>
  );
}
