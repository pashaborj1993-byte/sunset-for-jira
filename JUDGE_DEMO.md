# Sunset judge demo plan

Status: a 72-second narrated screenshot-based draft exists at `videos/codegeist-demo/renders/sunset-codegeist-narrated-draft.mp4`. It uses a local synthetic voice, is not uploaded, and does not show a continuous live interaction. Replace or expand it with a spoken live walkthrough before public submission; the shot list below remains the target.

## Claim to demonstrate

Teams leave temporary workarounds in place because the original reason and the condition for revisiting them are separated from daily work. Sunset records that decision beside Jira work, checks the prerequisite when a person opens or refreshes the app, and creates a human verification task when review is due. A completed prerequisite is not proof that removal is safe.

## Four-minute video sequence

| Time      | Screen                          | Evidence to show                                                                                                                               |
| --------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 0:00–0:25 | Two labelled Jira issues        | A workaround source and a separate prerequisite in To Do. State the engineering lead's problem in one sentence.                                |
| 0:25–1:10 | Sunset project page             | Register the reason, owner, prerequisite status, and review date. Show Watching.                                                               |
| 1:10–1:50 | Prerequisite issue, then Sunset | Move prerequisite to Done, refresh evidence, and show Condition met with the exact issue keys and checked time.                                |
| 1:50–2:30 | Sunset and created Jira task    | Create the review task. Show its generic instructions and explain that restricted decision details remain in Sunset.                           |
| 2:30–3:10 | Sunset Guide in Rovo            | Ask which project workarounds need review. Show a real `get-sunset-review-queue` invocation and its cited result.                              |
| 3:10–3:45 | Decision details                | Extend with a reason or retire after verification; reload to show history persists.                                                            |
| 3:45–4:00 | Closing frame                   | State the measured pilot result if one exists; otherwise explicitly say the demo uses synthetic issues. Give category and verified bonus only. |

Record with readable text and no browser account email, API key, unrelated notifications, or real private issue data visible. The submission requires a public YouTube video under five minutes.

## Judge installation checklist

1. Public distribution link opens the production Forge install page for Jira.
2. A non-contributor Jira site admin can install and grant the listed scopes.
3. Fresh installation can register a decision, read evidence, create a task, and invoke Sunset Guide.
4. Judge instructions state that a standard Task type is required and that prerequisite checks happen on demand.
5. Public privacy notice and support contact are linked from installation details.

## Real pilot evidence to collect

Ask one engineering or platform lead to use Sunset with a real but shareable temporary workaround for at least one review cycle. Record the prior failure mode, time to register, whether the review happened earlier than it otherwise would, and any confusing or unnecessary step. Get permission before quoting their words or showing their data. Until then, claim no customer validation.

## Submission position

Category: Apps for Software Teams. Agent bonus has a live demonstration. MCP bonus requires a real MCP client invocation and admin configuration before it is presented as working. Teamwork Graph and Marketplace bonuses are not implemented. The rules allow at most one grand prize and one bonus prize per submission, so focus on a complete primary story.
