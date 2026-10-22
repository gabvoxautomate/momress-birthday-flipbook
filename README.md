# Momress — A Birthday Wrapped in Grace

A mobile-first Christian birthday keepsake built with plain HTML, CSS, and JavaScript. The book contains a green hardcover, eight dedication and photo pages, a closing Media Team dedication, animated 3D page turns, page-edge tap and swipe navigation, softly breathing photographs, and optional background music.

## Project files

- `index.html` — the welcome screen, book pages, and audio element
- `css/style.css` — responsive paper, cover, layout, and 3D animation styles
- `js/script.js` — page state, navigation, accessible feedback, and optional audio
- `assets/` — the five supplied family photos and the supplied soundtrack

## Included photographs

The five supplied photographs have been copied into `assets/`:

- `portrait.jpg` — Momress speaking at a lectern
- `family.jpg` — Momress, Shepo, and Moferejesu together
- `couple.jpg` — Momress sharing an affectionate moment with Shepo
- `birthday.jpg` — Momress and Moferejesu at his first birthday
- `faith.jpg` — Momress in a moment of reflection or worship

Every photo fits inside its page without cropping or stretching. The original image dimensions are preserved, and a subtle zoom animation keeps the photos lively. Frames adapt so landscape and portrait pictures both display in full.

## Birthday music

The supplied track is saved as `assets/emotional-piano.mp3`. It starts when the reader taps **Open Your Book**, as browsers require a user interaction before they allow playback. The music button remains available to pause or resume it. Confirm that you have permission to publish this track before deploying the site publicly.

## Preview and deploy

Open `index.html` directly or use VS Code's Live Server extension. No install, build step, backend, or package manager is required. The folder can be deployed to a static host such as GitHub Pages or Vercel.

Before public deployment, confirm that the family photographs and any added music are cleared for public use. The Media Team name and tribute wording can be edited directly in `index.html`.

## Quick checks

- Open the book and confirm it turns from the hardcover to the dedication.
- Turn pages by tapping near either book edge, dragging across the page, using the arrow buttons, or pressing the keyboard left/right keys.
- Confirm page progress updates and controls disable at the beginning and end.
- Test narrow phone sizes and confirm the entire welcome screen and reader fit without scrolling; also test desktop and reduced-motion settings.
- Confirm music starts when the book is opened and can be paused and resumed.
- Check that each photo is fully visible, without cropping, on a phone.
