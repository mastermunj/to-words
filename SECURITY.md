# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 5.x     | ✅        |
| < 5.0   | ❌        |

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

Use the private **GitHub Security Advisory** form instead:

👉 [Report a vulnerability privately](https://github.com/mastermunj/to-words/security/advisories/new)

We will:

- Acknowledge your report within **48 hours**.
- Provide an estimated fix timeline within **5 business days**.
- Release a patch and publish a coordinated disclosure once the fix is available.

## Scope

| In scope | Examples                                                               |
| -------- | ---------------------------------------------------------------------- |
| ✅       | Prototype pollution, ReDoS, arbitrary code execution via crafted input |
| ✅       | Supply chain issues (malicious dependency, compromised release)        |
| ❌       | Incorrect locale output for a specific number (file a regular issue)   |
| ❌       | Missing locale or currency support (file a regular issue)              |
