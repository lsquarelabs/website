# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Static marketing site for L Square Labs (robotics company), deployed on Vercel. No build step, no package manager, no test suite — plain HTML / CSS / vanilla JS served as-is. Edits to `.html`, `.css`, or `.js` files are the deliverable; just open `index.html` in a browser (or run any static server, e.g. `python3 -m http.server`) to preview.

## Site structure

Each top-level subdirectory is an independently-routable page with its own `index.html`, `styles.css`, `script.js`, and `assets/`:

- `/` — landing page (`index.html`, `styles.css`, `script.js`)
- `/locomotion/` — locomotion research page (Flea, Rumi, Lite3 projects)
- `/manipulation/` — manipulation research page
- `/sim/` — **prebuilt bundle**, not source. Vite-built MuJoCo + ONNX Runtime app that runs an RL policy in-browser. Source lives in a separate repo (`rumi_loco_sim2real`); only the dist output is checked in here. Do not hand-edit `sim/assets/*.js` or `*.wasm`.

The sim's robot model and policy are loaded at runtime:
- `sim/rumi/manifest.json` lists MuJoCo XML + mesh files; `scene.xml` is the entry point.
- `sim/policy/policy.onnx` is the trained RL policy (swapping this is how the sim policy gets updated — see recent commit `Swap sim policy to model_7500`).

## Cross-cutting conventions

- **Absolute paths in subpage HTML.** Subfolder `index.html` files use absolute `/locomotion/...`, `/manipulation/...`, `/sim/...` paths for stylesheets, scripts, and assets so they resolve correctly whether visited as `/locomotion` or `/locomotion/`. The root `index.html` uses relative paths. Preserve this split when editing — don't convert subpages back to relative.
- **Same-tab navigation between site pages, new tab for sim.** Internal page links (locomotion ↔ manipulation ↔ home) open in the same tab. The Live Sim CTA opens in a new tab (`target="_blank"`) because it loads a heavy WASM workload.
- **Font / styling.** All pages use Fira Code from Google Fonts; each page has its own `styles.css` (no shared stylesheet). When adding a feature that appears on multiple pages, duplicate the CSS rather than introducing a shared file — the site has deliberately stayed flat.

## vercel.json — don't simplify

`vercel.json` sets `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` on `/sim` and `/sim/*`. These headers are **required** for the sim to use `SharedArrayBuffer` (needed by MuJoCo WASM threading and the ONNX Runtime worker). Removing them breaks the sim silently in production. Don't add these headers to non-sim routes — they would block third-party embeds (e.g. Google Fonts) elsewhere.

## When updating the sim

The sim source lives outside this repo. To ship a new build:
1. Build in the sim source repo (Vite).
2. Copy the resulting `dist/` contents into `sim/` here, preserving `sim/rumi/` (robot model) and `sim/policy/` (ONNX weights), which are loaded at runtime and may be updated independently.
3. The hashed filenames in `sim/assets/` change every build — `sim/index.html`'s `<script type="module" src="/sim/assets/index-<hash>.js">` reference must match.
