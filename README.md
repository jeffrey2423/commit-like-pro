# commit-like-pro

> Install a **token-efficient AI skill** that reviews your pending changes and writes **senior-grade git commits** — group, message, and commit like a pro.

[![CI](https://github.com/jeffrey2423/commit-like-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/jeffrey2423/commit-like-pro/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/commit-like-pro.svg)](https://www.npmjs.com/package/commit-like-pro)
[![npm downloads](https://img.shields.io/npm/dm/commit-like-pro.svg)](https://www.npmjs.com/package/commit-like-pro)
[![node](https://img.shields.io/node/v/commit-like-pro.svg)](https://www.npmjs.com/package/commit-like-pro)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Most AI commit helpers do one expensive thing: they shove your entire `git diff`
into the model and ask for a message. That burns tokens and still produces
`updated files`. `commit-like-pro` teaches your agent to commit the way a senior
engineer does — and to do it cheaply.

## What it does

When you tell your AI agent **"commit like a pro"**, the skill makes it:

1. **Survey cheaply first** — `git status`, `git diff --stat`, `git log`. It reads
   full diffs only for files whose intent it can't infer from the path + stat.
   That's the trick that keeps token cost down.
2. **Group unrelated changes** into separate, logical commits — one concern each.
   Refactors stay apart from behavior changes; tests ride with the code they cover.
3. **Write [Conventional Commits](https://www.conventionalcommits.org/)** messages
   that explain the **why**, not a restatement of the diff — matching your repo's
   existing style.
4. **Guard against mistakes** — never `git add .` blindly, stops on detected
   secrets / conflict markers / debug leftovers, respects your git hooks.
5. **Show a plan, confirm, then commit.**

## Install

```bash
npx commit-like-pro
```

The installer asks where to put the skill:

- **This project** → `./.claude/skills/commit-like-pro/` (versioned with the repo,
  shared with your team), and optionally project agent pointers (`AGENTS.md` and
  `.cursor/rules/commit-like-pro.mdc`).
- **Global** → `~/.claude/skills/commit-like-pro/` (available in every repo).

### Non-interactive

```bash
npx commit-like-pro --project --with-agents   # current repo + agent pointers
npx commit-like-pro --global --yes            # everywhere, no prompts
```

| Flag | Effect |
|---|---|
| `--project` | Install into `./.claude/skills` (default) |
| `--global` | Install into `~/.claude/skills` |
| `--with-agents` | Also add/refresh `AGENTS.md` and `.cursor/rules/commit-like-pro.mdc` (project installs) |
| `--no-agents` | Skip project agent pointers |
| `--yes`, `-y` | Run non-interactively |
| `--help`, `-h` | Show help |

## Usage

**Claude Code** — the skill loads on demand. Just say:

```
commit like a pro
```

**Cursor** — with `--with-agents`, the workflow is added to
`.cursor/rules/commit-like-pro.mdc` so Cursor can surface it as a project rule.

**Copilot / other agents** — with `--with-agents`, the workflow is also added to
your project's `AGENTS.md`. Or point your agent at
`.claude/skills/commit-like-pro/SKILL.md` directly.

## Why "token-efficient"?

A bare `git diff` of a busy branch can be tens of thousands of tokens. The skill's
first rule is **don't load that by default** — survey with `--stat` and filenames,
and pull line-level diffs only for the handful of files where intent is genuinely
ambiguous. On a typical change the whole task costs a few hundred tokens.

## Contributing & governance

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md). The skill itself
(`skill/commit-like-pro/SKILL.md`) is the product — keep it short, imperative, and
faithful to the token-discipline and guardrails.

**How changes land.** The `main` branch is protected:

- Every change goes through a **pull request** — no direct pushes, maintainer included.
- **CI must pass** (`Installer smoke test` on Node 18 / 20 / 22) before a PR can merge.
- Force-pushes and deletion of `main` are blocked.
- **Releases are automated** — bump `version` in `package.json`, merge to `main`, and the
  workflow publishes to npm and opens the matching `vX.Y.Z` GitHub Release.

To contribute: branch from `main`, commit with
[Conventional Commits](https://www.conventionalcommits.org/) (this project commits like a
pro 🙂), open a PR, and make sure CI is green.

## License

[MIT](LICENSE) © Jeffrey Rios
