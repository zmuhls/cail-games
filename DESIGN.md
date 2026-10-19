# Arcade design specification

The October 17 revision sets the production design:

- Charcoal background with a fine 24px grid, larger 120px cross grid, and small cross marks
- Seven equal minimal cards, each with a single full-card link
- Cyan, violet, pink, amber, lime, blue, and silver light hues appear on interaction and brief, slow attract lights, with visible keyboard focus
- White CAIL logo and restrained Games wordmark
- Lowercase inference arcade title and direct game descriptions
- A quiet CUNY Login in the top right
- Responsive single-column cards on phones; touch targets at least 44px
- Lightweight attract lights on the home page and screenshot galleries on the project pages; no model calls run in the hub

The site links the current deployed games through a common Worker. Cadavre, Jeopardy, and Cloze include a Games link back, with their existing save guards. Haggle and LanGames launch the authors' existing installations. Chess / LM launches its own Cloudflare Worker and uses a restrained silver accent that follows its monochrome board.

## Assets and provenance

`public/assets/cail-logo-white.png` is the unchanged CUNY AI Lab logo downloaded from Google Drive: https://drive.google.com/file/d/1MJSOzGUjVFxjn3J3VnTfSBZDbPCN-cOl/view

Size: 10,337 bytes. SHA-256: `4d868d8174b9ef63d1e436f8e1f6f02a63bab56539c2de5f9bbdc6e785c9580f`.

IBM Plex Mono and IBM Plex Sans are reused from the existing Inference Arcade's local web assets. They are SIL Open Font License fonts from https://github.com/IBM/plex. Font licenses are in `public/assets/fonts/OFL.txt`.

The grid and control effects are native CSS, as the user requested. They are not generated imagery or simulated gameplay.

Project pages use a two-column identity and description layout, stacked on phones. Barlow and Barlow Condensed match the hosted games. CUNY Login shares the hosted games’ transparent wine-red outline, Barlow text, 2px corners, and 46px desktop / 44px phone touch targets. The footer reads “Critical play with, through, and against AI”.

The shared control rules in `public/assets/suite-navigation.css` also style Play and Pause/Continue through `.suite-control`. One set of size, padding, radius, and focus tokens keeps these controls aligned; only navigation uses wine red. Gallery controls have transparent backgrounds and a fixed minimum width to prevent movement when their label changes. A shared page gutter aligns the header, content, and footer; tablet cards use two columns and project text stacks before its columns become cramped.

Each project page includes three unchanged screenshots captured from the game. Sources, capture times, sample-lesson attribution, and any local-preview status are recorded in `public/previews/captures.json`. The gallery rotates every six seconds while visible, provides only a Pause/Continue control and no visible slide counts or captions, and starts paused for reduced-motion preferences. Keyboard focus, hovering, and page visibility also suspend rotation. Full-size images are available by following each preview.

The running gallery prepares only its next image, and waits for decoding before revealing it. Slow or unavailable images leave the current screenshot in place; pausing or leaving the gallery cancels a pending transition. This avoids empty frames without loading every hidden image on page entry.

The cards flash in a freshly shuffled order: 250ms pulses with three seconds between starts and five seconds of darkness after the last pulse. Every fifteen seconds, a short wave expands and contracts each title letter in card-color order. These effects stop for reduced motion, hidden tabs, or an offscreen game grid.
