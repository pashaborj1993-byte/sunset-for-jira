# Sunset — Codegeist 2026 entry draft

**Category:** Apps for Software Teams  
**Bonus category:** Best Agents — Rovo/Assignable agents  
**One-line pitch:** Give every temporary workaround an explicit review trigger, current evidence, and a safe path to retirement.

## Inspiration

A temporary workaround often outlives the incident that justified it. The original reason lives in one Jira issue, the upstream fix in another, and the removal decision in someone's memory. Teams then carry unnecessary complexity or remove a workaround before verifying the affected environment.

## What Sunset does

Sunset records a temporary decision next to the Jira work it affects: why it exists, which prerequisite should trigger review, the target status, and a review date. Its project workbench shows a queue and a live evidence trail. When a prerequisite reaches its target state, Sunset says **Condition met** and asks a human to review; it never claims that removal is safe. An authorized user can create a Jira retirement task with verification instructions, extend the review date with a reason, or record retirement. The history persists across visits.

Sunset Guide is a Forge Rovo agent. It uses read-only Forge actions to explain decisions on one issue or list review candidates in a project. Its responses are grounded in the live Jira status and stored decision records, and it treats inaccessible evidence as unknown.

## How we built it

Sunset is an Atlassian Forge app with a Jira project page, Jira issue panel, Forge key-value storage, user-scoped Jira API reads and writes, a `rovo:agent` module, and two reusable read-only `action` modules. The UI is React and the backend is TypeScript. The app checks source issue access before showing a stored decision and Edit issues permission before changes. Retirement task creation uses a single-claim guard to avoid duplicate remote writes after retries or timeouts; uncertain writes remain pending for manual recovery. New tasks use a generic title and body so the issue does not copy a restricted decision's reason.

## Demonstrated behavior

On an owned demo Jira site, a synthetic source issue was registered with a separate prerequisite. Changing that prerequisite to Done produced a live **Condition met** result. A retirement task was created and inspected in Jira. The project review queue action and issue explanation action were invoked through Sunset Guide. The app also passed 12 unit tests, four browser tests (including desktop and mobile overflow checks), a production build, and Forge lint.

This is a synthetic demonstration. We do not claim a customer pilot, time savings, Teamwork Graph integration, or a working external MCP client. Evidence is checked on page load, manual refresh, and Rovo invocation; there is no background monitoring or automatic removal.

## Why it matters

The product makes a recurring decision explicit and reviewable without taking the decision away from engineers. Its visible state distinguishes a met condition, an approaching review date, and unknown evidence. Teams can explain why a workaround still exists and see which ones need attention using the same Jira context they already use to ship.

## Challenges and next steps

Jira permissions made it important to read issue context as the current user and avoid disclosing restricted records in shared tasks. The next validation is a two-user security test and an independent install on a fresh site. We also need a real engineering pilot to quantify usefulness. A future proactive signal would need to preserve the same access boundary.

## Judge access

**Installation link:** [ADD AFTER DISTRIBUTION IS ENABLED]  
**Demo video:** [ADD PUBLIC YOUTUBE URL, UNDER FIVE MINUTES; LOCAL SILENT DRAFT EXISTS]  
**Source:** https://github.com/pashaborj1993-byte/sunset-for-jira  
**Privacy notice:** https://github.com/pashaborj1993-byte/sunset-for-jira/blob/main/PRIVACY.md  
**Support:** babimoore954@gmail.com

The installing user must be a Jira site administrator. On a Jira project with a standard Task issue type, create two synthetic issues, one as the workaround source and one as its prerequisite. In Sunset's project page, register the source issue and prerequisite target status. Move the prerequisite to that status, refresh evidence, and create a review task. In Rovo, select Sunset Guide and ask which workarounds in the project need review. Full steps: `JUDGE_DEMO.md`.

## Technology and bonus evidence

- Main requirement: Forge app integrated with Jira, including project and issue surfaces, storage, and user-scoped Jira API calls.
- Best Agents: `rovo:agent` Sunset Guide and its two read-only Forge actions; both were invoked live on the owned demo site.
- The manifest also includes `rovo:mcp`, but no external MCP client invocation has been verified, so do not select the MCP bonus yet.
