export type DecisionState =
  "Watching" | "Review due" | "Condition met" | "Unknown" | "Retired";
export type Observation = {
  key: string;
  summary: string;
  status: string;
  statusId: string;
  checkedAt: string;
};
export type History = {
  at: string;
  actor: string;
  action: string;
  note: string;
};
export type Decision = {
  id: string;
  sourceKey: string;
  title: string;
  reason: string;
  owner: string;
  conditionKey: string;
  targetStatus: string;
  targetStatusId: string;
  reviewDate: string;
  createdAt: string;
  retiredAt?: string;
  taskKey?: string;
  history: History[];
};
export type Inspected = {
  decision: Decision;
  state: DecisionState;
  observation?: Observation;
  explanation: string;
  taskPending?: boolean;
};
export type Draft = Pick<
  Decision,
  | "sourceKey"
  | "title"
  | "reason"
  | "conditionKey"
  | "targetStatus"
  | "targetStatusId"
  | "reviewDate"
>;
export function issueKey(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Z][A-Z0-9_]*-[1-9]\d*$/.test(value))
    throw new Error("Enter a valid Jira issue key, such as PAY-184.");
  return value;
}
export function text(value: unknown, name: string, max = 1000): string {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max)
    throw new Error(`${name} is required (maximum ${max} characters).`);
  return value.trim();
}
export function date(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 10) !== value
  )
    throw new Error("Choose a valid review date.");
  return value;
}
export function validateDraft(input: Draft): Draft {
  const sourceKey = issueKey(input.sourceKey),
    conditionKey = issueKey(input.conditionKey);
  if (sourceKey === conditionKey)
    throw new Error("The prerequisite must be a different issue.");
  return {
    sourceKey,
    conditionKey,
    title: text(input.title, "Workaround", 180),
    reason: text(input.reason, "Reason", 2000),
    targetStatus: text(input.targetStatus, "Target status", 80),
    targetStatusId: text(input.targetStatusId, "Target status ID", 80),
    reviewDate: date(input.reviewDate),
  };
}
export function inspect(
  decision: Decision,
  observation?: Observation,
  now = new Date(),
): Inspected {
  if (decision.retiredAt)
    return {
      decision,
      observation,
      state: "Retired",
      explanation: "A person recorded the workaround as retired.",
    };
  if (
    !observation ||
    observation.key !== decision.conditionKey ||
    !Number.isFinite(Date.parse(observation.checkedAt)) ||
    now.getTime() - Date.parse(observation.checkedAt) > 300_000 ||
    Date.parse(observation.checkedAt) > now.getTime() + 30_000
  )
    return {
      decision,
      state: "Unknown",
      explanation:
        "Current prerequisite evidence is unavailable. Refresh or check your Jira access.",
    };
  if (observation.statusId === decision.targetStatusId)
    return {
      decision,
      observation,
      state: "Condition met",
      explanation: `${observation.key} reached ${observation.status}. Review whether the workaround can be removed.`,
    };
  if (decision.reviewDate <= now.toISOString().slice(0, 10))
    return {
      decision,
      observation,
      state: "Review due",
      explanation:
        "The review date has arrived. The prerequisite has not reached its target status.",
    };
  return {
    decision,
    observation,
    state: "Watching",
    explanation: `Waiting for ${observation.key} to reach ${decision.targetStatus}.`,
  };
}
export function retirementDescription(d: Decision, _o: Observation): string {
  return `Review a temporary workaround in Sunset. Open the Sunset project page for the source, reason, and current evidence.\n\nVerify the fix in the affected environment, identify remaining dependencies, remove the workaround if appropriate, and record verification. A met condition is a review trigger, not evidence that removal is safe.\n\nSunset reference: ${d.id}`;
}
