# dev-orthoboost

Client design previews, served via GitHub Pages at `https://dev-orthoboost.github.io/`.

One folder per mockup — each folder is a self-contained static site. Every site supports a light and a dark version via the `?theme=` URL param (no param = its designed default), so each mode is its own shareable link. The root `index.html` is the preview selector with Dark/Light links per concept.

| Link | Mockup | Default |
| --- | --- | --- |
| [/downtown-concept-a/](https://dev-orthoboost.github.io/downtown-concept-a/) | Downtown Orthodontics — Concept A (editorial one-pager) | dark · [light](https://dev-orthoboost.github.io/downtown-concept-a/?theme=light) |
| [/downtown-concept-b/](https://dev-orthoboost.github.io/downtown-concept-b/) | Downtown Orthodontics — Concept B (pale blue, rounded) | light · [dark](https://dev-orthoboost.github.io/downtown-concept-b/?theme=dark) |
| [/downtown-concept-c/](https://dev-orthoboost.github.io/downtown-concept-c/) | Downtown Orthodontics — Concept C (Swiss editorial) | dark · [light](https://dev-orthoboost.github.io/downtown-concept-c/?theme=light) |

To add a new preview: drop a folder with an `index.html` (+ its assets) at the repo root, add it to the table above and the root `index.html`, commit, push.
