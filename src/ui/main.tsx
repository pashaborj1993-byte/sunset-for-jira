import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import type { Draft, Inspected } from "../core";
import { retirementDescription } from "../core";
import { call, demo, openIssue } from "./client";
import "./styles.css";

function Mark() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 23h26M7 19a9 9 0 0 1 18 0M16 3v4M4 8l3 3M28 8l-3 3M2 17h3M27 17h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function Arrow() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
const badge = (state: string) => state.toLowerCase().replaceAll(" ", "-");
function pretty(value: string) {
  return new Date(
    value.length === 10 ? `${value}T12:00:00` : value,
  ).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
const emptyDraft: Draft = {
  sourceKey: "",
  title: "",
  reason: "",
  conditionKey: "",
  targetStatus: "",
  targetStatusId: "",
  reviewDate: "",
};
function App() {
  const [showTask, setShowTask] = useState(false);
  const [items, setItems] = useState<Inspected[]>([]),
    [selected, setSelected] = useState(""),
    [filter, setFilter] = useState("All"),
    [search, setSearch] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [form, setForm] = useState(false),
    [draft, setDraft] = useState<Draft>(emptyDraft),
    [statuses, setStatuses] = useState<{ id: string; name: string }[]>([]),
    [verifiedKey, setVerifiedKey] = useState(""),
    [note, setNote] = useState(""),
    [reviewDate, setReviewDate] = useState(""),
    [action, setAction] = useState(""),
    [limited, setLimited] = useState(false),
    [sourceKey, setSourceKey] = useState("");
  async function refresh() {
    const data = await call<{
      items: Inspected[];
      sourceKey: string;
      limited: boolean;
    }>("list");
    setItems(data.items);
    setSourceKey(data.sourceKey);
    setLimited(data.limited);
    setSelected((old) =>
      data.items.some((x) => x.decision.id === old)
        ? old
        : (data.items[0]?.decision.id ?? ""),
    );
  }
  useEffect(() => {
    refresh()
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  async function run(job: () => Promise<void>) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await job();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  const current = items.find((x) => x.decision.id === selected);
  const visible = items.filter(
    (x) =>
      (filter === "All" ||
        (filter === "Needs review"
          ? ["Condition met", "Review due", "Unknown"].includes(x.state)
          : x.state === filter)) &&
      `${x.decision.title} ${x.decision.sourceKey}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const needs = items.filter((x) =>
    ["Condition met", "Review due", "Unknown"].includes(x.state),
  ).length;
  function select(id: string) {
    setSelected(id);
    setForm(false);
    setAction("");
    setNote("");
    setError("");
    setMessage("");
  }
  function newDecision() {
    setDraft({ ...emptyDraft, sourceKey });
    setForm(true);
    setAction("");
    setStatuses([]);
    setVerifiedKey("");
  }
  return (
    <div className="app">
      <header className="topbar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setForm(false);
          }}
        >
          <Mark />
          <span>
            sunset<span className="brand-dot">.</span>
          </span>
        </a>
        <span className="brand-caption">Give temporary decisions an end.</span>
        <span className="environment">
          {demo ? "Interactive sample" : "Jira workspace"}
        </span>
      </header>
      {demo && (
        <div className="sample-bar">
          <span>
            <strong>Sample workspace</strong> · Synthetic issues, saved only in
            this browser. No Jira changes.
          </span>
          <div>
            <button
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await call("simulate");
                  await refresh();
                  setMessage(
                    "SDK-92 status changed in the sample. Inspect the evidence below.",
                  );
                })
              }
            >
              Toggle upstream fix <Arrow />
            </button>
            <button
              className="reset"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await call("reset");
                  await refresh();
                  setMessage("Sample restored.");
                })
              }
            >
              Reset sample
            </button>
          </div>
        </div>
      )}
      <main>
        <div className="page-heading">
          <div>
            <h1>Temporary, until it isn’t.</h1>
            <p>Remember the reason. Notice the change. Decide what ends.</p>
          </div>
          <button className="primary" onClick={newDecision} disabled={busy}>
            + Register workaround
          </button>
        </div>
        {error && (
          <div role="alert" className="notice error">
            {error}
          </div>
        )}
        {message && (
          <div role="status" className="notice success">
            {message}
          </div>
        )}
        {limited && (
          <div className="notice">
            Showing the first 100 stored records. Broader pagination is required
            before using Sunset beyond this pilot.
          </div>
        )}
        <div className="workbench">
          <aside className="queue">
            <div className="queue-heading">
              <h2>Your workarounds</h2>
              <span>{items.length}</span>
            </div>
            <label className="search">
              <span className="sr-only">Search workarounds</span>
              <input
                type="search"
                placeholder="Find an issue or workaround…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <div className="filters" aria-label="Filter workarounds">
              {["All", "Needs review", "Watching", "Retired"].map((f) => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  {f === "Needs review" && needs > 0 && <span>{needs}</span>}
                </button>
              ))}
            </div>
            <div className="queue-items">
              {loading ? (
                <p className="empty">Reading your workspace…</p>
              ) : visible.length ? (
                visible.map((x) => (
                  <button
                    className={`queue-item ${selected === x.decision.id && !form ? "selected" : ""}`}
                    key={x.decision.id}
                    onClick={() => select(x.decision.id)}
                  >
                    <div className="item-meta">
                      <span>{x.decision.sourceKey}</span>
                      <span className={`status ${badge(x.state)}`}>
                        {x.state}
                      </span>
                    </div>
                    <h3>{x.decision.title}</h3>
                    <div className="item-footer">
                      <span>Waiting on {x.decision.conditionKey}</span>
                      <Arrow />
                    </div>
                  </button>
                ))
              ) : (
                <div className="empty">
                  <h3>
                    {items.length ? "No matches" : "Nothing temporary yet."}
                  </h3>
                  <p>
                    {items.length
                      ? "Try another search or filter."
                      : "Register a workaround and the issue you are waiting for."}
                  </p>
                </div>
              )}
            </div>
            <footer className="queue-note">
              <span className="tiny-sun" />A changed condition starts a
              conversation.
              <br />A person makes the decision.
            </footer>
          </aside>
          <section
            className="detail"
            aria-label={form ? "Register workaround" : "Workaround details"}
          >
            {form ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  run(async () => {
                    const result = await call<Inspected>("create", draft);
                    await refresh();
                    setSelected(result.decision.id);
                    setForm(false);
                    setMessage(
                      "Workaround registered. Its prerequisite will be checked when you refresh.",
                    );
                  });
                }}
              >
                <div className="detail-top">
                  <h2>Register a workaround</h2>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setForm(false)}
                  >
                    Cancel
                  </button>
                </div>
                <p className="muted">
                  Make “for now” explicit. Choose the issue and status that
                  should bring this back for review.
                </p>
                <div className="form-grid">
                  <label>
                    Source issue
                    <input
                      required
                      placeholder="PAY-184"
                      value={draft.sourceKey}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          sourceKey: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </label>
                  <label>
                    Review date
                    <input
                      required
                      type="date"
                      value={draft.reviewDate}
                      onChange={(e) =>
                        setDraft({ ...draft, reviewDate: e.target.value })
                      }
                    />
                  </label>
                </div>
                <label>
                  What are we keeping temporarily?
                  <input
                    required
                    maxLength={180}
                    placeholder="Keep the legacy checkout fallback"
                    value={draft.title}
                    onChange={(e) =>
                      setDraft({ ...draft, title: e.target.value })
                    }
                  />
                </label>
                <label>
                  Why does it exist?
                  <textarea
                    required
                    maxLength={2000}
                    placeholder="Record the original problem and why this workaround is needed."
                    value={draft.reason}
                    onChange={(e) =>
                      setDraft({ ...draft, reason: e.target.value })
                    }
                  />
                </label>
                <label>
                  Prerequisite issue
                  <div className="input-action">
                    <input
                      required
                      placeholder="SDK-92"
                      value={draft.conditionKey}
                      onChange={(e) => {
                        setDraft({
                          ...draft,
                          conditionKey: e.target.value.toUpperCase(),
                          targetStatusId: "",
                          targetStatus: "",
                        });
                        setVerifiedKey("");
                        setStatuses([]);
                      }}
                    />
                    <button
                      type="button"
                      disabled={busy || !draft.conditionKey}
                      onClick={() =>
                        run(async () => {
                          const result = await call("lookup", {
                            key: draft.conditionKey,
                          });
                          setStatuses(result.statuses);
                          setVerifiedKey(draft.conditionKey);
                        })
                      }
                    >
                      Load statuses
                    </button>
                  </div>
                </label>
                <label>
                  Bring this back when the prerequisite reaches
                  <select
                    required
                    disabled={!statuses.length}
                    value={draft.targetStatusId}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        targetStatusId: e.target.value,
                        targetStatus:
                          statuses.find((s) => s.id === e.target.value)?.name ??
                          "",
                      })
                    }
                  >
                    <option value="">
                      {statuses.length
                        ? "Choose status"
                        : "Load prerequisite statuses first"}
                    </option>
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="form-help">
                  The registering user is recorded as the owner. Source issue
                  edit access is required in Jira.
                </p>
                <button
                  className="primary"
                  disabled={
                    busy ||
                    verifiedKey !== draft.conditionKey ||
                    !draft.targetStatusId
                  }
                >
                  {busy ? "Saving…" : "Register workaround"}
                </button>
              </form>
            ) : current ? (
              <>
                <div className="detail-top">
                  <span className={`status ${badge(current.state)}`}>
                    {current.state}
                  </span>
                  <button
                    className="text-button refresh"
                    disabled={busy}
                    onClick={() => run(refresh)}
                  >
                    Refresh evidence
                  </button>
                </div>
                <div className="detail-title">
                  <button
                    className="issue-link"
                    onClick={() =>
                      run(() => openIssue(current.decision.sourceKey))
                    }
                  >
                    {current.decision.sourceKey}
                  </button>
                  <h2>{current.decision.title}</h2>
                </div>
                <div className="ownership">
                  <span>
                    Owner{" "}
                    <strong>
                      {demo
                        ? current.decision.owner
                        : current.decision.owner === undefined
                          ? "Unknown"
                          : "Registered Jira user"}
                    </strong>
                  </span>
                  <span>
                    Review{" "}
                    <strong>{pretty(current.decision.reviewDate)}</strong>
                  </span>
                </div>
                <div className="evidence">
                  <section>
                    <div className="evidence-label">
                      <span className="step">1</span>
                      <h3>Then: a reason to keep it</h3>
                    </div>
                    <p>{current.decision.reason}</p>
                    <div className="source-ref">
                      Recorded {pretty(current.decision.createdAt)} ·{" "}
                      {current.decision.sourceKey}
                    </div>
                  </section>
                  <div className="evidence-connector">
                    <Arrow />
                  </div>
                  <section
                    className={`now ${current.state === "Condition met" ? "changed" : ""}`}
                  >
                    <div className="evidence-label">
                      <span className="step">2</span>
                      <h3>Now: check the condition</h3>
                    </div>
                    <button
                      className="issue-link"
                      onClick={() =>
                        run(() => openIssue(current.decision.conditionKey))
                      }
                    >
                      {current.decision.conditionKey}
                    </button>
                    <p>
                      {current.observation?.summary ??
                        "Prerequisite evidence unavailable"}
                    </p>
                    <div className="condition">
                      <span>
                        Current{" "}
                        <strong>
                          {current.observation?.status ?? "Unknown"}
                        </strong>
                      </span>
                      <Arrow />
                      <span>
                        Target <strong>{current.decision.targetStatus}</strong>
                      </span>
                    </div>
                    <div className="source-ref">
                      {current.observation
                        ? `Checked ${new Date(current.observation.checkedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                        : "Check your access to the prerequisite issue."}
                    </div>
                  </section>
                </div>
                <section className="decision">
                  <div className="evidence-label">
                    <span className="step">3</span>
                    <h3>Your next decision</h3>
                  </div>
                  <h3 className="decision-title">
                    {current.state === "Condition met"
                      ? "The prerequisite changed. What should end?"
                      : current.state === "Retired"
                        ? "This workaround has reached its sunset."
                        : current.state === "Review due"
                          ? "Time to revisit “for now.”"
                          : current.state === "Unknown"
                            ? "Get current evidence before deciding."
                            : "The reason is still being watched."}
                  </h3>
                  <p>{current.explanation}</p>
                  {!current.decision.retiredAt && (
                    <>
                      <p className="decision-caveat">
                        Verify the affected environment before removal. A
                        completed prerequisite does not establish that the
                        workaround is safe to remove.
                      </p>
                      <div className="actions">
                        {current.decision.taskKey ? (
                          <button
                            className="primary"
                            onClick={() =>
                              demo ? setShowTask(!showTask) : run(() => openIssue(current.decision.taskKey!))
                            }
                          >
                            View {demo ? "sample " : ""}task{" "}
                            {current.decision.taskKey} <Arrow />
                          </button>
                        ) : (
                          <button
                            className="primary"
                            disabled={
                              busy ||
                              current.state !== "Condition met" ||
                              current.taskPending
                            }
                            onClick={() =>
                              run(async () => {
                                const result = await call("createTask", {
                                  id: current.decision.id,
                                });
                                await refresh();
                                setMessage(
                                  `${demo ? "Sample task" : "Jira task"} ${result.key} prepared. Review the verification steps before removing anything.`,
                                );
                              })
                            }
                          >
                            {current.taskPending
                              ? "Task result uncertain"
                              : "Create retirement task"}{" "}
                            <Arrow />
                          </button>
                        )}
                        <button
                          disabled={busy}
                          onClick={() => {
                            setAction("extend");
                            setNote("");
                            setReviewDate("");
                          }}
                        >
                          Extend
                        </button>
                        <button
                          className="text-button"
                          disabled={busy}
                          onClick={() => {
                            setAction("retire");
                            setNote("");
                          }}
                        >
                          Record retirement
                        </button>
                      </div>
                    </>
                  )}
                  {demo && showTask && current.decision.taskKey && current.observation && (
                    <section className="task-preview" aria-label="Sample retirement task">
                      <h4>Sample task {current.decision.taskKey}</h4>
                      <p>No Jira issue was created. This is the proposed task content.</p>
                      <pre>{retirementDescription(current.decision, current.observation)}</pre>
                    </section>
                  )}
                  {action && (
                    <form
                      className="action-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        run(async () => {
                          await call("update", {
                            id: current.decision.id,
                            action,
                            note,
                            reviewDate,
                          });
                          await refresh();
                          setAction("");
                          setMessage(
                            action === "extend"
                              ? "Review extended with a recorded reason."
                              : "Retirement recorded.",
                          );
                        });
                      }}
                    >
                      <h4>
                        {action === "extend"
                          ? "Why does this need more time?"
                          : "What was removed and how was it verified?"}
                      </h4>
                      <label>
                        Decision note
                        <textarea
                          autoFocus
                          required
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          maxLength={2000}
                        />
                      </label>
                      {action === "extend" && (
                        <label>
                          New review date
                          <input
                            type="date"
                            required
                            value={reviewDate}
                            onChange={(e) => setReviewDate(e.target.value)}
                          />
                        </label>
                      )}
                      <div className="actions">
                        <button className="primary" disabled={busy}>
                          Save{" "}
                          {action === "extend" ? "extension" : "retirement"}
                        </button>
                        <button type="button" onClick={() => setAction("")}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </section>
                <section className="history">
                  <h3>Decision history</h3>
                  {current.decision.history.length ? (
                    current.decision.history
                      .slice()
                      .reverse()
                      .map((h, i) => (
                        <div className="history-row" key={`${h.at}-${i}`}>
                          <span className="history-dot" />
                          <div>
                            <strong>{h.action}</strong>
                            <p>{h.note}</p>
                            <small>
                              {pretty(h.at)}
                              {demo ? ` · ${h.actor}` : ""}
                            </small>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="muted">No decisions recorded yet.</p>
                  )}
                </section>
              </>
            ) : (
              !loading && (
                <div className="detail-empty">
                  <Mark />
                  <h2>Give “for now” an end.</h2>
                  <p>
                    Select a workaround, or register the first temporary
                    decision your team wants to revisit.
                  </p>
                  <button className="primary" onClick={newDecision}>
                    Register workaround
                  </button>
                </div>
              )
            )}
          </section>
        </div>
        <footer className="page-footer">
          <span>Sunset / early working build</span>
          <span>
            {demo
              ? "Sample mode · no Jira connection"
              : "Evidence refreshed on demand · no background monitoring"}
          </span>
        </footer>
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
