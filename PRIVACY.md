# Sunset privacy notice (draft for release)

Sunset is a Forge app for Jira Cloud. It records temporary workaround decisions so a team can revisit them when a prerequisite changes. This notice describes the current implementation. Review it with the app owner before using it as a public policy.

## Data Sunset handles

Sunset reads Jira issue keys, summaries, project and status information, and the current user's issue permissions. It stores decision titles, reasons, source and prerequisite issue keys, target status, review dates, observed status and check time, retirement task references, and decision history in Atlassian Forge key-value storage. History includes the Atlassian account IDs of the people who registered or changed a decision, timestamps, and their notes. A user may put personal information in a free-text reason or note; teams should avoid doing so unless needed.

Sunset creates a Jira Task only when an authorized user requests it. That task has a generic summary, verification instructions, and an opaque Sunset reference. It does not copy the decision title, reason, or prerequisite summary into the task description. Sunset stores a reference to the created task.

## Access and processing

Jira reads and writes run as the current user. Sunset checks access to the source issue before returning a stored decision and checks Edit issues permission before changing it. A prerequisite that the user cannot read is shown as unknown. Users who can edit the source issue can change its decision; the current version does not restrict changes to the original author.

The app runs on Atlassian Forge and uses Atlassian-managed storage. Its core workflow has no external analytics, model host, or application server. The optional Sunset Guide Rovo agent and Atlassian MCP tool return permitted decision information through Atlassian's Rovo platform when invoked. Atlassian's own terms and privacy notices also apply to its products and platform.

## Retention and deletion

Sunset currently has no self-service deletion or export control for decision records. Stored records persist until an administrator or app owner removes them through an appropriate Forge administration process or the installation is removed under Atlassian's applicable data lifecycle. Do not assume uninstall immediately erases every copy. Jira tasks created by Sunset are ordinary Jira issues and remain subject to the site's Jira retention and deletion settings.

## Contact

For support or privacy questions, email babimoore954@gmail.com. Do not send API tokens or private Jira issue content by email; include an issue key and a brief description when possible.

The separate Sunset Support Jira Service Management desk is currently a restricted demo-site proof of concept. If enabled for customers later, Atlassian will store their contact details, requests, and messages in Jira Service Management under that site's access and retention settings. It is not part of Sunset's Forge key-value store.
