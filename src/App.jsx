import { useEffect, useMemo, useState } from "react";

const initialForm = {
  title: "",
  segment: "Enterprise",
  owner: "Product",
  impact: 7,
  effort: 3,
  notes: ""
};

const statusFlow = ["Backlog", "Planned", "In Progress", "Done"];

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (ownerFilter) params.set("owner", ownerFilter);
      const query = params.toString() ? `?${params.toString()}` : "";
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
  }, [statusFilter, ownerFilter]);

  const owners = useMemo(() => [...new Set(feedback.map((item) => item.owner))], [feedback]);
  const filteredFeedback = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return feedback;
    return feedback.filter((item) =>
      [item.title, item.notes, item.segment, item.owner, item.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [feedback, search]);

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
      setError(payload.error?.message || payload.error || "Create failed");
      return;
    }
    setForm(initialForm);
    await load();
  }

  async function moveStatus(item, direction) {
    const currentIndex = statusFlow.indexOf(item.status);
    const nextStatus = statusFlow[currentIndex + direction];
    if (!nextStatus) return;

    setSavingId(item.id);
    setError("");
    try {
      const response = await fetch(`/api/feedback/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error?.message || payload.error || "Update failed");
      }
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId("");
    }
  }

  function exportCsv() {
    const rows = [
      ["Title", "Segment", "Owner", "Status", "Impact", "Effort", "Score", "Notes"],
      ...filteredFeedback.map((item) => [
        item.title,
        item.segment,
        item.owner,
        item.status,
        item.impact,
        item.effort,
        item.score,
        item.notes
      ])
    ];
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "productpulse-opportunities.csv";
    link.click();
    URL.revokeObjectURL(url);
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
            <div className="filters">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, owner, segment..."
              />
              <select value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
                <option value="">All owners</option>
                {owners.map((owner) => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">All statuses</option>
                <option value="Backlog">Backlog</option>
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <button type="button" className="secondary-action" disabled={filteredFeedback.length === 0} onClick={exportCsv}>
                Export CSV
              </button>
            </div>
          </div>

          {loading ? (
            <p className="muted">Loading feedback...</p>
          ) : filteredFeedback.length === 0 ? (
            <p className="muted">No opportunities match the current filters.</p>
          ) : (
            <div className="feedback-list">
              {filteredFeedback.map((item) => (
                <article className="feedback-card" key={item.id}>
                  <div>
                    <div className="row">
                      <strong>{item.title}</strong>
                      <span className="score">{item.priority} / {item.score}</span>
                    </div>
                    <p>{item.notes}</p>
                  </div>
                  <div className="meta">
                    <span>{item.segment}</span>
                    <span>{item.owner}</span>
                    <span>{item.status}</span>
                  </div>
                  <div className="actions">
                    <button type="button" disabled={savingId === item.id || item.status === "Backlog"} onClick={() => moveStatus(item, -1)}>
                      Move back
                    </button>
                    <button type="button" disabled={savingId === item.id || item.status === "Done"} onClick={() => moveStatus(item, 1)}>
                      Advance
                    </button>
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
        <div className="breakdown">
          <Breakdown title="By status" data={metrics?.byStatus} />
          <Breakdown title="By segment" data={metrics?.bySegment} />
          <Breakdown title="By priority" data={metrics?.byPriority} />
        </div>
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

function Breakdown({ title, data = {} }) {
  return (
    <div className="breakdown-card">
      <strong>{title}</strong>
      <div>
        {Object.entries(data).map(([label, value]) => (
          <span key={label}>
            {label}: {value}
          </span>
        ))}
      </div>
    </div>
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
