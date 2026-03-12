---
name: browser-qa
description: Browser automation using Playwright CLI. Headless by default, parallel sessions, token-efficient (screenshots/snapshots save to disk). Base skill referenced by all feature QA skills. Use when browsing, screenshotting, interacting with web pages, or doing UI testing. Keywords - browse, screenshot, browser, playwright, ui testing, headless, parallel.
allowed-tools: Bash
---

# Browser QA

## Purpose

Automate browsers using `playwright-cli` — a token-efficient CLI for Playwright. Headless by default, parallel sessions via `-s=`, screenshots and snapshots save to disk (not context window).

This is the **base skill** that all feature-specific QA skills build on. It provides standard interaction patterns, screenshot conventions, and pre-flight checks.

## Prerequisites

`playwright-cli` must be installed globally:

```bash
npm install -g @playwright/cli@latest
npx playwright install chromium  # one-time browser install
```

## Pre-flight Check

```bash
playwright-cli --version  # verify installed
playwright-cli list       # check for stale sessions
```

If not installed: _"playwright-cli is not installed. Run: `npm install -g @playwright/cli@latest`"_

## Authentication

Uses a persistent browser profile at `~/.playwright-profiles/rankup`. Login was done once in headed mode — all future sessions reuse this profile.

```bash
# Normal usage (already authenticated):
playwright-cli -s=SESSION open URL --profile=/Users/martenkauksi/.playwright-profiles/rankup

# If session expired (re-login needed):
playwright-cli -s=reauth open URL --profile=/Users/martenkauksi/.playwright-profiles/rankup --headed
# Login manually in the browser, then close
```

## Profile Usage

**ALWAYS copy the profile.** Chrome locks profile directories with `SingletonLock` — only ONE Chrome instance can use a directory at a time. Multiple Claude sessions, headed browsers, or parallel agents will all conflict on the shared profile.

Every agent creates its own copy at session start:

```bash
PROFILE_SRC="/Users/martenkauksi/.playwright-profiles/rankup"
PROFILE="/tmp/pw-profile-${SESSION}"
# Archive any existing profile copy first (NEVER rm -rf)
mkdir -p /tmp/_archive-pw-profiles
[ -d "$PROFILE" ] && mv "$PROFILE" "/tmp/_archive-pw-profiles/$(basename $PROFILE)-$(date +%s)" 2>/dev/null
cp -r "$PROFILE_SRC" "$PROFILE"
playwright-cli -s=$SESSION open URL --profile=$PROFILE
```

Auth cookies/localStorage are in the profile — copies inherit login state. Each Chrome instance gets its own `SingletonLock` in its own directory. No conflicts.

**Cleanup:** After session completes, archive the copy:
```bash
mkdir -p /tmp/_archive-pw-profiles
mv "$PROFILE" /tmp/_archive-pw-profiles/ 2>/dev/null
```

**NEVER use `rm -rf`** — blocked by security hooks. Always `mv` to archive.
**NEVER use the shared profile directly** — always copy first.

## Session Management

**Always use a named session.** Derive a short kebab-case name from the task:

```bash
# Per-story sessions for QA:
playwright-cli -s=story-02 open URL --profile=...
playwright-cli -s=story-08a open URL --profile=...

# Cleanup — ALWAYS scope to YOUR sessions:
playwright-cli -s=story-02 close     # close specific session
playwright-cli list                   # list active sessions

# NEVER use these — they kill ALL sessions including other parallel agents:
#   playwright-cli close-all          # DANGEROUS: closes every session
#   playwright-cli kill-all           # DANGEROUS: kills every process
#   pkill -f "playwright-cli"         # DANGEROUS: kills everything
# Instead, close each session you opened individually by name.
```

## Standard Interaction Patterns

All commands use `playwright-cli -s=SESSION` prefix. Abbreviated as `pcli` below.

### Navigate + Verify

```bash
pcli goto "http://localhost:3000/path"
sleep 3                                    # wait for dynamic content
pcli snapshot                              # get element refs
pcli screenshot --filename=screenshots/step-01.png
```

### Find Elements (Snapshot)

