export type TaskClaim = { key?: string; startedAt?: string };
export type ClaimStore = {
  get: () => Promise<TaskClaim | undefined>;
  claim: () => Promise<void>;
  complete: (key: string) => Promise<void>;
};
/** An uncertain remote write keeps its claim: a second POST could duplicate work. */
export async function createTaskOnce(
  store: ClaimStore,
  create: () => Promise<{ key: string }>,
): Promise<{ key: string }> {
  const prior = await store.get();
  if (prior?.key) return { key: prior.key };
  if (prior)
    throw new Error(
      "Task creation is pending or uncertain. Check Jira before attempting recovery.",
    );
  await store.claim();
  const result = await create();
  await store.complete(result.key);
  return result;
}
