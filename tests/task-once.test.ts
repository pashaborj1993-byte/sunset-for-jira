import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createTaskOnce,
  type TaskClaim,
  type ClaimStore,
} from "../src/task-once";
function store() {
  let value: TaskClaim | undefined;
  return {
    get: async () => value,
    claim: async () => {
      if (value) throw new Error("Already claimed");
      value = { startedAt: new Date().toISOString() };
    },
    complete: async (key: string) => {
      value = { key };
    },
  } satisfies ClaimStore;
}
test("concurrent requests perform at most one remote write", async () => {
  const s = store();
  let writes = 0;
  const create = async () => {
    writes++;
    return { key: "PAY-500" };
  };
  await Promise.allSettled([
    createTaskOnce(s, create),
    createTaskOnce(s, create),
  ]);
  assert.equal(writes, 1);
  assert.deepEqual(await createTaskOnce(s, create), { key: "PAY-500" });
  assert.equal(writes, 1);
});
test("timeout after a remote write retains claim and prevents retry", async () => {
  const s = store();
  let writes = 0;
  const create = async () => {
    writes++;
    throw new Error("Response lost");
  };
  await assert.rejects(createTaskOnce(s, create));
  await assert.rejects(createTaskOnce(s, create), /uncertain/);
  assert.equal(writes, 1);
});
test("storage failure after a successful remote write also prevents duplicate", async () => {
  const s = store();
  s.complete = async () => {
    throw new Error("Storage unavailable");
  };
  let writes = 0;
  const create = async () => {
    writes++;
    return { key: "PAY-500" };
  };
  await assert.rejects(createTaskOnce(s, create));
  await assert.rejects(createTaskOnce(s, create));
  assert.equal(writes, 1);
});