```bash
pcli snapshot                              # prints accessibility tree with refs
pcli snapshot --filename=snap.yml          # save to disk (for large pages)
# Output: button "Start Writing" [ref=e42] [cursor=pointer]
# Use ref (e42) in subsequent commands
```

### Click Element

```bash
pcli snapshot                              # get refs
pcli click e42                             # click by ref
sleep 1
pcli screenshot --filename=screenshots/step-02.png
```

### Fill Form

```bash
pcli snapshot                              # find input ref
pcli fill e15 "search text"               # fill input by ref
pcli press Enter                           # submit
```

### Keyboard

```bash
pcli press Escape                          # single key
pcli press ArrowRight                      # arrow keys
pcli type "hello world"                    # type text into focused element
```

### Wait for Dynamic Content

```bash
# After action that triggers async update:
sleep 3
pcli snapshot                              # check for expected elements
# If not found: sleep 3 more, snapshot again (max 3 retries)
```

### Scroll

```bash
pcli mousewheel 0 300                      # scroll down
pcli mousewheel 0 -300                     # scroll up
```

### Console & Network

```bash
pcli console                               # read console messages
pcli console error                         # errors only
pcli network                               # list network requests
```

## Screenshots

Screenshots save to **disk files** — zero context window cost.

```bash
# Named screenshot (preferred):
pcli screenshot --filename=screenshots/step-01-page-load.png

# Element screenshot:
pcli screenshot e42 --filename=screenshots/button-detail.png

# Full page:
pcli screenshot --full-page --filename=screenshots/full-page.png
```

### When to Screenshot

- **Always**: after navigation, after clicking buttons, after form submission
- **Always**: when verifying expected state (proof of pass/fail)
- **Always**: on failure (capture the unexpected state)
- **Optional**: intermediate loading states (only if relevant)

### Screenshot Directory Convention

Each story gets its own directory under the task's reports:

```
agent_workspace/tasks/{task}/reports/{story-slug}/
├── step-01-page-load.png
├── step-02-menu-click.png
├── ...
├── recording.webm
└── report.html
```

### Stale Screenshot Cleanup (CRITICAL)

**Before writing ANY screenshots**, archive existing files from previous runs. Old screenshots mixed with new ones produce corrupt galleries and misleading reports.

```bash
# BEFORE each story run, archive any existing screenshots:
ARCHIVE_DIR="{REPORT_DIR}/_archive/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$ARCHIVE_DIR"
mv {REPORT_DIR}/*.png {REPORT_DIR}/*.webm {REPORT_DIR}/report.html "$ARCHIVE_DIR/" 2>/dev/null
# Now write fresh screenshots — directory is clean
```

**NEVER use `rm -f` or `rm -rf`** — these are blocked by security hooks. Always `mv` to archive.

**Orchestrator responsibility:** Include the archive step in the subagent prompt template so every agent cleans its directory before writing.

## Video Recording — Targeted Clips

Record **short clips of animations/transitions only** — NOT the entire session. Full-session recordings are 90% static waiting and waste disk.

**What to record:**
- UI animations (loading spinners, progress bars, phase transitions)
- Modal open/close transitions
- Streaming content appearing
- Any dynamic visual behavior worth reviewing

**What NOT to record:**
- Waiting for pages to load
- Static states (screenshots are enough)
- Form filling, clicking through menus

### How to Record Clips

```bash
# Start clip right BEFORE the interesting action:
pcli video-start
# ... perform the action that triggers animation ...
# ... wait for animation to settle ...
pcli video-stop --filename=reports/{story-slug}/clip-{name}.webm

# Example: record phase progression animation
pcli video-start
pcli click e42  # clicks "Start Writing"
sleep 15        # phases animate in tray
pcli video-stop --filename=reports/{story-slug}/clip-phase-progression.webm
```

### Story YAML `record_segments`

Stories can declare which step ranges to record:

```yaml
record_segments:
  - name: "phase-progression"
    description: "Tray pill animating through 9 phases"
    start_after_step: 5    # After clicking "Start Writing"
    stop_before_step: 9    # Before "completed job screenshot"
  - name: "modal-animation"
    description: "Modal opening with fade-in"
    start_after_step: 10
    stop_before_step: 12
```

