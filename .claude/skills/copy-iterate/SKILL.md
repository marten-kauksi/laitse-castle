---
name: copy-iterate
description: >-
  Fast widget-based iteration on copy — headlines, heroes, CTAs, section copy, any short
  text where the user should pick between variants instead of describing what they want.
  Use when the user says "iterate on this copy", "give me options for this headline",
  "A/B this", "let's punch up this section", or picks apart a line you drafted. Presents
  2-3 genuinely different variants as clickable cards in chat; the user's pick + one-line
  why drives the next round. Complements page-copy (which drafts from scratch); this skill
  is the convergence loop.
---

# /copy-iterate — pick-and-why convergence on copy

One loop, repeated until ship. The user picks between variants and says why in one line;
the why steers the next round. Their exact words are the asset — never paraphrase them.

<!-- methodology source: gtm-team taste arena (predict→reveal→measure), ported 2026-07-09 -->

## Round protocol

1. **Load taste first.** Read `.claude/copy-taste.md` if it exists — accumulated picks +
   whys from past runs. Recent whys outweigh old ones. Also honor this repo's existing copy
   doctrine (copy lenses, page-brief voice) — variants never violate it.

2. **Draft 2–3 GENUINELY different variants** — different angle or structure, never synonym
   swaps. If two variants would get the same one-line description, they're one variant.

3. **Predict privately, before showing.** One line per variant: which will they pick, why.
   Keep it hidden. Because: a prediction written after the pick is a rationalization — and
   tracking hit/miss is how you learn their taste instead of just logging it.

4. **Serve as an in-chat widget** (if a widget tool with a chat-return bridge is available —
   e.g. `show_widget`, call its `read_me` first; otherwise plain-text A/B, same loop, never
   block): variant cards side by side in context (show the copy AS it would sit — a
   headline looks different than a paragraph), click = pick, a REQUIRED one-line "why"
   field, plus a "none of these — redraft" option.

5. **On the pick:** reveal your prediction in one line (hit or miss — if miss, say what you
   misread). Then next round: the picked variant is the baseline (edit, don't rewrite);
   push the new variants further in the direction the why points. Each round: fewer,
   sharper differences.

6. **Ship + log.** When the user says ship, apply the copy. Then append to
   `.claude/copy-taste.md`: date · surface · final copy · every round's pick + why VERBATIM
   · your prediction hits/misses. This file is why round 1 gets smarter every run.

## Rules

- User's exact words in the log — paraphrase launders the taste out.
- Max ~3 rounds before asking whether to ship the best-so-far — convergence, not carousels.
- Variants must respect existing page voice/doctrine; iteration explores WITHIN the brand,
  not around it.
- Batch-friendly: multiple copy targets on one page can run as sequential quick loops in a
  single session.
