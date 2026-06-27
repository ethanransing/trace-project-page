# TRACE — project page

A static, GitHub-hostable academic project page for **TRACE: Interactive Bi-Directional
Cable Tracing Amid Clutter** (Newsreader + DM Sans, OKLch tokens, centered single column).

The page opens with an **auto-looping hero** (a real robot run playing on load) and a
**one-line result hook**, then flows problem → method → results. Motion is *entrance-only*:
a single orchestrated hero reveal on load, then static.

No build step or framework — just `index.html`, `styles.css`, `script.js`, and `media/`.
One CDN dependency, [Motion One](https://motion.dev/), is loaded as an ES module purely to
choreograph the hero reveal; it is progressive enhancement (if it fails to load, a head-script
safety timeout reveals the hero anyway, and every widget keeps working).

## Interactive elements

Each of the paper's headline contributions is demonstrated with a small vanilla-JS widget:

| Section | Interaction | Real assets used |
|---|---|---|
| Hero | The 8-iteration robot run auto-loops on load (pauses off-screen and under reduced-motion → resolved still) | `media/run/iter_0–7` |
| Result hook | Static one-line headline result with inline serif numerals | numbers from the paper |
| The monochrome tracing problem | Toggle raw monochrome scene ↔ recovered traces | `endpoints_detected`, `final_traces` |
| Bi-directional tracing & divergence | 3-step reveal of bi-directional traces → divergence points | `divergence.png` |
| Interactive perception primitives | Density toggle picks Divergence Push vs Cluster Dilation; hover to play the motion | `div_push`, `cluster_dilation` |
| The full perception–action loop | Play / scrub the same robot run with logged action captions | `media/run/iter_0–7` |
| Cable-tracing accuracy | Toggle with/without clutter; animated TRACE-vs-HANDLOOM bars + comparison table | numbers from the paper |
| Geometry vs. frontier VLMs | Side-by-side monochrome input vs VLM hallucination + score badges | `vlm_compare` |

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Serve it over `http://` (not `file://`) so the Motion-One hero reveal loads.

## Publish to GitHub Pages

Repo **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.
The site then serves at `https://<user>.github.io/trace-project-page/`.

## Still placeholder (fill in later)

- **Action links** — the Paper (PDF) and Code hrefs in the `index.html` header are `#`.
- **Per-author homepage links** — the byline names are real; individual homepage links are TODO.

All result numbers, captions, and media are real, sourced from the paper and a logged robot run.
