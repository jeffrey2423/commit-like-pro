<!-- commit-like-pro:start -->
## Committing changes

When asked to commit (or to "commit like a pro"), follow the **commit-like-pro** workflow:

1. **Survey cheaply first** — `git status --short --branch`, `git diff --stat HEAD`, and
   `git log --oneline -15`. Do **not** dump full diffs into context; only read
   `git diff -- <path>` for files whose intent you can't infer from the path + stat.
2. **Group unrelated changes** into separate logical commits — one concern per commit;
   keep refactors apart from behavior changes; tests ride with the code they cover.
3. **Stage explicit paths** per group. Never `git add .` / `-A` blindly. Stop and ask if
   you spot secrets, conflict markers, accidental build artifacts, or debug leftovers.
4. **Write [Conventional Commits](https://www.conventionalcommits.org/)** messages:
   `type(scope): subject` (imperative, ≤50 chars, no period), a body that explains the
   **why** (not a restatement of the diff), and footers (`BREAKING CHANGE:`, `Closes #123`).
   Match the repo's existing commit style and language.
5. **Show a compact plan, confirm, then commit.** Respect hooks — never `--no-verify`
   unless asked. Don't push unless asked.

Full skill: `.claude/skills/commit-like-pro/SKILL.md` (Claude Code).
<!-- commit-like-pro:end -->
