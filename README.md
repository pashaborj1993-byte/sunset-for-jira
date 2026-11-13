# Sunset

**Give temporary decisions an end.** Sunset is an Atlassian Forge app for recording temporary Jira workarounds, checking their prerequisites, and starting a human review when removal may be due.

**Try the public interactive sample:** https://pashaborj1993-byte.github.io/sunset-for-jira/ — no sign-in required. It uses synthetic issues and browser-local storage, so it does not connect to Jira or exercise the Forge/Rovo backend. Codegeist judges can use the production Forge installation link in the submission's judge instructions to test the real Jira app.

For the Codegeist 2026 judge narrative and verification status, see [DEVPOST_DRAFT.md](DEVPOST_DRAFT.md), [JUDGE_DEMO.md](JUDGE_DEMO.md), and [RELEASE_GATES.md](RELEASE_GATES.md).

## Run the interactive sample

Use Node 22.23.4+, 24.22.1+, or a later Forge-supported release. This machine's bundled Codex runtime provides Node 24.22.1; the default Node 22.21.1 is too old for the current Forge CLI.

```sh
npm ci
npm run dev
```

Open the URL Vite prints. Synthetic workarounds are saved in this browser only. Toggle **upstream fix** to switch SDK-92 between In progress and Done. Inspect the changed condition, create a sample retirement task, extend a review, register another workaround, or record retirement. Reset sample restores the examples. Sample task keys do not refer to real Jira issues.

```sh
npm test
npm run build
npm run preview -- --port 4173
```

`npm run test:browser` uses installed Microsoft Edge. Set `PW_CHANNEL=chrome` to use installed Chrome instead. Browser tests run against a production preview.

The production preview requires `?demo=1` to explicitly enable synthetic data. A production Forge iframe never silently falls back to sample mode.

The public sample is built with `VITE_PUBLIC_DEMO=1` and published from the repository's `gh-pages` branch. This build flag must never be set for the Forge production build. To refresh the public sample, build with that flag and publish the resulting `dist` contents to `gh-pages`.

## Deploy to a Jira test site

Sunset is registered in the Sunset Development developer space and deployed to the Forge development environment as app `337563f6-18a0-4a57-83e3-d9e30dc936d7`. On November 10, 2026 it was installed on `one-atlas-isyq.atlassian.net` and exercised with labelled synthetic Jira issues. Development version 2.2.0 passed the live registration, status transition, task creation, extension, retirement, and reload checks described below. On November 11, version 2.4.0 added Sunset Guide and a read-only Atlassian MCP tool; version 2.5.0 added a project review queue and safer task content; version 2.6.0 removed the source key from new task properties. Production version 2.2.0 was deployed and its Jira installation link enabled on November 11. An independent installation remains untested. Forks must register a separate app under their own account.

```sh
npm run forge -- login
npm run forge -- register
npm run build
npm run forge -- lint
npm run forge -- deploy
npm run forge -- install
```

Select your own developer account and a Jira test site. `forge register` replaces the placeholder app ID. Access Sunset from the project sidebar or the issue's Apps panel. Registration needs the source issue key, prerequisite key, actual target status, reason and review date. Prerequisites are checked on opening/refreshing the UI; there is no background monitor yet.

## Implementation boundaries

