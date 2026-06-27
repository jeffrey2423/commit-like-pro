#!/usr/bin/env node

// Installer for commit-like-pro.
// Drops a token-efficient "commit like a pro" skill where an AI coding agent
// will find it: Claude Code's skills directory (project-local or global), plus
// optional project agent pointers so Cursor / Copilot / other tools pick it up too.

const fs = require("fs");
const os = require("os");
const path = require("path");

const PKG_ROOT = path.join(__dirname, "..");
const SKILL_SRC = path.join(PKG_ROOT, "skill", "commit-like-pro");
const AGENTS_SNIPPET = path.join(PKG_ROOT, "templates", "AGENTS.snippet.md");

const SKILL_REL = path.join(".claude", "skills", "commit-like-pro");
const CURSOR_RULE_REL = path.join(".cursor", "rules", "commit-like-pro.mdc");
const AGENTS_START = "<!-- commit-like-pro:start -->";
const AGENTS_END = "<!-- commit-like-pro:end -->";

// ── Copy helpers ─────────────────────────────────────────────────────────────
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  let count = 0;
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) {
      count += copyDir(src, dest);
    } else {
      fs.copyFileSync(src, dest);
      count++;
    }
  }
  return count;
}

function installSkill(baseDir) {
  const dest = path.join(baseDir, SKILL_REL);
  const count = copyDir(SKILL_SRC, dest);
  return { dest, count };
}

// ── AGENTS.md pointer (project installs only) ────────────────────────────────
// Idempotent: replace the marked block if present, else append (or create).
function readAgentSnippet() {
  const snippet = fs.readFileSync(AGENTS_SNIPPET, "utf8").trim();
  return snippet;
}

function upsertMarkedBlock(target, snippet, createContent) {
  fs.mkdirSync(path.dirname(target), { recursive: true });

  if (!fs.existsSync(target)) {
    fs.writeFileSync(target, createContent(snippet));
    return { target, action: "created" };
  }

  const current = fs.readFileSync(target, "utf8");
  const startIdx = current.indexOf(AGENTS_START);
  const endIdx = current.indexOf(AGENTS_END);

  if (startIdx !== -1 && endIdx !== -1) {
    const before = current.slice(0, startIdx);
    const after = current.slice(endIdx + AGENTS_END.length);
    fs.writeFileSync(target, before + snippet + after);
    return { target, action: "updated" };
  }

  const sep = current.endsWith("\n") ? "\n" : "\n\n";
  fs.writeFileSync(target, current + sep + snippet + "\n");
  return { target, action: "appended" };
}

function upsertAgentsPointer(baseDir) {
  const target = path.join(baseDir, "AGENTS.md");
  const snippet = readAgentSnippet();
  return upsertMarkedBlock(target, snippet, (body) => {
    const header = "# Project agent instructions\n\n";
    return header + body + "\n";
  });
}

function upsertCursorRule(baseDir) {
  const target = path.join(baseDir, CURSOR_RULE_REL);
  const snippet = readAgentSnippet();
  return upsertMarkedBlock(target, snippet, (body) => body + "\n");
}

// ── Flags ────────────────────────────────────────────────────────────────────
function parseFlags(argv) {
  const flags = {};
  for (const arg of argv) {
    if (arg === "-y") { flags.yes = true; continue; }
    if (arg === "-h") { flags.help = true; continue; }
    if (!arg.startsWith("--")) continue;
    const [k, v] = arg.slice(2).split("=");
    flags[k] = v === undefined ? true : v;
  }
  return flags;
}

// ── Interactive ──────────────────────────────────────────────────────────────
async function interactive() {
  const p = await import("@clack/prompts");
  p.intro("✍️  commit-like-pro — install the senior-commit skill");

  const scope = await p.select({
    message: "Where should the skill be installed?",
    options: [
      { value: "project", label: "This project", hint: "./.claude/skills — versioned with the repo, shared with your team" },
      { value: "global", label: "Global (all my repos)", hint: "~/.claude/skills — available everywhere, no reinstall" },
    ],
    initialValue: "project",
  });
  if (p.isCancel(scope)) cancel(p);

  let withAgents = false;
  if (scope === "project") {
    const ans = await p.confirm({
      message: "Also add project agent pointers? (AGENTS.md plus a Cursor rule)",
      initialValue: true,
    });
    if (p.isCancel(ans)) cancel(p);
    withAgents = ans;
  }

  return { scope, withAgents };
}

function cancel(p) {
  p.cancel("Cancelled — nothing was written.");
  process.exit(0);
}

// ── Help ─────────────────────────────────────────────────────────────────────
function printHelp() {
  console.log(`
commit-like-pro — install an AI skill that writes senior-grade git commits.

Usage:
  npx commit-like-pro                 interactive
  npx commit-like-pro [flags]         non-interactive

Flags:
  --project            install into ./.claude/skills (default)
  --global             install into ~/.claude/skills (all your repos)
  --with-agents        also add/refresh AGENTS.md and Cursor rule pointers (project installs)
  --no-agents          skip project agent pointers
  --yes, -y            run non-interactively with the given flags / defaults
  --help, -h           show this help

Examples:
  npx commit-like-pro --project --with-agents
  npx commit-like-pro --global --yes
`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const argv = process.argv.slice(2);
  const flags = parseFlags(argv);

  if (flags.help) {
    printHelp();
    return;
  }

  let sel;
  const explicitScope = flags.project || flags.global;
  const nonInteractive = explicitScope || flags.yes;

  if (nonInteractive) {
    const scope = flags.global ? "global" : "project";
    let withAgents = scope === "project";
    if (flags["no-agents"]) withAgents = false;
    if (flags["with-agents"]) withAgents = true;
    sel = { scope, withAgents };
  } else {
    sel = await interactive();
  }

  const baseDir = sel.scope === "global" ? os.homedir() : process.cwd();
  const { dest, count } = installSkill(baseDir);

  console.log(`\n✓ Installed commit-like-pro skill (${count} file${count === 1 ? "" : "s"})`);
  console.log(`  → ${dest}`);

  if (sel.withAgents) {
    for (const { label, result } of [
      { label: "AGENTS.md pointer", result: upsertAgentsPointer(baseDir) },
      { label: "Cursor rule", result: upsertCursorRule(baseDir) },
    ]) {
      const { target, action } = result;
      console.log(`✓ ${action === "created" ? "Created" : action === "updated" ? "Refreshed" : "Updated"} ${label}`);
      console.log(`  → ${target}`);
    }
  }

  console.log(`
Next:
  • Claude Code  — just say "commit like a pro" (the skill loads on demand).
  • Other tools  — point your agent at the SKILL.md${sel.withAgents ? " / AGENTS.md / Cursor rule" : ""} above.
`);
}

main().catch((err) => {
  console.error("\n✗ Install failed:", err.message);
  process.exit(1);
});
