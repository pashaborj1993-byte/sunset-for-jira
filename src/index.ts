import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";
import { kvs, WhereConditions } from "@forge/kvs";
import { randomUUID } from "node:crypto";
import { createTaskOnce } from "./task-once";
import {
  date,
  inspect,
  issueKey,
  retirementDescription,
  text,
  validateDraft,
  type Decision,
  type Draft,
  type Observation,
} from "./core";

const resolver = new Resolver();
async function jira(
  path: ReturnType<typeof route>,
  options?: Parameters<ReturnType<typeof api.asUser>["requestJira"]>[1],
) {
  const response = await api.asUser().requestJira(path, options);
  if (!response.ok)
    throw new Error(
      `Jira request failed (${response.status}). Check source access and project permissions, then retry.`,
    );
  return response.status === 204 ? null : response.json();
}
async function readIssue(key: string) {
  return jira(
    route`/rest/api/3/issue/${issueKey(key)}?fields=summary,status,project,security`,
  );
}
async function allDecisions(): Promise<Decision[]> {
  const decisions: Decision[] = [];
  let cursor: string | undefined;
  do {
    let query = kvs
      .query()
      .where("key", WhereConditions.beginsWith("decision:"))
      .limit(100);
    if (cursor) query = query.cursor(cursor);
    const page = await query.getMany();
    decisions.push(...page.results.map((entry) => entry.value as Decision));
    cursor = page.nextCursor;
  } while (cursor);
  return decisions;
}
async function canEdit(key: string) {
  await readIssue(key);
  const result = await jira(
    route`/rest/api/3/mypermissions?issueKey=${key}&permissions=EDIT_ISSUES`,
  );
  if (!result.permissions?.EDIT_ISSUES?.havePermission)
    throw new Error("You need Edit issues permission on the source issue.");
}
async function observation(key: string): Promise<Observation> {
  const item = await readIssue(key);
  return {
    key: item.key,
    summary: item.fields.summary,
    status: item.fields.status.name,
    statusId: item.fields.status.id,
    checkedAt: new Date().toISOString(),
  };
}
async function getDecision(id: string): Promise<Decision> {
  if (typeof id !== "string" || !/^[-a-z0-9]{36}$/.test(id))
    throw new Error("Invalid decision reference.");
  const d = await kvs.get<Decision>(`decision:${id}`);
  if (!d) throw new Error("This decision no longer exists.");
  await readIssue(d.sourceKey);
  return d;
}
async function inspected(d: Decision) {
  let o: Observation | undefined;
  try {
    o = await observation(d.conditionKey);
  } catch {
    /* Inaccessible evidence must remain unknown. */
  }
  const task = await kvs.get<{ key?: string }>(`task:${d.id}`);
  return {
    ...inspect({ ...d, taskKey: task?.key }, o),
    taskPending: Boolean(task && !task.key),
  };
}
resolver.define("lookup", async ({ payload }) => {
  const item = await readIssue(payload.key);
  const project = await jira(
    route`/rest/api/3/project/${item.fields.project.id}/statuses`,
  );
  const statuses = [
    ...new Map<string, { id: string; name: string }>(
      project
        .flatMap((t: any) => t.statuses)
        .map((s: any) => [s.id, { id: s.id, name: s.name }] as const),
    ).values(),
  ];
  return {
    key: item.key,
    summary: item.fields.summary,
    status: item.fields.status.name,
    statuses,
  };
});
resolver.define("list", async ({ context }) => {
  const currentKey = context.extension?.issue?.key;
  const projectKey = context.extension?.project?.key;
  const visible = [];
  for (const d of await allDecisions()) {
    if (currentKey && d.sourceKey !== currentKey) continue;
    if (!currentKey && projectKey && !d.sourceKey.startsWith(`${projectKey}-`))
      continue;
    try {
      await readIssue(d.sourceKey);
      visible.push(await inspected(d));
    } catch {
      /* Never disclose records without source access. */
    }
  }
  return {
    items: visible,
    sourceKey: currentKey ?? "",
    limited: false,
  };
});
export async function getSunsetDecisions(payload: { issueKey?: unknown }) {
  const sourceKey = issueKey(payload.issueKey);
  await readIssue(sourceKey);
  const decisions = [];
  for (const d of await allDecisions()) {
    if (d.sourceKey !== sourceKey) continue;
    const current = await inspected(d);
    decisions.push({
      sourceKey: d.sourceKey,
      title: d.title,
      reason: d.reason,
      prerequisiteKey: d.conditionKey,
      targetStatus: d.targetStatus,
      observedStatus: current.observation?.status ?? null,
      checkedAt: current.observation?.checkedAt ?? null,
      state: current.state,
      reviewDate: d.reviewDate,
      retirementTaskKey: current.decision.taskKey ?? null,
      explanation: current.explanation,
    });
  }
  return {
    issueKey: sourceKey,
    decisions,
    limited: false,
    guidance: "A met condition triggers human review, not automatic removal.",
  };
}
export async function getSunsetReviewQueue(payload: { projectKey?: unknown }) {
  const projectKey = payload.projectKey;
  if (typeof projectKey !== "string" || !/^[A-Z][A-Z0-9_]*$/.test(projectKey))
    throw new Error("Provide a Jira project key, such as PLAT.");
  const items = [];
  for (const d of await allDecisions()) {
    if (!d.sourceKey.startsWith(`${projectKey}-`)) continue;
    try {
      await readIssue(d.sourceKey);
      const current = await inspected(d);
      if (!["Condition met", "Review due", "Unknown"].includes(current.state))
        continue;
      items.push({
        sourceKey: d.sourceKey,
        title: d.title,
        prerequisiteKey: d.conditionKey,
        observedStatus: current.observation?.status ?? null,
        state: current.state,
        reviewDate: d.reviewDate,
        retirementTaskKey: current.decision.taskKey ?? null,
        explanation: current.explanation,
      });
    } catch {
      // A record is invisible when its source issue cannot be read.
    }
  }
  return {
    projectKey,
    items,
    guidance:
      "These are review candidates. Verify the affected environment before removing a workaround.",
  };
}
resolver.define("create", async ({ payload, context }) => {
  if (!context.accountId) throw new Error("Sign in to Jira first.");
  const draft = validateDraft(payload as Draft);
  await canEdit(draft.sourceKey);
  const prerequisite = await readIssue(draft.conditionKey);
  const statuses = await jira(
    route`/rest/api/3/project/${prerequisite.fields.project.id}/statuses`,
  );
  const target = statuses
    .flatMap((t: any) => t.statuses)
    .find((s: any) => s.id === draft.targetStatusId);
  if (!target)
    throw new Error("Choose a status belonging to the prerequisite project.");
  const now = new Date().toISOString();
  const d: Decision = {
    ...draft,
    targetStatus: target.name,
    id: randomUUID(),
    owner: context.accountId,
    createdAt: now,
    history: [
      {
        at: now,
        actor: context.accountId,
        action: "Registered",
        note: draft.reason,
      },
    ],
  };
  await kvs.set(`decision:${d.id}`, d);
  return inspected(d);
});
resolver.define("update", async ({ payload, context }) => {
  if (!context.accountId) throw new Error("Sign in to Jira first.");
  const d = await getDecision(payload.id);
  await canEdit(d.sourceKey);
  const before = JSON.stringify(d);
  if (d.retiredAt) throw new Error("Retired decisions cannot be changed.");
  const note = text(payload.note, "Decision note", 2000),
    at = new Date().toISOString();
  if (payload.action === "extend") {
    const next = date(payload.reviewDate);
    if (next <= at.slice(0, 10))
      throw new Error("Choose a future review date.");
    d.reviewDate = next;
  } else if (payload.action === "retire") d.retiredAt = at;
  else throw new Error("Unsupported action.");
  // Fail closed on overlapping edits rather than silently overwrite audit history.
  await kvs.set(`edit:${d.id}`, { at }, { keyPolicy: "FAIL_IF_EXISTS" });
  try {
    const latest = await getDecision(d.id);
    if (JSON.stringify(latest) !== before)
      throw new Error("This decision changed. Refresh before editing.");
    d.history.push({
      at,
      actor: context.accountId,
      action: payload.action === "extend" ? "Extended" : "Retired",
      note,
    });
    await kvs.set(`decision:${d.id}`, d);
  } finally {
    await kvs.delete(`edit:${d.id}`);
  }
  return inspected(d);
});
resolver.define("createTask", async ({ payload, context }) => {
  if (!context.accountId) throw new Error("Sign in to Jira first.");
  const d = await getDecision(payload.id);
  await canEdit(d.sourceKey);
  const prior = await kvs.get<{ key?: string }>(`task:${d.id}`);
  if (prior?.key) {
    await readIssue(prior.key);
    return { key: prior.key };
  }
  if (prior)
    throw new Error(
      "Task creation is pending or uncertain. Check Jira before attempting recovery.",
    );
  const o = await observation(d.conditionKey);
  if (inspect(d, o).state !== "Condition met")
    throw new Error("The condition is no longer met. Refresh the evidence.");
  const source = await readIssue(d.sourceKey);
  const sourceSecurityId = source.fields.security?.id;
  const types = await jira(
    route`/rest/api/3/issue/createmeta/${source.fields.project.id}/issuetypes`,
  );
  const type = types.issueTypes?.find(
    (t: any) => t.name === "Task" && !t.subtask,
  );
  if (!type) throw new Error("This project needs a standard Task issue type.");
  return createTaskOnce(
    {
      get: () => kvs.get(`task:${d.id}`),
      claim: async () => {
        await kvs.set(
          `task:${d.id}`,
          { startedAt: new Date().toISOString() },
          { keyPolicy: "FAIL_IF_EXISTS" },
        );
      },
      complete: async (key) => {
        await kvs.set(`task:${d.id}`, { key });
      },
    },
    () =>
      jira(route`/rest/api/3/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            project: { id: source.fields.project.id },
            issuetype: { id: type.id },
            ...(sourceSecurityId ? { security: { id: sourceSecurityId } } : {}),
            summary: "Review temporary workaround",
            labels: [`sunset-${d.id}`],
            description: {
              type: "doc",
              version: 1,
              content: retirementDescription(d, o)
                .split("\n")
                .filter(Boolean)
                .map((line) => ({
                  type: "paragraph",
                  content: [{ type: "text", text: line }],
                })),
            },
          },
          properties: [
            {
              key: "sunset.reference",
              value: { decisionId: d.id },
            },
          ],
        }),
      }),
  );
});
export const handler = resolver.getDefinitions();