- Status conditions only in this first slice. Version/deployment conditions, Teamwork Graph and Marketplace submission are not implemented.
- Sunset Guide is a `rovo:agent` backed by the read-only `get-sunset-decisions` and `get-sunset-review-queue` actions. The same actions are exposed through `rovo:mcp`. Both agent actions were exercised live on the demo tenant; an external MCP client has not been exercised yet. The tools recheck source issue visibility with `asUser` before returning records.
- All Jira access uses `asUser`; source visibility is checked before returning stored records, and Edit issues is checked before mutations. Evidence that cannot be read is Unknown.
- An atomic KVS `FAIL_IF_EXISTS` claim prevents concurrent task requests from creating duplicates. After an ambiguous Jira response the claim stays pending; it is never automatically retried. An administrator must find the task by label `sunset-<decision UUID>` and reconcile the `task:<UUID>` storage record. Never remove the claim without checking Jira.
- Edit locks fail closed if the invocation terminates unexpectedly; an administrator can reconcile the `edit:<UUID>` key. Storage contains private, installation-scoped records; users with source edit access can update them.
- Decision listing follows Forge KVS cursors so records beyond the first 100 are not silently omitted. It still scans all installation records and refreshes visible prerequisites per record; a source-key index and page-by-page UI are needed before larger deployments.
- Retirement task creation requires a standard issue type named Task with no extra mandatory fields. Jira validation errors retain an uncertain claim and require reconciliation.
- A retirement task has a generic summary and instructions so it does not copy a restricted source issue's title, reason, or prerequisite summary into a broader audience. When Jira provides a source issue security level, Sunset applies it to the task. The task's opaque Sunset reference and issue property link it back to the stored decision; automatic Jira issue-link creation is not implemented.
- Source instructions are plain text, never executable prompts. No external model, payment service, analytics or hosted backend is used.

## Verification still needed

Exercise source/prerequisite permission differences, required fields in other Jira projects, and task creation as two users. Test a reopened prerequisite before retirement, ambiguous Jira task responses, the MCP transport, and a real team pilot. This synthetic tenant run does not establish product demand or general compatibility.

## Local verification results

- TypeScript and Vite production build pass.
- 12 core tests pass, including concurrent requests, uncertain remote-write recovery behavior, and retired evidence display.
- Four production-browser tests pass in Edge: complete lifecycle/persistence, registration/filtering, desktop and mobile layout without horizontal overflow.
- Production dependency audit reports zero known vulnerabilities after the pinned transitive patches. The full development tree still reports 33 advisories, including 10 high, primarily in the Forge CLI toolchain; review those before distributing development tooling. No forced SDK downgrades were applied.
- Authenticated Forge lint passes with no issues. Development deployment succeeds and is reported eligible for Runs on Atlassian. On the live tenant, PLAT-33510 registered a temporary workaround waiting for PLAT-33511. Sunset showed To Do, then Done after a manual refresh; created verification task PLAT-33512; saved an extension and a synthetic retirement note; and persisted the decision, task reference, evidence, and history across reloads. A missing observation argument in the Forge resolver and retired evidence display were found during this run, fixed, and redeployed.
- Sunset Guide was selected in Jira's Rovo chat and invoked the Forge action for PLAT-33510. Its answer correctly returned Retired, PLAT-33511 at Done, review date 2026-12-10, and retirement task PLAT-33512. The first invocation exposed an unnecessary `context.accountId` check; the action now relies on its permission-filtered `asUser` Jira read, and the subsequent live invocation passed.
- Development version 2.5.0 added cursor-based record listing, a generic retirement-task body, and a project review-queue action. In Jira Rovo, Sunset Guide invoked `get-sunset-review-queue` for project PLAT. With one active synthetic decision it returned PLAT-33510, cited PLAT-33511 at Done, the December 10 review date, and the need for human verification. The first empty-queue invocation correctly returned no active decisions when only a retired record existed.
- Development version 2.5.0 created task PLAT-33513 for the new synthetic decision. The Jira task showed only a generic summary, verification instructions, and an opaque reference. Jira applied the project's default assignee and Critical priority; task assignment and priority are not controlled by Sunset.
- The earlier synthetic task PLAT-33512, created before this change, had its summary and description replaced with the generic format in Jira. Its historical Jira changes and issue property were not purged; the content was synthetic.
- The private production build was installed on the same demo tenant. A new decision for PLAT-33510 using prerequisite PLAT-33511 showed Condition met with current status Done and remained visible after reloading the Jira page. Production task creation and Rovo were not rerun. Distribution is still private.
- Offline validation with the installed `@forge/manifest` validator passes with zero errors. This does not replace authenticated Forge lint or tenant testing.
