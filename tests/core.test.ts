import { test } from "node:test";
import assert from "node:assert/strict";
import {
  inspect,
  validateDraft,
  retirementDescription,
  type Decision,
  type Observation,
} from "../src/core";
const clock = new Date("2026-11-09T12:00:00Z");
const d: Decision = {
  id: "test",
  sourceKey: "PAY-184",
  title: "Keep legacy fallback",
  reason: "Retry tokens are dropped",
  owner: "user",
  conditionKey: "SDK-92",
  targetStatus: "Done",
  targetStatusId: "10001",
  reviewDate: "2026-11-12",
  createdAt: "2026-11-01T12:00:00Z",
  history: [],
};
const o: Observation = {
  key: "SDK-92",
  summary: "Fix retry token",
  status: "Done",
  statusId: "10001",
  checkedAt: clock.toISOString(),
};
test("matching stable status ID triggers human review", () =>
  assert.equal(inspect(d, o, clock).state, "Condition met"));
test("matching name with a different status ID does not trigger review", () =>
  assert.equal(
    inspect(d, { ...o, statusId: "other" }, clock).state,
    "Watching",
  ));
test("missing, stale, wrong-issue and future evidence stay unknown", () => {
  for (const value of [
    undefined,
    { ...o, key: "SDK-93" },
    { ...o, checkedAt: "invalid" },
    { ...o, checkedAt: "2026-11-09T11:54:59Z" },
    { ...o, checkedAt: "2026-11-09T13:00:00Z" },
  ])
    assert.equal(inspect(d, value, clock).state, "Unknown");
});
test("review date triggers review without claiming prerequisite completion", () =>
  assert.equal(
    inspect(
      { ...d, reviewDate: "2026-11-09" },
      { ...o, statusId: "progress" },
      clock,
    ).state,
    "Review due",
  ));
test("reopened prerequisite removes the condition-met verdict", () =>
  assert.equal(
    inspect(d, { ...o, status: "In progress", statusId: "progress" }, clock)
      .state,
    "Watching",
  ));
test("retirement remains recorded when source is unavailable", () =>
  assert.equal(
    inspect({ ...d, retiredAt: clock.toISOString() }, undefined, clock).state,
    "Retired",
  ));
test("retired decision still shows available prerequisite evidence", () => {
  const result = inspect({ ...d, retiredAt: clock.toISOString() }, o, clock);
  assert.equal(result.state, "Retired");
  assert.deepEqual(result.observation, o);
});
test("draft boundary rejects malformed keys, impossible dates and self-dependency", () => {
  for (const patch of [
    { sourceKey: "bad" },
    { reviewDate: "2026-02-30" },
    { conditionKey: "PAY-184" },
    { title: "" },
    { reason: "x".repeat(2001) },
    { targetStatusId: "" },
  ])
    assert.throws(() => validateDraft({ ...d, ...patch }));
});
test("retirement task requires verification without copying restricted details", () => {
  const body = retirementDescription(d, o);
  assert.doesNotMatch(body, /PAY-184|SDK-92|Retry tokens/);
  assert.match(body, /not evidence that removal is safe/);
});
