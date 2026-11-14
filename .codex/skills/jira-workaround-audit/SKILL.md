---
name: jira-workaround-audit
description: Audit temporary Jira workarounds and produce an owned, evidence-based retirement plan. Use for workflow debt, temporary exceptions, or stale workaround reviews; not for changing Jira issues without approval.
---

# Jira workaround audit

Turn scattered temporary decisions into a small, decision-ready audit. The result is a reviewable plan, not an automatic cleanup.

## Establish the audit boundary

Confirm the Jira project or saved filter, the date range, and the accountable sponsor. Work only with issue content the requester is allowed to provide or retrieve. Treat unreadable prerequisites as **Unknown**, never as satisfied.

Use a consistent record for every decision:

| Field | Purpose |
| --- | --- |
| Source issue | Where the workaround originated |
| Workaround and reason | What is temporary, in plain language |
| Owner | Person accountable for the next decision |
| Exit condition | Observable condition that permits retirement |
| Evidence | Current facts, links, and confidence |
| Review date | Latest acceptable human review |
| Recommended action | Keep, verify, retire, or escalate |

## Perform the audit

1. Find explicit temporary language: workaround, temporary, until, exception, flag, manual step, compatibility, or migration. Do not infer a workaround solely from an old issue.
2. Group duplicates by the same dependency or exit condition, keeping original issue links.
3. For each record, separate observed facts from assumptions. State when evidence is stale, incomplete, or inaccessible.
4. Identify missing owner, exit condition, or review date as governance gaps; do not manufacture values.
5. Prioritize high-impact and overdue records, then form a short review queue.

## Deliver

Provide a one-page summary with counts by recommended action, the five highest-risk decisions, and a table of the audit records. Recommend a pilot only when the team can name a sponsor and select three to ten real decisions. Ask for approval before creating or modifying Jira issues, tasks, or records.
