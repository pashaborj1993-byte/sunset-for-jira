---
name: jira-pilot-launch
description: Plan and run a bounded Jira workflow-automation pilot with measurable success criteria and safe human checkpoints. Use for customer pilots, not broad production rollouts.
---

# Jira pilot launch

Create a pilot that proves a business outcome before expanding the product surface.

## Frame the engagement

Write a pilot brief with one sponsor, one project, three to ten representative decisions, a two-week review window, and a named success decision: expand, retain manually, or stop. Do not promise a full Jira migration or an autonomous resolution system.

## Discovery

Ask for a concrete example of a temporary workaround that outlived its usefulness. Identify:

- who owns the workaround;
- the exit condition and where its evidence appears;
- the people permitted to view and change the source issue;
- the current review and escalation path;
- what manual coordination the team wants to avoid.

Use synthetic or non-sensitive data for setup whenever practical. Record unanswered questions as assumptions, not requirements.

## Configure and prove

Start with the minimum permissions and one project. Test registration, evidence refresh, one review task, one extension, and one retirement record. Verify reload behavior and task de-duplication. When an external write is uncertain, stop and reconcile it before retrying.

## Evaluate

Hold a short review with the sponsor. Compare the agreed baseline against the pilot:

| Measure | Evidence |
| --- | --- |
| Decisions with an owner and review date | Decision list |
| Decisions with an observable exit condition | Decision list |
| Reviews triggered without duplicate tasks | Jira history |
| Time spent finding status and owner | Team estimate, labelled as estimate |
| Permission or adoption blockers | Named blocker and owner |

Recommend expansion only when the sponsor confirms a valuable outcome and the team accepts the governance model. Otherwise document the blocker and next smallest experiment.