If no `record_segments` defined: screenshots only, no video.

### Video Upload to CDN (MANDATORY for galleries)

**NEVER base64-encode video files** — they make gallery HTML unloadable on mobile (10-50MB).

After recording clips, upload to the S3 CDN bucket:

```bash
# Upload all clips to CDN — returns CloudFront URLs
npx tsx scripts/upload-to-cdn.ts \
  --prefix=qa-assets/{gallery-slug} \
  {REPORT_DIR}/*.webm

# Output per file:
# path/clip-name.webm -> https://d9dlroma4vy35.cloudfront.net/qa-assets/{slug}/clip-name.webm
```

The orchestrator (or `/share-gallery` skill) handles this upload step when building the gallery. QA agents write `.webm` files to disk as usual — the CDN upload happens at gallery generation time.

### Directory Convention

```
agent_workspace/tasks/{task}/reports/{story-slug}/
├── step-01-page-load.png
├── step-02-menu-click.png
├── ...
├── clip-phase-progression.webm     # targeted clip (local)
├── clip-modal-animation.webm       # targeted clip (local)
└── report.html                     # HTML report (not .md)
```

Videos are stored locally AND uploaded to CDN. Local copies are for archival. CDN URLs are for gallery embedding.

## Report Format — HTML

Reports are **self-contained HTML files** with Tailwind CDN. Video clips use CDN URLs in `<video>` tags (NOT base64). Screenshots display in a styled step timeline.

The agent writes a `report.html` file using this structure:

```html
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QA: {story name}</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={theme:{extend:{colors:{bg:'#0a0a0f',card:'#12121a',border:'#1e1e2e',pass:'#4ade80',fail:'#f87171'}}}}</script>
</head><body class="bg-bg text-white/80 font-sans min-h-screen">
<div class="max-w-4xl mx-auto px-6 py-10">

  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-2xl font-semibold text-white">{story name}</h1>
      <p class="text-sm text-white/40 mt-1">Simulation: {scenario} | Steps: X/Y | Duration: Xs</p>
    </div>
    <span class="px-3 py-1 rounded-full text-sm font-semibold {bg-pass/15 text-pass | bg-fail/15 text-fail}">
      {PASS | FAIL}
    </span>
  </div>

  <!-- Video Clips (CDN URLs — NEVER base64) -->
  <div class="space-y-4 mb-10">
    <h2 class="text-xs font-semibold text-white/40 uppercase tracking-wider">Recordings</h2>
    <!-- One per clip — use CDN URL from upload-to-cdn.ts output -->
    <div class="rounded-xl overflow-hidden border border-border">
      <video src="https://d9dlroma4vy35.cloudfront.net/qa-assets/{slug}/clip-{name}.webm" controls autoplay loop muted playsinline class="w-full"></video>
      <div class="px-4 py-2 bg-card text-xs text-white/50">{clip description}</div>
    </div>
  </div>

  <!-- Step Timeline -->
  <div class="space-y-6">
    <h2 class="text-xs font-semibold text-white/40 uppercase tracking-wider">Steps</h2>

    <!-- Per step -->
    <div class="rounded-xl border border-border overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 bg-card">
        <span class="text-sm font-medium">{N}. {Step description}</span>
        <span class="text-xs font-semibold {text-pass | text-fail}">{PASS | FAIL}</span>
      </div>
      <img src="step-{NN}-{slug}.png" class="w-full" />
      <p class="px-4 py-3 text-xs text-white/50">{What happened — 1-2 sentences}</p>
    </div>
  </div>

  <!-- Assertions -->
  <div class="mt-10 space-y-2">
    <h2 class="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Assertions</h2>
    <!-- Per assertion -->
    <div class="flex items-center gap-2 text-sm">
      <span class="{text-pass | text-fail}">{checkmark | X}</span>
      <span>{assertion text}</span>
    </div>
  </div>

  <!-- Deviations -->
  <div class="mt-8 text-sm text-white/40">
    <h2 class="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Deviations</h2>
    <p>{deviations or "None"}</p>
  </div>

</div></body></html>
```

### Report Rules

