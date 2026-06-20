import { useEffect, useMemo, useState } from "react";

const initialForm = {
  title: "",
  segment: "Enterprise",
  owner: "Product",
  impact: 7,
  effort: 3,
  notes: ""
};

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const [metricsResponse, feedbackResponse] = await Promise.all([
        fetch("/api/metrics"),
        fetch(`/api/feedback${query}`)
      ]);
      if (!metricsResponse.ok || !feedbackResponse.ok) throw new Error("API request failed");
      setMetrics(await metricsResponse.json());
      setFeedback(await feedbackResponse.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [statusFilter]);

  const owners = useMemo(() => [...new Set(feedback.map((item) => item.owner))], [feedback]);

  async function submitFeedback(event) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error || "Create failed");
      return;
    }
    setForm(initialForm);
    await load();
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Product intelligence workspace</p>
          <h1>ProductPulse</h1>
          <p className="hero-copy">
            Collect feedback, score opportunities, and turn scattered customer requests into a focused product roadmap.
          </p>
        </div>
        <div className="hero-stats">
          <Metric label="Feedback" value={metrics?.total ?? "-"} />
          <Metric label="Avg score" value={metrics?.averageScore ?? "-"} />
          <Metric label="Owners" value={owners.length || "-"} />
        </div>
      </section>

      {error && <div className="alert">{error}</div>}

      <section className="grid">
        <div className="panel">
          <div className="panel-heading">
            <h2>Opportunity queue</h2>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">All statuses</option>
              <option value="Backlog">Backlog</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {loading ? (
            <p className="muted">Loading feedback...</p>
          ) : (
            <div className="feedback-list">
              {feedback.map((item) => (
                <article className="feedback-card" key={item.id}>
                  <div>
                    <div className="row">
                      <strong>{item.title}</strong>
                      <span className="score">Score {item.score}</span>
                    </div>
                    <p>{item.notes}</p>
                  </div>
                  <div className="meta">
                    <span>{item.segment}</span>
                    <span>{item.owner}</span>
                    <span>{item.status}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="panel">
          <h2>Add feedback</h2>
          <form onSubmit={submitFeedback} className="form">
            <label>
              Title
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </label>
            <label>
              Segment
              <select value={form.segment} onChange={(event) => setForm({ ...form, segment: event.target.value })}>
                <option>Enterprise</option>
                <option>Platform</option>
                <option>Self Serve</option>
                <option>Internal</option>
              </select>
            </label>
            <label>
              Owner
              <input value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} />
            </label>
            <div className="two-cols">
              <label>
                Impact
                <input type="number" min="1" max="10" value={form.impact} onChange={(event) => setForm({ ...form, impact: event.target.value })} />
              </label>
              <label>
                Effort
                <input type="number" min="1" max="10" value={form.effort} onChange={(event) => setForm({ ...form, effort: event.target.value })} />
              </label>
            </div>
            <label>
              Notes
              <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
            </label>
            <button type="submit">Create opportunity</button>
          </form>
        </aside>
      </section>

      <section className="panel">
        <h2>Roadmap signals</h2>
        <div className="signal-grid">
          {metrics?.topOpportunities?.map((item) => (
            <article key={item.id}>
              <span>{item.segment}</span>
              <strong>{item.title}</strong>
              <small>Impact {item.impact} / Effort {item.effort}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
