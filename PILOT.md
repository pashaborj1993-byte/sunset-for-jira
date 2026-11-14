# Sunset pilot

## Outcome

Establish whether Sunset helps one Jira project turn temporary workarounds into owned, reviewed decisions without exposing issue data outside Atlassian.

## Good pilot fit

- A team has temporary flags, manual steps, compatibility exceptions, or similar workaround debt.
- Jira is already the system of record for the work that created the workaround.
- A project administrator and one engineering lead can take part in a 30-minute discovery session and a 30-minute review.
- The team can use synthetic or non-sensitive examples for the first pass.

## Scope

Start with one project, three to ten active workaround decisions, and a two-week review window. Record the workaround, owner, prerequisite, actual target status, review date, and removal reason. Do not import a backlog in bulk before the team agrees on the data model.

## Success measures

The pilot is successful when the team can show all of the following:

1. Every pilot decision has an owner, an exit condition, and a review date.
2. A reviewer can distinguish confirmed evidence from unknown or inaccessible evidence.
3. At least one due or satisfied condition produces a review task without duplicating work.
4. The team can explain who may view or change a decision and why.
5. The sponsor chooses one of: expand, keep as a governed manual process, or stop.

## Safety boundaries

- Keep the first pilot inside Forge and Jira; do not add a third-party model or external database merely to demonstrate AI.
- Use the minimum Jira permissions needed for the chosen workflow.
- Do not paste restricted issue text into prompts, tickets, or public repositories.
- Reconcile ambiguous remote writes before retrying them.
- A human approves retirement and any consequential Jira change.

## Evaluation meeting

Review the decision list, evidence quality, duplicate-task behavior, permission questions, and the amount of manual coordination avoided. Capture one concrete before/after example. That example—not a feature list—is the basis for an expansion proposal or Marketplace positioning.
