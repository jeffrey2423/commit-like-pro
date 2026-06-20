# Security Policy

## Reporting a vulnerability

If you discover a security issue, please **do not open a public issue**.
Instead, use GitHub's private vulnerability reporting:

https://github.com/jeffrey2423/commit-like-pro/security/advisories/new

You can expect an initial response within a few business days.

## Scope

This package is an installer plus a markdown skill. It runs locally, has no
network calls, and only writes files under the chosen install directory
(`.claude/skills/` and, optionally, `AGENTS.md`). The skill itself instructs an
AI agent to run **read-first** git commands and to never stage with
`git add .`/`-A` blindly, never commit detected secrets, and never bypass hooks
with `--no-verify` unless explicitly asked.
