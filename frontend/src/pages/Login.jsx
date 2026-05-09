import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Crochet Cloud</h1>
        <p className="auth-subtitle">
          Intră în cont și continuă să îți organizezi proiectele creative în cloud.
        </p>

        <form onSubmit={handleLogin}>
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
            placeholder="Parola ta"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="auth-btn">
            Intră în cont
          </button>
        </form>

        {message && <div className="auth-message">{message}</div>}

        <p className="auth-footer">
          Nu ai cont? <Link to="/register">Creează unul</Link>
        </p>
      </div>
    </div>
  );
}