# dev-orthoboost

Client design previews, served via GitHub Pages at `https://dev-orthoboost.github.io/`.

One folder per client, one subfolder per concept — each concept is a self-contained static site. Every site supports a light and a dark version via the `?theme=` URL param (no param = its designed default), so each mode is its own shareable link. The client folder's `index.html` is the selector page with Dark/Light links per concept; the repo root lists client spaces.

## Downtown Orthodontics — [/downtown-orthodontics/](https://dev-orthoboost.github.io/downtown-orthodontics/)

| Link | Concept | Default |
| --- | --- | --- |
| [/downtown-orthodontics/concept-a/](https://dev-orthoboost.github.io/downtown-orthodontics/concept-a/) | Concept A (editorial one-pager) | dark · [light](https://dev-orthoboost.github.io/downtown-orthodontics/concept-a/?theme=light) |
| [/downtown-orthodontics/concept-b/](https://dev-orthoboost.github.io/downtown-orthodontics/concept-b/) | Concept B (pale blue, rounded) | light · [dark](https://dev-orthoboost.github.io/downtown-orthodontics/concept-b/?theme=dark) |
| [/downtown-orthodontics/concept-c/](https://dev-orthoboost.github.io/downtown-orthodontics/concept-c/) | Concept C (Swiss editorial) | dark · [light](https://dev-orthoboost.github.io/downtown-orthodontics/concept-c/?theme=light) |

To add a new client: create `<client-slug>/` with a selector `index.html` and one `concept-*/` folder per mockup (each with its own `index.html` + assets), then add the client to the root `index.html` and this README.
