import { access, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { games } from '../src/games.js';
// Every page link carries the Tools mount; the Worker serves the same paths with or without it.
const BASE = '/games';
const escape = text => text.replace(/[&<>\"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const captures = JSON.parse(await readFile('public/previews/captures.json','utf8'));
const gallery = game => {
  const views = captures.filter(view => view.game === game.id).sort((a,b) => a.view-b.view);
  if (views.length !== 3 || views.some((view,i) => view.view !== i+1)) throw new Error(`Capture three views for ${game.id} before building.`);
  return `<section class="preview-gallery" data-gallery aria-labelledby="preview-title" aria-roledescription="carousel"><div class="preview-heading"><h2 id="preview-title">Gallery</h2><div class="preview-controls" data-controls hidden><button class="suite-control" type="button" data-rotation aria-label="Pause gallery">Pause</button></div></div><div class="preview-stage">${views.map((view,i)=>`<figure data-slide role="group" aria-roledescription="slide" aria-label="${i+1} of 3"${i?' hidden':''}><a href="${BASE}/previews/${game.id}/${view.view}.jpg" aria-label="Open full-size image: ${escape(view.alt)}"><img src="${BASE}/previews/${game.id}/${view.view}.jpg" width="1280" height="720" alt="${escape(view.alt)}" loading="lazy" decoding="async"></a></figure>`).join('')}</div></section>`;
};
for(const capture of captures) await access(`public/previews/${capture.game}/${capture.view}.jpg`);
const shell = (title,content,interactive=false) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#1c1e20"><title>${escape(title)} — CAIL Games</title><link rel="icon" href="${BASE}/assets/cail-logo-white.png"><link rel="stylesheet" href="${BASE}/assets/suite-ui.css"><link rel="stylesheet" href="${BASE}/src/styles.css"><link rel="stylesheet" href="${BASE}/assets/suite-navigation.css">${interactive?'<script src="${BASE}/assets/gallery.js" defer></script>':'<script src="${BASE}/assets/arcade.js" defer></script>'}</head>
<body><a class="skip-link" href="#main">Skip to content</a><div class="grid-background" aria-hidden="true"></div><div class="site-shell"><header class="site-header"><a class="brand" href="${BASE}/" aria-label="CAIL Games home"><img src="${BASE}/assets/cail-logo-white.png" width="1154" height="259" alt="CUNY AI Lab"><span>Games</span></a><nav class="suite-nav-inline suite-nav-dark" aria-label="CUNY account"><a class="suite-nav-button" href="${BASE}/my-work/">CUNY Login</a></nav></header>${content}<footer class="site-footer"><a href="https://ailab.gc.cuny.edu/">CUNY AI Lab</a><span>Critical play with, through, and against AI</span></footer></div></body></html>`;
await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
await cp('public', 'dist', { recursive: true });
await cp('src/styles.css', 'dist/src/styles.css');
const cards = games.map(game => `<a class="game accent-${game.accent}" href="${BASE}/${game.id}/" aria-labelledby="${game.id}-title" aria-describedby="${game.id}-description"><h2 id="${game.id}-title">${escape(game.title)}</h2><p id="${game.id}-description">${escape(game.teaser)}</p><span class="game-action">View game <span class="arrow" aria-hidden="true">→</span></span></a>`).join('');
let letterIndex = 0;
const title = 'inference arcade'.split(' ').map(word => `<span class="title-word" aria-hidden="true">${[...word].map(letter => `<span class="title-letter accent-${games[letterIndex++ % games.length].accent}">${letter}</span>`).join('')}</span>`).join(' ');
await writeFile('dist/index.html',shell('inference arcade',`<main id="main"><section class="intro"><h1 class="arcade-title" aria-label="inference arcade">${title}</h1></section><section class="collection" aria-label="Game collection">${cards}</section></main>`));
for (const game of games) {
  await mkdir(`dist/${game.id}`,{recursive:true});
  await writeFile(`dist/${game.id}/index.html`,shell(game.title,`<main id="main" class="project accent-${game.accent}"><a class="back-link" href="${BASE}/">All games</a><div class="project-grid"><header class="project-identity"><h1>${escape(game.title)}</h1><p class="project-author">By ${escape(game.author)}</p><a class="project-source" href="${game.github}">GitHub <span aria-hidden="true">↗</span></a><a class="launch suite-control" href="${BASE}/play/${game.id}/">Play ${escape(game.title)} <span aria-hidden="true">↗</span></a>${game.note?`<p class="project-note">${escape(game.note)}</p>`:''}</header><div class="project-description">${game.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}${game.credit?`<p class="project-credit">${escape(game.credit)}</p>`:''}</div></div>${gallery(game)}</main>`,true));
}
// Keep the source preview identical to the built catalog.
await writeFile('index.html',await (await import('node:fs/promises')).readFile('dist/index.html','utf8'));
console.log(`Built arcade and ${games.length} project pages`);
