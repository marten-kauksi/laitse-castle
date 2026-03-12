---
name: share-gallery
description: "Serve a visual gallery (screenshots, prototypes, reports) via cloudflared for mobile viewing. Creates self-contained HTML with base64 images, serves locally on a random port, tunnels via cloudflared, outputs clickable URL. No confirmation page. Use as final step in any visual workflow. Triggers: 'share', 'gallery', 'mobile', 'show on phone'."
argument-hint: <directory with images or HTML report>
tools: [Read, Write, Bash, Glob]
user-invocable: true
---

# Share Gallery

Serve visual outputs (screenshots, prototypes, HTML reports) via Cloudflare tunnel so they're viewable on mobile or any device. No interstitial/confirmation page — loads directly.

## When to Use

- End of any visual workflow (design-prototype, browser-qa, visual-creation, ux-sprint, bug-sprint)
- User is reviewing on mobile / not at the computer
- User asks to "show me", "share", "send link", "view on phone"

## When NOT to Use

- User is at the computer and can open files directly
- Single image that can be shown via `Read` in chat (~80K tokens, acceptable for 1-2 images)

## How It Works

```
1. Collect images/HTML from a directory
2. Upload video files (.webm, .mp4) to S3 CDN — NEVER base64 encode videos
3. Generate self-contained HTML gallery (images as base64, videos as CDN URLs)
4. Pick a RANDOM port (5550-5699) to avoid colliding with other sessions
5. Serve via `npx serve` on that port
6. Tunnel via `cloudflared tunnel` (no interstitial page)
7. Save PIDs to session-specific file for cleanup
8. Output plain URL in chat (no markdown formatting — bold breaks links)
```

## Usage

### Standalone

```
/share-gallery agent_workspace/tasks/{task}/screenshots/
/share-gallery agent_workspace/tasks/{task}/reports/{story}/
/share-gallery agent_workspace/tasks/{task}/prototypes/
```

### As Final Step in Other Workflows

Called automatically or manually after visual workflows complete.

## Step 1: Collect Assets

Scan the provided directory for visual assets:

```bash
# Find images and HTML files
find {directory} -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.webp" -o -name "*.html" -o -name "*.webm" \) | sort
```

## Step 1.5: Upload Videos to CDN

**NEVER base64-encode video files** — they're too large (5-50MB) and make the gallery HTML unloadable on mobile.

Upload all `.webm` and `.mp4` files to the S3 CDN bucket using the upload script:

```bash
# Upload all videos in the directory to CDN
# --prefix should be unique per gallery (e.g., qa-assets/{task-slug})
npx tsx scripts/upload-to-cdn.ts \
  --prefix=qa-assets/{gallery-slug} \
  {directory}/*.webm {directory}/*.mp4 2>/dev/null

# Output: one line per file
# path/clip-name.webm -> https://d9dlroma4vy35.cloudfront.net/qa-assets/{slug}/clip-name.webm
```

**Capture the CDN URLs** from the output — you'll embed these in the gallery HTML `<video>` tags.

| File Type | Embedding Method | Why |
|-----------|-----------------|-----|
| `.png`, `.jpg`, `.webp` | base64 in `<img>` | Small (50-500KB each), works offline |
| `.webm`, `.mp4` | CDN URL in `<video>` | Large (5-50MB), base64 kills mobile loading |
| `.html` | Skip (gallery replaces it) | Gallery is the HTML |

## Step 2: Generate Self-Contained Gallery HTML

**Generate a single `index.html` with images as base64 and videos as CDN URLs.**

**Rules:**
- ONE continuous-scroll page, no links to other pages
- ALL images embedded as `data:image/png;base64,...`
- ALL videos embedded as `<video src="https://d9dlroma4vy35.cloudfront.net/...">` — CDN URLs from Step 1.5
- If directory has subdirectories (e.g., `story-01/`, `story-02/`), render ALL of them in sections on one page
- Use `loading="lazy"` on images to avoid blocking initial render
- Sticky section headers so user knows which section they're in while scrolling

**For multi-directory layouts** (e.g., QA reports with `story-01/`, `story-02/`):

