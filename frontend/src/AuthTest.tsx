// TEST SIMPLE - Crear este archivo: frontend/src/AuthTest.jsx

import React, { useState } from "react";

const AuthTest = () => {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult("Probando login...");

    try {
      console.log("🔐 Enviando petición de login...");

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      console.log("📡 Respuesta recibida:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        setResult(`❌ Error ${response.status}: ${errorData}`);
        return;
      }

      const data = await response.json();
      console.log("✅ Login exitoso:", data);

      setResult(`✅ Login exitoso! 
Usuario: ${data.data.user.email}
Token: ${data.data.token.substring(0, 20)}...`);
    } catch (error) {
      console.error("💥 Error en login:", error);
      setResult(`💥 Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setResult("Probando registro...");

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          firstName: "Test",
          lastName: "User",
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        setResult(`❌ Error ${response.status}: ${errorData}`);
        return;
      }

      const data = await response.json();
      setResult(`✅ Registro exitoso! Usuario: ${data.data.user.email}`);
    } catch (error) {
      setResult(`💥 Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>🧪 Test de Autenticación</h2>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testRegister}
          disabled={loading}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Probando..." : "📝 Probar Registro"}
        </button>

        <button
          onClick={testLogin}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Probando..." : "🔑 Probar Login"}
        </button>
      </div>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "5px",
          whiteSpace: "pre-wrap",
          minHeight: "100px",
        }}
      >
        <strong>Resultado:</strong>
        <br />
        {result || "Presiona un botón para probar..."}
      </div>
    </div>
  );
};

export default AuthTest;