- **Video clips at the top** — first thing someone sees
- **EVERY step gets a screenshot embedded** — no step without an image
- Use **relative paths** from the report location to assets
- On FAIL: capture console errors (`pcli console error`), mark remaining steps SKIPPED, still write full report
- Output is `report.html` (NOT `report.md`)

## Mobile Sharing (MANDATORY when user requests gallery/mobile viewing)

**ALWAYS use `/share-gallery` — NEVER manually run serve+cloudflared.** Manual serve leads to serving wrong directories, stale content from other sessions, and broken URLs.

```
Skill("share-gallery", args="agent_workspace/tasks/{task}/reports/{story-slug}/")
```

This tunnels the report directory (report.html + screenshots + clips) via cloudflared and outputs a clickable URL. Zero context cost.

**URL output rules:**
- Output URLs as plain text — NEVER in code blocks, markdown bold, or brackets
- These formatting styles break mobile link detection

For quick in-chat preview of 1-2 key screenshots, `Read` the PNG directly. For full reports, use `/share-gallery`.

---

## Error Handling

| Situation | Action |
|-----------|--------|
| Element ref not found in snapshot | Re-run `snapshot`, look for alternative ref. After 2 attempts: screenshot + FAIL. |
| Click doesn't produce expected result | Wait 2s, screenshot, check state. If unchanged: report as FAIL. |
| Page doesn't load within 10s | Screenshot current state, report as FAIL with "timeout". |
| Console errors after action | `pcli console error` and include in report. |
| Session becomes unresponsive | `pcli close` for YOUR session, then re-open. NEVER use `kill-all` — it kills other agents' sessions. |

## Red Flags - STOP

| Thought | Reality |
|---------|---------|
| "Let me try different refs" | After 2 snapshot+click attempts, screenshot and report — don't guess. |
| "Let me retry this 5 more times" | After 2 failures at the same step, report as FAIL and move on. |
| "I'll skip the screenshot" | EVERY step needs a screenshot for the report. No exceptions. |

## Sequential vs Parallel Sessions

### Sequential (default, recommended)

Run stories one at a time using the shared profile. Simplest approach, no resource conflicts:

```bash
playwright-cli -s=story-02 open URL --profile=~/.playwright-profiles/rankup
# ... complete story-02 ...
playwright-cli -s=story-02 close
playwright-cli -s=story-03 open URL --profile=~/.playwright-profiles/rankup
```

### Parallel (orchestrator-managed)

Chrome enforces a `SingletonLock` on `--user-data-dir` — only ONE Chrome instance can use a profile directory at a time. For parallel runs, the **orchestrator** copies profiles before spawning agents:

```bash
# Orchestrator creates isolated profile copies:
cp -r ~/.playwright-profiles/rankup /tmp/pw-profile-story-02
cp -r ~/.playwright-profiles/rankup /tmp/pw-profile-story-03

# Each agent uses its own copy:
playwright-cli -s=story-02 open URL --profile=/tmp/pw-profile-story-02
playwright-cli -s=story-03 open URL --profile=/tmp/pw-profile-story-03

# Cleanup after all agents complete (archive, NEVER rm -rf):
mkdir -p /tmp/_archive-pw-profiles
mv /tmp/pw-profile-story-* /tmp/_archive-pw-profiles/ 2>/dev/null
```

**NEVER use `rm -rf`** — blocked by security hooks. Always `mv` to archive.

**Why copies work:** Auth cookies/localStorage are in the profile — copies inherit login state. Each Chrome instance gets its own `SingletonLock` in its own directory.

**Caution:** Parallel sessions share one Zustand store on localhost — state changes from one session appear in another. This is a testing artifact, not a bug.

## Live Observation (Optional)

```bash
# Open headed to watch:
playwright-cli -s=SESSION open URL --profile=... --headed

# Dashboard for all sessions:
playwright-cli show
```

## Continuous Skill Evolution

- **Snapshot ref pattern fails?** → Document the WORKING ref pattern in the feature skill
- **Timing assumption wrong?** → Update wait durations immediately
- **New interaction pattern needed?** → Add to "Standard Interaction Patterns" above