```python
# Python script pattern — generates flat continuous-scroll gallery
import os, base64, glob, subprocess
from pathlib import Path

directory = "..."
gallery_slug = "mobile-v8"  # unique per gallery

# Step 1: Upload videos to CDN
webms = sorted(glob.glob(f'{directory}/*.webm') + glob.glob(f'{directory}/*.mp4'))
cdn_urls = {}
if webms:
    result = subprocess.run(
        ['npx', 'tsx', 'scripts/upload-to-cdn.ts', f'--prefix=qa-assets/{gallery_slug}'] + webms,
        capture_output=True, text=True
    )
    for line in result.stdout.strip().split('\n'):
        if ' -> ' in line:
            local, url = line.split(' -> ', 1)
            cdn_urls[Path(local).name] = url

# Step 2: Build gallery with base64 images + CDN video URLs
pngs = sorted(glob.glob(f'{directory}/*.png'))
# ... generate HTML with base64 images and cdn_urls for videos
```

**For flat directories** (just images, no subdirs):

All images in a single section, sorted by filename.

**Template structure:**

```html
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{gallery title}</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={theme:{extend:{colors:{bg:'#0a0a0f',card:'#12121a',border:'#1e1e2e',pass:'#4ade80',fail:'#f87171'}}}}</script>
</head><body class="bg-bg text-white/80 font-sans min-h-screen">
<div class="max-w-4xl mx-auto px-6 py-10">
<h1 class="text-2xl font-semibold text-white mb-1">{title}</h1>
<p class="text-sm text-white/40 mb-8">{date} | {summary}</p>

<!-- Video Recordings (CDN URLs — NOT base64) -->
<div class="mb-16">
  <div class="flex items-center justify-between mb-4 sticky top-0 bg-bg/95 backdrop-blur py-2 z-10">
    <h2 class="text-lg font-semibold text-white">Recordings</h2>
    <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-pass/15 text-pass">{N} clips</span>
  </div>
  <div class="space-y-4">
    <div class="rounded-xl overflow-hidden border border-border">
      <video src="https://d9dlroma4vy35.cloudfront.net/qa-assets/{slug}/{clip}.webm" controls autoplay loop muted playsinline class="w-full"></video>
      <div class="px-4 py-2 bg-card text-xs text-white/50">{clip description}</div>
    </div>
  </div>
</div>

<!-- Screenshots (base64 images) -->
<div class="mb-16">
  <div class="flex items-center justify-between mb-4 sticky top-0 bg-bg/95 backdrop-blur py-2 z-10">
    <h2 class="text-lg font-semibold text-white">{section title}</h2>
    <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-pass/15 text-pass">{status}</span>
  </div>
  <!-- Per image -->
  <div class="mb-4 rounded-xl border border-border overflow-hidden">
    <div class="px-3 py-2 bg-card text-xs text-white/50">{image label}</div>
    <img src="data:image/png;base64,{b64}" class="w-full" loading="lazy" />
  </div>
</div>

</div></body></html>
```

## Step 3: Serve & Tunnel (Session-Safe)

**CRITICAL: Never kill processes you didn't create.** Multiple sessions run in parallel. Each session uses its own random port and tracks its own PIDs.

```bash
# Pick a random port to avoid colliding with other sessions
PORT=$((5550 + RANDOM % 150))

# Check if port is free, retry if not
while lsof -ti:$PORT > /dev/null 2>&1; do
  PORT=$((5550 + RANDOM % 150))
done

# Session-specific PID file (use $$ for this shell's PID as session key)
PID_FILE="/tmp/share-gallery-$$.pids"

# Serve the directory
npx serve {directory} -p $PORT -s > /dev/null 2>&1 &
SERVE_PID=$!
echo "serve:$SERVE_PID" > "$PID_FILE"
sleep 2

# Tunnel via cloudflared
cloudflared tunnel --url http://localhost:$PORT --logfile /tmp/cloudflared-$PORT.log > /dev/null 2>&1 &
TUNNEL_PID=$!
echo "tunnel:$TUNNEL_PID" >> "$PID_FILE"
sleep 5

# Get URL from log
grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cloudflared-$PORT.log | head -1

# Report what we created (for debugging)
echo "[share-gallery] Serve PID=$SERVE_PID on port $PORT, Tunnel PID=$TUNNEL_PID"
echo "[share-gallery] PID file: $PID_FILE"
```

