const API_URL = "http://localhost:3001/api";  

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (response.status === 401) {
      localStorage.removeItem("token");
      alert("La sesión ha expirado. Por favor inicia sesión nuevamente.");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la petición");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en apiFetch:", error);
    throw error;
  }
}
