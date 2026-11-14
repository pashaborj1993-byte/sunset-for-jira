---
name: human-approved-agent
description: Design or review an AI workflow that drafts, retrieves, or recommends while a person approves consequential actions. Use for production agent workflows; not for fully autonomous financial, legal, security, or access-changing actions.
---

# Human-approved agent

Make the system useful because its boundaries are explicit, not because it acts without oversight.

## Define the decision boundary

Classify every tool action as one of:

- **Read:** retrieve or summarize permitted data.
- **Draft:** prepare a proposed message, record, or action.
- **Execute:** write, send, pay, delete, change permissions, or change an external system.

Reads and drafts may run after ordinary authentication and access checks. Execution requires a named person, a visible summary of the effect, and an approval immediately before the action. Never let model output choose credentials, bypass authorization, or alter the approval policy.

## Build the workflow

1. State the user outcome and the system of record.
2. List tools, inputs, side effects, owners, and failure modes.
3. Retrieve only authorized context from the server or connected system; do not rely on browser-provided records for authorization.
4. Produce a structured draft with assumptions, source links, and an execution preview.
5. Require approval with an idempotency key or comparable duplicate-write protection.
6. Reconcile uncertain external writes by querying the system of record before retrying.
7. Log the request, approval identity, action identifier, and final observed status without logging secrets.

## Ship gate

Before calling the workflow production-ready, demonstrate a denied user, malformed input, duplicate request, timeout after a remote write, stale data, and revoked access. Report what remains untested. If a workflow cannot explain who approved which action and how to recover an ambiguous write, it is not ready to automate.
