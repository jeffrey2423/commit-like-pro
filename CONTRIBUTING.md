# Contributing

Thanks for your interest in improving **commit-like-pro**! Contributions of all
kinds are welcome — sharper skill instructions, clearer examples, installer
improvements, and bug fixes.

## Project layout

```
bin/cli.js                          # installer (Node, only dep is @clack/prompts)
skill/commit-like-pro/SKILL.md      # the skill itself — the heart of the project
templates/AGENTS.snippet.md         # pointer block injected into a project's AGENTS.md
```

## Local setup

```bash
git clone https://github.com/jeffrey2423/commit-like-pro.git
cd commit-like-pro
npm install
```

Try the installer against a scratch folder:

```bash
mkdir -p /tmp/try && cd /tmp/try
node /path/to/commit-like-pro/bin/cli.js --project --with-agents --yes
node /path/to/commit-like-pro/bin/cli.js --help
```

## Editing the skill

The skill is the product. When you change `skill/commit-like-pro/SKILL.md`:

- **Keep it short.** Agents pay tokens for everything they load — every line must
  earn its place. Prefer imperative bullets over prose.
- **Preserve the token discipline.** The cheap-survey-first rule (don't dump full
  diffs) is the core value proposition; don't weaken it.
- **Keep the guardrails.** No blind `git add .`/`-A`, stop on detected secrets,
  no `--no-verify` unless asked.
- Use **DO / DON'T** examples for any non-trivial rule.

## Pull requests

- Branch from `main`, keep the change focused.
- Use [Conventional Commits](https://www.conventionalcommits.org/) — and yes,
  this project commits like a pro. 🙂
- Describe what changed and why; reference any issue.
- Don't bump the package version in your PR — releases are handled by the
  maintainer.

## Releases

Merging to `main` runs the publish workflow. **Only when `package.json`'s version
changes** does it publish to npm and then create the matching `vX.Y.Z` git tag and
GitHub Release (notes are taken from the matching `CHANGELOG.md` section, falling
back to auto-generated notes). Docs/meta changes ship without a bump.

To cut a release: add a `## [X.Y.Z]` section to `CHANGELOG.md`, bump `version` in
`package.json`, and merge to `main` — the rest is automatic.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md).
