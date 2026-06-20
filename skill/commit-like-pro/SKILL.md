---
name: commit-like-pro
description: Review pending git changes and create senior-quality commits. Groups unrelated changes into separate logical commits, writes Conventional Commits messages that explain the *why*, and executes them — all on a tight token budget. Use when the user says "commit", "commit my changes", "commit like a pro", "ship this", or wants help writing a commit message.
license: MIT
---

# Commit like a pro

Turn whatever is pending in the repo into clean, senior-grade commits — **without burning tokens**. A senior engineer surveys cheaply, splits unrelated work into separate commits, and writes messages that explain intent. So do you.

## Token budget — read this FIRST

Do **not** dump full diffs into context by default. Full diffs are the single biggest token cost of committing, and you rarely need them. Follow the staged survey:

1. **Survey cheaply** with `--stat` / `status` (filenames + line counts only).
2. **Infer intent** from paths and stat. Most changes are obvious from the file list alone.
3. **Read line-level diff ONLY** for files whose intent you genuinely cannot infer, and read only the hunks you need (`git diff -- <path>`).

On typical changes this whole task should cost a few hundred tokens, not thousands.

## Workflow

### 1. Survey (cheap)

Run these together, in one batch — they are read-only:

```
git status --short --branch
git diff --stat HEAD
git log --oneline -15
```

- `status`/`diff --stat` tell you *what* changed and how much.
- `log` reveals the repo's existing conventions (type prefixes, scope style, language, issue refs) — **match them**.

Do **not** run a bare `git diff` here. If the working tree is clean, tell the user there's nothing to commit and stop.

### 2. Understand intent (cheap-first)

For each changed file, infer the change type from its path + stat:

- `*.test.*`, `__tests__/`, `*_spec.*` → tests
- `README`, `docs/`, `*.md` → docs
- `package.json` + lockfile, `*.csproj`, `requirements.txt` → dependency/build change
- `.github/`, CI configs → ci
- source files with logic edits → feature / fix / refactor (this is the only case that may need a real diff)

Only run `git diff -- <path>` for files where intent is genuinely ambiguous. Read the minimum.

### 3. Group into logical commits

A senior **never** bundles unrelated changes into one commit. Split the pending work into groups by concern:

- **One concern per commit.** A bug fix and a new feature are two commits.
- **Keep refactors separate** from behavior changes — a reviewer must be able to trust that a `refactor:` commit changes no behavior.
- **A change and its tests belong together** — don't split them apart.
- **Lockfile changes ride with** the dependency change that caused them.
- If everything truly belongs to one concern, one commit is correct — don't manufacture splits.

### 4. Guardrails — STOP and ask the user if you see

- Secrets, credentials, API keys, tokens, or `.env` values in the diff.
- Merge-conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
- Large/binary/generated files that look accidental (`dist/`, `build/`, `node_modules/`, `.map`).
- Debug leftovers: stray `console.log`, `print`, `dd()`, commented-out blocks, `TODO`/`FIXME` added in this change.

**Never** `git add .` or `git add -A` blindly — stage explicit paths per group so nothing unintended sneaks in.

### 5. Write the message (senior style)

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footers>
```

- **type**: `feat` `fix` `refactor` `perf` `docs` `test` `build` `ci` `chore` `style` `revert`
- **subject**: imperative mood (`add`, not `added`/`adds`), no trailing period, ≤ 50 chars.
- **scope** (optional): the area touched (`auth`, `api`, `parser`). Use the repo's existing scopes.
- **body** (when the change isn't trivial): blank line, then wrap ~72 cols. Explain **why** and notable trade-offs — *not* a restatement of the diff. The diff already says what changed; the message says why.
- **footers**: `BREAKING CHANGE: <desc>` for breaking API changes; `Refs #123` / `Closes #123` for issues.

**DO**

```
feat(auth): rate-limit failed login attempts

Lock an account for 15 min after 5 failed attempts to blunt
credential-stuffing. Limit is keyed per IP + account so a single
attacker can't lock out a real user from another IP.

Closes #214
```

**DON'T**

```
updated files        # what files? why?
fix bug              # which bug?
changes / wip / stuff / asdf
"Added a new function that adds two numbers and returns the result"  # restates the diff
```

### 6. Present the plan, then execute

Show a **compact** plan — for each group: the paths and the proposed one-line subject. Keep it short.

Unless the user already said something like "just commit" / "commit directly", confirm before writing. On confirmation, for each group:

```
git add -- <explicit path> <explicit path>
git commit -F <message-file>      # use a temp file for multi-line bodies (portable across shells)
```

> For a one-line message you can use `git commit -m "<subject>"`. For a body, write the full message to a temp file and use `-F` — this avoids quoting/newline issues on PowerShell and bash alike.

Finish by reporting `git log --oneline -n <count>` so the user sees exactly what landed.

## Notes

- **Respect hooks.** If a pre-commit hook fails, surface its output and fix the cause. Do **not** pass `--no-verify` unless the user explicitly asks.
- **Already staged?** If changes are staged and the user clearly wants a single commit, skip grouping and just write the message.
- **Amend only when asked.** Never rewrite published history on your own initiative.
- **Don't push** unless the user asks.
