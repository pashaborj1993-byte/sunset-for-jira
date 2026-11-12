# Codegeist 2026 submission preparation

Deadline: December 22, 2026 at 12:00 PM Pacific Time (9:00 PM in Paris). A production build, judge installation link, and public YouTube video exist. Final Devpost submission remains open.

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

- Production installation link from the Forge developer console. Production version 2.2.0 was deployed November 11, 2026; Sharing with anyone was enabled and the Jira installation screen opened successfully. The full link is saved locally in `.impeccable/review/install-link.txt` for the Devpost form. The console's personal-data declaration is Yes because Sunset stores Atlassian account IDs.
- Public 57-second YouTube demo: `https://youtu.be/H5UEg50YIbQ`. It uses the entrant's supplied voiceover, licensed background music, and screenshots from the real Jira app and Rovo agent with synthetic issues. It does not show continuous live interaction; do not describe it as a live walkthrough.
- Two synthetic demo screenshots (production Jira workbench and Rovo review queue) were uploaded to the Devpost draft with captions and verified after reloading the form on November 12, 2026.
- Devpost text: audience, problem, differentiated idea, actual Forge/Jira implementation, limits, category, and verified bonus specifics.
- Screenshots, public source repository at `https://github.com/pashaborj1993-byte/sunset-for-jira`, public privacy notice at `https://github.com/pashaborj1993-byte/sunset-for-jira/blob/main/PRIVACY.md`, and the authorized support contact.
- A restricted JSM support desk has been tested with portal request SSUP-1 and an agent queue. Its project lead is now a recipient for future new-request notifications. Email delivery, a separate customer account, and a customer-facing AI agent remain unverified; see `SUPPORT.md`.

## Release gates still open

- Test installation from a non-contributor admin account using the sharing link.
- The public privacy notice is hosted in the approved source repository. The owner authorized babimoore954@gmail.com as the public support contact on November 11. Sharing with anyone is active; any Atlassian site administrator with the link can install the app and consent to its Jira scopes.
- Test permission differences with two Jira users; confirm no source record leaks.
- Test the `rovo:mcp` tool from an MCP-compatible client or Rovo Studio.
- An external MCP client additionally requires a site or organization admin to enable the app's tool in Connected apps; that exposure is disabled by default.
- Test task creation in another Jira project and the uncertain-write recovery instructions.
- Decide whether to implement a useful, demonstrable Teamwork Graph relationship before claiming that bonus.
- Run a real engineer pilot. Current records and feedback are synthetic; do not present them as customer validation.
- The public YouTube URL is saved in the Devpost draft. Review the finalization screen and submit after the required action-time acceptance of the official rules and Devpost terms. A longer continuous live walkthrough could strengthen the entry before the deadline.

Do not state that any open gate is complete in the video or submission.
