import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Cont creat! Verifică emailul, apoi autentifică-te.");
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Creează cont</h1>
        <p className="auth-subtitle">
          Salvează proiectele tale de croșetat și accesează-le de oriunde.
        </p>

        <form onSubmit={handleRegister}>
          <label>Email</label>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Parolă</label>
          <input
            type="password"
            placeholder="Minim 6 caractere"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="auth-btn">
            Creează cont
          </button>
        </form>

        {message && <div className="auth-message">{message}</div>}

        <p className="auth-footer">
          Ai deja cont? <Link to="/login">Intră în cont</Link>
        </p>
      </div>
    </div>
  );
}