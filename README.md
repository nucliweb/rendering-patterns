# Rendering Patterns — Live Demos

Live demos for the talk **"Rendering Patterns: What the browser does when nobody's watching"** by [Joan León](https://joanleon.dev).

## Demos

| # | Demo | What it shows |
|---|---|---|
| 01 | [`content-visibility`](./content-visibility/) | 300-product catalog. One CSS property. 7× rendering improvement. |
| 02 | [bfcache](./bfcache/) | The free optimization most SPAs silently break. |
| 03 | [View Transitions](./view-transitions/) | Native app transitions. No libraries. SPA + MPA. |

Each demo has a `/before` and `/after` version. Open DevTools before navigating to see the difference in real metrics.

## Metrics Overlay

Every demo includes a real-time overlay (bottom-right corner) showing:

- **LCP** — Largest Contentful Paint
- **INP** — Interaction to Next Paint
- **CLS** — Cumulative Layout Shift
- **FPS** — Frames per second
- **TTFB** — Time to First Byte

Press **M** or click **hide/show** to toggle the overlay.

## Running locally

No build step. Open any HTML file directly or serve with any static server:

```bash
npx serve .
```

## References

- [3perf.com — Analyzing Notion app performance](https://3perf.com/blog/notion/) — Ivan Akulov
- [web.dev — content-visibility](https://web.dev/articles/content-visibility)
- [web.dev — bfcache](https://web.dev/articles/bfcache)
- [Chrome Developers — View Transitions API](https://developer.chrome.com/docs/web-platform/view-transitions)
- [Speculation Rules API](https://wicg.github.io/nav-speculation)
