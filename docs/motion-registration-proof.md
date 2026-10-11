# Motion direction: Registration proof

A printed proof is brought into register. The red signal is the registration
plate: a second impression that starts slightly off the ink and is locked on
by a rule that reads the page in order. Every motion on the site is a variation
of that one idea (plate slip, crop marks, a rule that enters left and leaves
right), so it reads as an instrument, not a set of effects.

## Pieces

| Where | What happens | Driven by |
| --- | --- | --- |
| Hero headline | A red plate, drawn per glyph on an `aria-hidden` canvas from the live H1 layout, starts out of register (offset, rotated, stretched). A signal rule sweeps each baseline in turn; the plate locks as it passes, with a damped overshoot. A short red tick stays at each baseline in the margin. The H1 stays one plain text node and is readable throughout. | Load |
| Hero hand-off | After the headline locks, the signal travels the rule above the capability list, the lead paragraph settles its own plate, and the "↓" nods once. | Load (CSS) |
| Hero pointer | The pointer is the fixed point of the plate. Speed makes the plate stretch and rotate about the cursor; it springs back into register when the pointer rests. A hairline crosshair with graduations fades in near the cursor and out after ~1.6 s idle. Influence fades with distance from the headline. | Fine pointer |
| Hero touch / focus / no hover | A tap gives the same pulse. Keyboard focus entering the hero runs one pointer pass across the headline. Devices without a fine pointer get one automatic pass after the entrance. | Touch, focus, media query |
| Flagship entries | As each entry scrolls in (ordinary scroll, nothing pinned or parallaxed): a signal rule runs the entry's top rule, the numeral is typeset up, the title's plate settles, and four crop marks close onto the architecture diagram. | IntersectionObserver |
| Architecture diagrams | Never moved or covered. Hover widens the crop marks and shows graduations in the margin that follow the pointer. Keyboard focus keeps the 3 px outline and centres the graduations. | Pointer, focus |
| Nav and links | Crop marks close around nav and text links; contact rows are ruled by the signal (enters left, exits right). Pseudo-elements only, so hit targets never move. | Hover, focus-visible |

## Rules it follows

- Resting CSS is the finished composition. Hidden or displaced starting states
  are keyed to `html[data-motion="on"]`, set by the script after it initialises.
  Without JS, nothing is hidden.
- The script adds no DOM nodes to React-owned trees. It sets attributes and
  draws on an SSR'd canvas. The reviewed GitHub Pages output strips React
  hydration; Cloudflare hydration still requires browser QA before release.
- `prefers-reduced-motion: reduce` is read before setup and on change. The
  static version keeps the margin ticks, link marks and finished states; no
  entrance, pointer physics, pending states or auto pass.
- No endless loops. The frame loop runs only while something is moving, and
  stops when the hero is offscreen or the tab is hidden. Observers, listeners
  and frames are released on stop.
- Project entrances run once; pointer/focus feedback can recur, with no idle loop.

## Codex review corrections

- Register each cleanup as setup completes; a later failure releases the earlier
  enhancements. Guard asynchronous hero layout and frame callbacks so errors
  leave the original static page visible.
- Release frames, timers, preference subscriptions and observers on page exit;
  a back-forward cache restoration does not replay the entrance.
- Bound crop-mark travel by the actual page gutter. The desktop movement is
  retained without invisible pending marks causing mobile horizontal overflow.
- Shorten the automatic no-hover pass to 800 ms after a 200 ms pause, so the
  mobile entrance resolves promptly instead of running a second long sequence.

## Files

- `components/home-page.tsx`: hero title wrapper and canvas, `RegistrationMarks`, script tag.
- `app/globals.css`: motion language block before the reduced-motion block.
- `public/motion/portfolio-motion.js`: the optional enhancement (no dependencies).
- `scripts/prepare-github-pages.mjs`: keeps only this exact script in the static export.
- `tests/motion.test.mjs`, `tests/prepare-github-pages.test.mjs`: contracts.
