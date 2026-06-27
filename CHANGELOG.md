# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/) and the project adheres to
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-06-27

### Added

- `--with-agents` now installs a native Cursor rule at
  `.cursor/rules/commit-like-pro.mdc` alongside the `AGENTS.md` pointer.
- Automated GitHub Releases: when `package.json`'s version changes, the publish
  workflow creates the `vX.Y.Z` tag and a release with notes from `CHANGELOG.md`.
- Dependabot config keeping GitHub Actions and npm dependencies current.
- Dependabot auto-merge for patch/minor updates once CI passes; major updates
  are flagged for manual review.

### Changed

- Bumped `@clack/prompts` from 0.7.0 to 1.6.0.

## [0.1.0] - 2026-06-20

### Added

- Initial release.
- `commit-like-pro` skill (`SKILL.md`) — a token-efficient, senior-grade commit
  workflow: cheap survey → group unrelated changes into separate commits →
  Conventional Commits messages that explain the *why* → execute.
- `npx commit-like-pro` installer with interactive and flag-driven modes.
- Install into the current project (`./.claude/skills`) or globally
  (`~/.claude/skills`); optional `AGENTS.md` pointer for Cursor / Copilot and
  other agents.
