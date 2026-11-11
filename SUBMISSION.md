# Codegeist 2026 submission preparation

Deadline: December 22, 2026 at 12:00 PM Pacific Time. Submit before that time on Devpost. A private production build exists, but there is no installation link or submitted entry yet.

## Project position

- Category: Apps for Software Teams.
- Main requirement: Forge app with Jira project page, issue panel, Forge storage, and user-scoped Jira reads and writes.
- Best Agents: `rovo:agent` Sunset Guide plus two working read-only Forge actions. Both issue explanation and project review queue were invoked live on November 11, 2026.
- Best app with Atlassian MCP: `rovo:mcp` exposes the same two actions. Manifest deployment verified; an MCP client invocation remains to be tested before claiming this prize.
- Teamwork Graph and Marketplace bonuses: not yet eligible.
- Production smoke test: private version 2.0.0 installed on `one-atlas-isyq.atlassian.net` on November 11. A new PLAT-33510 decision using prerequisite PLAT-33511 showed Done and Condition met, then persisted after a Jira page reload. The updated version 2.2.0 was deployed privately after development testing; its changed task creation and new agent action have not yet been rerun in production.

The core Jira workflow uses Forge and no separate model host. Forge usage beyond its free allowance and Rovo interactions can incur Atlassian usage charges. Keep development tests small and check usage in Atlassian Administration before broader pilots.

## Judge path to test

1. Install Sunset on a Jira Cloud site using the production sharing link once it is created. The installing user must be a site admin. The site needs a Jira project with a standard Task issue type and no additional mandatory Task fields for the retirement-task step.
2. Create two plainly labelled test issues in that project: a source workaround issue and a separate prerequisite issue. Leave the prerequisite in an unfinished status and note its key.
3. Open the project's Sunset page. Register the source key, a short workaround title and reason, the prerequisite key, its target Done status, and a future review date.
4. Confirm Sunset shows the current prerequisite status and Watching. Open the prerequisite in Jira, move it to Done, return to Sunset, and click Refresh evidence.
5. Confirm Condition met means review is needed. Click Create retirement task. Open the created Jira task and read the verification instructions. Refresh Sunset and confirm the same task remains linked.
6. Extend the review with a reason or record retirement with a note. Confirm the audit history persists after a reload.
7. In Jira Rovo, choose Sunset Guide and ask it to explain the workaround on the source issue key. It should cite the live status, prerequisite, review date, and task, and avoid claiming removal is safe.

## Required submission materials

- Production installation link from the Forge developer console. Production version 2.2.0 was deployed November 11, 2026, but distribution remains private. The console's personal-data declaration was corrected to Yes because Sunset stores Atlassian account IDs.
- Public YouTube video under five minutes showing the real Jira workflow and agent response.
- A local 72-second silent screenshot-based draft is rendered and visually checked. It is not a public YouTube demo or a substitute for a clear live walkthrough with narration.
- Devpost text: audience, problem, differentiated idea, actual Forge/Jira implementation, limits, category, and verified bonus specifics.
- Screenshots, source repository URL, reviewed public privacy notice, and a support contact. `PRIVACY.md` is a local draft, not a public URL.
- A restricted JSM support desk has been tested with portal request SSUP-1 and an agent queue. Its project lead is now a recipient for future new-request notifications. Email delivery, a separate customer account, and a customer-facing AI agent remain unverified; see `SUPPORT.md`.

## Release gates still open

- Test installation from a non-contributor admin account using the sharing link.
- Review and host the privacy notice before enabling Sharing with anyone. The owner authorized babimoore954@gmail.com as the public support contact on November 11. This setting allows anyone with the link to install on an Atlassian site after its administrator grants consent.
- Test permission differences with two Jira users; confirm no source record leaks.
- Test the `rovo:mcp` tool from an MCP-compatible client or Rovo Studio.
- An external MCP client additionally requires a site or organization admin to enable the app's tool in Connected apps; that exposure is disabled by default.
- Test task creation in another Jira project and the uncertain-write recovery instructions.
- Decide whether to implement a useful, demonstrable Teamwork Graph relationship before claiming that bonus.
- Run a real engineer pilot. Current records and feedback are synthetic; do not present them as customer validation.
- Record and publish the video, then submit the complete Devpost form.

Do not state that any open gate is complete in the video or submission.
