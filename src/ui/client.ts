import type { Decision, Draft, Inspected, Observation } from "../core";
import {
  inspect,
  retirementDescription,
  validateDraft,
  date,
  text,
} from "../core";
export const demo =
  import.meta.env.DEV ||
  import.meta.env.VITE_PUBLIC_DEMO === "1" ||
  new URLSearchParams(location.search).get("demo") === "1";
const storageKey = "sunset-demo-v1";
const today = new Date().toISOString().slice(0, 10);
const now = () => new Date().toISOString();
const future = () =>
  new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
function seed(): Decision[] {
  return [
    {
      id: "demo-checkout",
      sourceKey: "PAY-184",
      title: "Keep the legacy checkout fallback",
      reason:
        "The new payment SDK drops retry tokens. Keep the legacy checkout path until the upstream retry fix reaches Done.",
      owner: "Maya Chen",
      conditionKey: "SDK-92",
      targetStatus: "Done",
      targetStatusId: "done",
      reviewDate: future(),
      createdAt: now(),
      history: [
        {
          at: now(),
          actor: "Maya Chen",
          action: "Registered",
          note: "Fallback added after the checkout incident. Review the fix before removing it.",
        },
      ],
    },
    {
      id: "demo-cache",
      sourceKey: "PLAT-63",
      title: "Run the cache warm-up manually",
      reason: "Scheduled warm-up is unreliable during the scheduler migration.",
      owner: "Alex Morgan",
      conditionKey: "PLAT-81",
      targetStatus: "Done",
      targetStatusId: "done",
      reviewDate: today,
      createdAt: now(),
      history: [],
    },
    {
      id: "demo-export",
      sourceKey: "DATA-28",
      title: "Cap exports at 10,000 rows",
      reason:
        "Keep the limit until the streaming export implementation is complete.",
      owner: "Sam Rivera",
      conditionKey: "DATA-41",
      targetStatus: "Done",
      targetStatusId: "done",
      reviewDate: future(),
      createdAt: now(),
      history: [],
    },
  ];
}
function read(): {
  decisions: Decision[];
  completed: boolean;
  tasks: Record<string, string>;
} {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return { decisions: seed(), completed: false, tasks: {} };
  try {
    const s = JSON.parse(raw);
    if (
      !Array.isArray(s.decisions) ||
      typeof s.completed !== "boolean" ||
      !s.tasks
    )
      throw Error();
    return s;
  } catch {
    throw new Error(
      "Saved sample data is damaged. Use Reset sample to recover.",
    );
  }
}
export async function call<T = any>(
  name: string,
  payload: any = {},
): Promise<T> {
  if (!demo) {
    const { invoke } = await import("@forge/bridge");
    const result = await invoke<T>(name, payload);
    return result as T;
  }
  if (name === "reset") {
    localStorage.removeItem(storageKey);
    return undefined as T;
  }
  const state = read();
  const observe = (d: Decision): Observation => ({
    key: d.conditionKey,
    summary:
      d.conditionKey === "SDK-92"
        ? "Preserve retry tokens in the payment SDK"
        : "Complete the prerequisite implementation",
    status:
      state.completed && d.conditionKey === "SDK-92" ? "Done" : "In progress",
    statusId:
      state.completed && d.conditionKey === "SDK-92" ? "done" : "progress",
    checkedAt: now(),
  });
  const view = (d: Decision): Inspected =>
    inspect({ ...d, taskKey: state.tasks[d.id] }, observe(d));
  let result: any;
  if (name === "list")
    return {
      items: state.decisions.map(view),
      sourceKey: "",
      limited: false,
    } as T;
  if (name === "lookup")
    return {
      key: payload.key,
      summary: "Sample prerequisite issue",
      status: "In progress",
      statuses: [
        { id: "progress", name: "In progress" },
        { id: "done", name: "Done" },
      ],
    } as T;
  if (name === "simulate") {
    state.completed = !state.completed;
  } else if (name === "create") {
    const draft = validateDraft(payload as Draft);
    const d: Decision = {
      ...draft,
      id: crypto.randomUUID(),
      owner: "You",
      createdAt: now(),
      history: [
        { at: now(), actor: "You", action: "Registered", note: draft.reason },
      ],
    };
    state.decisions.unshift(d);
    result = view(d);
  } else {
    const d = state.decisions.find((d) => d.id === payload.id);
    if (!d) throw new Error("Decision not found.");
    if (name === "createTask") {
      if (view(d).state !== "Condition met")
        throw new Error(
          "The condition is no longer met. Refresh the evidence.",
        );
      state.tasks[d.id] ??=
        `${d.sourceKey.split("-")[0]}-${500 + Object.keys(state.tasks).length}`;
      result = {
        key: state.tasks[d.id],
        description: retirementDescription(d, observe(d)),
      };
    } else if (name === "update") {
      if (d.retiredAt) throw new Error("This workaround is already retired.");
      const note = text(payload.note, "Decision note");
      if (payload.action === "extend") {
        const next = date(payload.reviewDate);
        if (next <= today) throw new Error("Choose a future review date.");
        d.reviewDate = next;
      } else if (payload.action === "retire") d.retiredAt = now();
      else throw new Error("Unsupported action.");
      d.history.push({
        at: now(),
        actor: "You",
        action: payload.action === "extend" ? "Extended" : "Retired",
        note,
      });
      result = view(d);
    } else throw new Error("Unsupported action.");
  }
  localStorage.setItem(storageKey, JSON.stringify(state));
  return result as T;
}
export async function openIssue(key: string) {
  if (demo) return;
  const { router } = await import("@forge/bridge");
  await router.open(`/browse/${encodeURIComponent(key)}`);
}
