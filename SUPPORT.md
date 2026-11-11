# Sunset support desk

On November 11, 2026, a restricted Jira Service Management project named Sunset Support (SSUP) was created on the owned demo site `one-atlas-isyq.atlassian.net`. Its portal is `https://one-atlas-isyq.atlassian.net/servicedesk/customer/portal/13`, and its generated inbox is `ssup@one-atlas-isyq.atlassian.net`. The project remains limited to invited customers.

The portal's **Ask a question** form created SSUP-1, which appeared in both the requester view and the agent's All open queue. JSM stores customer identities, requests, and comments in its own managed system, so a second SQL database would duplicate sensitive support data and create another access and retention problem. The public contact authorized by the owner is `babimoore954@gmail.com`; it is not connected to the JSM inbox.

Internal notifications for **A work item is created** now include **Space Lead**, in addition to watchers, assignee, and reporter. This takes effect on future requests. Email delivery to the lead has not been verified. The test ticket is unassigned.

The JSM self-service AI agent can be prepared for this portal, but it has not been published or tested with a knowledge base. Do not describe a customer chatbot as live. Atlassian AI and Rovo usage may incur charges, so check the site's entitlement and usage before publishing one. A small, reviewed knowledge base and a test of accurate ticket escalation should precede activation.

This is a demo-site proof of concept. Before using the desk as the public support destination, move it to a durable owned site, review customer access and retention, test a request from a separate customer account, and verify that the space lead receives an email. Keep the public email as the support contact until then.
