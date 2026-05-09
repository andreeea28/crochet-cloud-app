import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planificat");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState("");

  const navigate = useNavigate();

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setProjects(data);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        navigate("/login");
        return;
      }

      setUser(data.user);
      fetchProjects();
    };

    init();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const generateDescription = async () => {
    if (!title.trim()) {
      alert("Scrie mai întâi titlul proiectului.");
      return;
    }

    setLoadingAI(true);
    setAiError(""); // reset

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.message?.includes("high demand")) {
          setAiError(
            "AI-ul este foarte ocupat acum. Încearcă din nou în câteva momente.",
          );
        } else {
          setAiError("Nu s-a putut genera descrierea.");
        }
        return;
      }

      setDescription(data.description || "");
    } catch (error) {
      console.error("Eroare la generarea descrierii:", error);
      setAiError("Eroare de conexiune. Verifică serverul.");
    } finally {
      setLoadingAI(false);
    }
  };

  const addProject = async () => {
    if (!title.trim()) {
      alert("Titlul este obligatoriu.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from("projects").insert([
      {
        title,
        description,
        status,
        user_id: userData.user.id,
      },
    ]);

    if (!error) {
      setTitle("");
      setDescription("");
      setStatus("Planificat");
      fetchProjects();
    }
  };

  const deleteProject = async (id) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (!error) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Crochet Cloud</h1>
          <p>Organizează proiectele tale creative în cloud.</p>
        </div>

        <div className="user-box">
          <span>{user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="form-card">
          <h2>Adaugă un proiect nou</h2>
          <p className="section-subtitle">
            Completează manual sau lasă AI-ul să creeze o descriere pentru tine.
          </p>

          <label>Titlu proiect</label>
          <input
            placeholder="Ex: Fular roz"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Descriere</label>
          <textarea
            placeholder="Descrierea proiectului..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
          />

          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Planificat</option>
            <option>În progres</option>
            <option>Finalizat</option>
          </select>

          <div className="form-actions">
            <button
              type="button"
              onClick={generateDescription}
              className="ai-btn"
              disabled={loadingAI}
            >
              {loadingAI ? "Se generează..." : "Generează descriere cu AI ✨"}
            </button>
            {aiError && <div className="ai-error">{aiError}</div>}

            <button type="button" onClick={addProject} className="add-btn">
              Adaugă proiect
            </button>
          </div>
        </section>

        <section className="projects-section">
          <div className="section-title-row">
            <div>
              <h2>Proiectele mele</h2>
              <p className="section-subtitle">
                Ai {projects.length} proiecte salvate în cloud.
              </p>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">
              <h3>Nu ai proiecte încă</h3>
              <p>
                Adaugă primul tău proiect de croșetat și lasă cloud-ul să țină
                firele organizate.
              </p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.id}>
                  <div className="project-card-header">
                    <h3>{project.title}</h3>
                    <span className={`status-badge ${project.status}`}>
                      {project.status}
                    </span>
                  </div>

                  <p>{project.description || "Fără descriere momentan."}</p>

                  <div className="project-card-footer">
                    <small>
                      Creat la{" "}
                      {new Date(project.created_at).toLocaleDateString("ro-RO")}
                    </small>

                    <button
                      onClick={() => deleteProject(project.id)}
                      className="delete-btn"
                    >
                      Șterge
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
