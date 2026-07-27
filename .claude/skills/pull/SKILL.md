---
name: pull
description: >-
  Safely sync the local repo with GitHub. Checks for incoming commits on origin/main,
  inspects local state (uncommitted changes, unpushed commits, stashes), decides whether
  a pull is safe, and fast-forwards when it is. Use when the user says "/pull", "tõmba
  alla", "kas GitHubis on muudatusi", "sync with GitHub", "pull main", or asks whether
  the local copy is up to date. Never discards local work — anything riskier than a
  clean fast-forward stops and asks first.
---

# /pull — safe sync from GitHub

Answer two questions in order, then act:

1. **Is there anything to pull?** (incoming commits on `origin/main`)
2. **Is it safe to pull right now?** (local uncommitted work, unpushed commits, overlap)

Report in the user's language (they write Estonian — answer in Estonian).

## Authorization

CLAUDE.md requires confirmation before git commands. Invoking `/pull` **is** that
confirmation, but only for:

- read-only inspection (`fetch`, `status`, `log`, `diff`, `stash list`, `rev-list`)
- a clean **fast-forward** pull when the safety check passes

Everything else — `stash`, `merge`, `reset`, `checkout --`, force anything, committing,
pushing — **must be proposed and confirmed first**. Never run a command that can lose
uncommitted work without an explicit yes.

Never `git rebase` (see CLAUDE.md). If history needs reconciling, merge.

## Step 1 — gather state (one call)

```bash
git fetch origin --prune
echo "=== BRANCH ==="; git rev-parse --abbrev-ref HEAD
echo "=== AHEAD/BEHIND (behind<TAB>ahead) ==="; git rev-list --left-right --count origin/main...HEAD
echo "=== DIRTY ==="; git status --porcelain
echo "=== STASHES ==="; git stash list
echo "=== INCOMING COMMITS ==="; git log --oneline HEAD..origin/main
echo "=== INCOMING FILES ==="; git diff --name-only HEAD..origin/main
```

If `behind` is 0: report "kõik on värske", note any dirty files, stop.

**Unpushed commits are a flag, not a footnote.** Whenever `ahead > 0`, say so prominently
and offer to push — commits are not meant to sit local (see CLAUDE.md). Only leave them if
the user confirms the work is half-finished, since push auto-deploys.

## Step 2 — safety check

Compare **dirty files** against **incoming files**. The intersection is what matters.

| Local state | Incoming | Verdict |
|---|---|---|
| clean, 0 ahead | N commits | **Safe** — fast-forward, just do it |
| dirty, **no** overlap with incoming files | N commits | **Safe** — pull works, git won't touch those files. Name the dirty files in the report |
| dirty, **overlaps** incoming files | N commits | **STOP** — pull would be refused or would clobber. List the overlapping files, show what changed on both sides, propose options |
| clean, but ahead > 0 (diverged) | N commits | **STOP** — propose `git pull --no-rebase origin main` (merge commit) **and a push right after**, wait for yes. Never rebase |
| untracked file that incoming adds | N commits | **STOP** — git refuses. Show the file, ask whether to keep local or take remote |

For the STOP cases, present the situation and 2–3 concrete options with a recommendation.
Do not pick for the user.

## Step 3 — pull

Only on a Safe verdict:

```bash
git pull --ff-only origin main
```

`--ff-only` is mandatory. If it fails, the safety check missed something — do not retry
with a plain `git pull`. Report the failure and re-assess.

If the user is on a branch other than `main`, say so before pulling and confirm they want
`origin/main` merged into it rather than switching to `main` first.

## Step 4 — post-pull report

Summarize what actually arrived, grouped by meaning rather than by file:

- what changed on the site (new pages, components, copy)
- what changed in config or docs
- deleted or renamed files

Then check the follow-ups that bite in this project:

- **New deps?** If `package.json` or `package-lock.json` is in the incoming files, flag
  that `npm install` is needed. Offer it; don't run it unasked.
- **New env vars?** If the incoming diff adds `import.meta.env.PUBLIC_*` reads or an
  `*env*.example` file, check the local `.env` for those keys with `grep`. Missing keys
  are worth flagging — say whether the feature degrades quietly or breaks, and note that
  production needs them set in the deploy environment too.
- **ET/EN parity.** If incoming changes touch pages or copy, check whether both language
  versions arrived. A one-sided change is worth mentioning — this project mirrors ET↔EN
  by default.
- **New branches.** If `--prune` revealed new remote branches, mention them in one line.

Keep the report short. The user wants to know: what came in, does anything need doing,
is anything broken.