## Step 4: Output URL

Output the URL as plain text. NO markdown formatting (bold, brackets, etc. break mobile link detection):

```
Gallery is live:

https://xxxx-xxxx-xxxx.trycloudflare.com

Open on any device. Loads directly — no confirmation page.

To stop: I'll kill the server when you're done.
```

## Anti-Patterns — NEVER Do These

| Don't | Do Instead |
|-------|------------|
| `lsof -ti:5555 \| xargs kill -9` | Pick a random free port, only kill YOUR PIDs |
| `pkill -f "cloudflared tunnel"` | Kill only the PID you started — other sessions have their own tunnels |
| `pkill -f "npx serve"` or `pkill -f serve` | Kill only your SERVE_PID, not other sessions' servers |
| Kill anything on a hardcoded port | Random port + PID tracking |
| Manually run `python3 -m http.server` or `npx serve` + tunnel | Always invoke `/share-gallery` skill — it handles everything |
| Reuse an existing serve/tunnel process from a previous session | Create new ones — don't touch existing processes |
| Output URL in a code block (`\`https://...\``) | Plain text only — code blocks break mobile link detection |
| Output URL in markdown bold or brackets | Plain text only — `**url**` and `[text](url)` break on mobile |
| Serve a directory with relative-path HTML | Generate self-contained HTML with base64 images first |
| Use ngrok | Use cloudflared — no interstitial confirmation page |
| Base64-encode video files (.webm, .mp4) | Upload to CDN via `scripts/upload-to-cdn.ts`, embed CDN URL in `<video>` |
| Embed videos as `data:video/webm;base64,...` | CDN URLs — base64 video = 10-50MB HTML, unloadable on mobile |

## Cleanup

When the user is done reviewing, or at session end — **kill only YOUR processes**:

```bash
# Read PIDs from this session's PID file
PID_FILE="/tmp/share-gallery-$$.pids"
if [ -f "$PID_FILE" ]; then
  while IFS=: read -r type pid; do
    kill $pid 2>/dev/null
  done < "$PID_FILE"
  rm "$PID_FILE"
fi
```

**NEVER run blanket kills like:**
- `pkill -f cloudflared` — kills OTHER sessions' tunnels
- `lsof -ti:PORT | xargs kill` — kills OTHER sessions' servers
- `pkill -f serve` — kills everything

## Integration with Other Skills

This skill is called as the **final output step** by visual workflows. Each workflow saves assets to disk as usual, then invokes share-gallery to make them viewable remotely.

### Caller Pattern

After a visual workflow completes and has assets on disk:

```
# At end of workflow, if user wants mobile/remote viewing:
Skill("share-gallery", args="{path to directory with images/reports}")
```

### Which Workflows Should Offer This

| Workflow | Asset Directory | Trigger |
|----------|----------------|---------|
| `design-prototype` | `agent_workspace/tasks/{task}/prototypes/` | After prototype screenshots |
| `browser-qa` | `agent_workspace/tasks/{task}/reports/{story}/` | After QA report |
| `visual-creation` | `scripts-tdd/visual-tools/output/` | After gallery generation |
| `ux-sprint/review` | `agent_workspace/tasks/{task}/reports/` | After verification screenshots |
| `bug-sprint/review` | `agent_workspace/tasks/{task}/reports/` | After bug verification |
| `autonomous-content-qa` | `agent_workspace/tasks/{task}/reports/` | After QA run |

## Context Window Cost

Zero additional context cost. All assets stay on disk. Only the URL string goes into chat.

Compare with alternatives:
- `Read` an image: ~80-100K tokens per image
- This skill: ~50 tokens (just the URL)

For quick preview of 1-2 key images, `Read` in chat is fine. For galleries of 3+ images, always use this skill.

## Notes

- Cloudflare tunnel URL is random and temporary — dies when tunnel stops
- Nobody discovers the URL unless you share it
- No account needed — cloudflared quick tunnels work without login
- The HTML page is mobile-responsive (grid collapses to single column)
- Works on any device with a browser
- No interstitial/confirmation page
- Requires `cloudflared` installed: `brew install cloudflared`
- Each session gets its own port + tunnel — safe for parallel sessions
