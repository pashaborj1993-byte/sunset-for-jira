import { test, expect } from "@playwright/test";
test("sample runs the complete decision loop and persists it", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?demo=1");
  await expect(
    page
      .getByRole("heading", {
        name: "Keep the legacy checkout fallback",
        exact: true,
      })
      .last(),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create retirement task" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Toggle upstream fix" }).click();
  await expect(
    page.getByRole("heading", {
      name: "The prerequisite changed. What should end?",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create retirement task" }).click();
  await expect(
    page.getByRole("button", { name: "View sample task PAY-500" }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'View sample task PAY-500' }).click();
  await expect(page.getByRole('region', { name: 'Sample retirement task' })).toContainText('Verify the fix in the affected environment');
  await page.reload();
  await expect(
    page.getByRole("button", { name: "View sample task PAY-500" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Extend", exact: true }).click();
  await page
    .getByLabel("Decision note")
    .fill("Keep this until staging verification is complete.");
  await page.getByLabel("New review date").fill("2099-12-01");
  await page.getByRole("button", { name: "Save extension" }).click();
  await expect(
    page.getByText("Review extended with a recorded reason."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Record retirement" }).click();
  await page
    .getByLabel("Decision note")
    .fill("Verified retry tokens in staging; removed the legacy fallback.");
  await page.getByRole("button", { name: "Save retirement" }).click();
  await expect(
    page.getByRole("heading", {
      name: "This workaround has reached its sunset.",
    }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("register and filter a workaround", async ({ page }) => {
  await page.goto("/?demo=1");
  await page.getByRole("button", { name: "+ Register workaround" }).click();
  await page.getByLabel("Source issue", { exact: true }).fill("PAY-200");
  await page.getByLabel("Review date", { exact: true }).fill("2099-12-01");
  await page
    .getByLabel("What are we keeping temporarily?")
    .fill("Keep a manual retry queue");
  await page
    .getByLabel("Why does it exist?")
    .fill("Queue automation is still being rebuilt.");
  await page.getByLabel(/^Prerequisite issue/).fill("PAY-201");
  await page.getByRole("button", { name: "Load statuses" }).click();
  await page.getByLabel("Bring this back").selectOption("done");
  await page
    .getByRole("button", { name: "Register workaround", exact: true })
    .click();
  await expect(
    page
      .getByRole("heading", { name: "Keep a manual retry queue", exact: true })
      .last(),
  ).toBeVisible();
  await page.getByRole("searchbox").fill("PAY-200");
  await expect(page.locator(".queue-item")).toHaveCount(1);
});
for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`capture ${viewport.name} without horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/?demo=1");
    await page.getByRole("button", { name: "Toggle upstream fix" }).click();
    await expect(
      page.getByRole("heading", {
        name: "The prerequisite changed. What should end?",
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `.impeccable/review/${viewport.name}.png`,
      fullPage: true,
    });
  });
}
