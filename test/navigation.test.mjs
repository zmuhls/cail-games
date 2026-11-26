import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
import { games } from '../src/games.js';
const request = (path, init) => new Request('https://cail-games.ailab-452.workers.dev' + path, init);

test('launches keep saved work and deep paths at their app origin', async () => {
  const response = await worker.fetch(request('/cadavre/play/?work=saved-poem'), {});
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), 'https://cadavre.ailab-452.workers.dev/play/?work=saved-poem');
  const crafted = await worker.fetch(request('/cloze//untrusted.example/?next=https://untrusted.example'), {});
  assert.equal(new URL(crafted.headers.get('location')).origin, 'https://cloze.ailab-452.workers.dev');
});

test('launch routes refuse mutation and never forward a request body', async () => {
  const response = await worker.fetch(request('/jeopardy/', {method:'POST',body:'do not forward'}), {});
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('location'), null);
});

test('health reports an isolated game outage and still checks the other games', async () => {
  const env = {RELEASE:'release'};
  env.CADAVRE = {fetch:async () => Response.json({ok:true,release:'poem'})};
  env.JEOPARDY = {fetch:async () => {throw new Error('offline');}};
  env.CLOZE = {fetch:async () => Response.json({ok:true,release:'reading'})};
  env.CLI_ADVENTURES = {fetch:async () => Response.json({ok:true,release:'terminal'})};
  env.CHESS_LM = {fetch:async req => {
    assert.equal(req.url,'https://chess-lm.ailab-452.workers.dev/health');
    return Response.json({ok:true,release:'chess'});
  }};
  const response = await worker.fetch(request('/health'), env);
  const data = await response.json();
  assert.equal(response.status, 503);
  assert.equal(data.ok, false);
  assert.deepEqual(data.games.cloze, {ok:true,release:'reading'});
  assert.deepEqual(data.games['cli-adventures'], {ok:true,release:'terminal'});
  assert.deepEqual(data.games['chess-lm'], {ok:true,release:'chess'});
  assert.deepEqual(data.games.jeopardy, {ok:false,release:null});
});

test('every catalog page renders first and Play launches its verified destination', async () => {
  const served = [];
  const env = {ASSETS:{fetch:async req => {served.push(new URL(req.url).pathname);return new Response('Project page');}}};
  for (const {id,play} of games) {
    const detail = await worker.fetch(request('/'+id+'/'), env);
    assert.equal(detail.status,200);
    assert.equal(detail.headers.get('location'),null);
    const launch = await worker.fetch(request('/play/'+id+'/'), env);
    assert.equal(launch.status,302);
    assert.equal(launch.headers.get('location'),play);
  }
  assert.equal(served.length,games.length);
  const haggle = await worker.fetch(request('/play/haggle/'), env);
  assert.equal(haggle.headers.get('location'),'https://zweibel.net/haggle/');
  const languages = await worker.fetch(request('/play/langames/?id=lesson'), env);
  assert.equal(languages.headers.get('location'),'https://stefanomorello.com/langames/?id=lesson');
  const terminal = await worker.fetch(request('/play/cli-adventures/?lesson=files'), env);
  assert.equal(terminal.headers.get('location'),'https://cli-adventures.ailab-452.workers.dev/?lesson=files');
  const chess = await worker.fetch(request('/play/chess-lm/?lesson=endgame'), env);
  assert.equal(chess.headers.get('location'),'https://chess-lm.ailab-452.workers.dev/?lesson=endgame');
});

test('the old worker preserves page paths and saved-work queries on the canonical domain', async () => {
  const response = await worker.fetch(request('/cadavre/play/?work=saved-poem'), {LEGACY_REDIRECT:'true'});
  assert.equal(response.status,308);
  assert.equal(response.headers.get('location'),'https://games.ailab-452.workers.dev/cadavre/play/?work=saved-poem');
});

test('the Tools mount serves the same pages, launches and redirects under /games', async () => {
  const served = [];
  const env = {ASSETS:{fetch:async req => {
    const {pathname} = new URL(req.url); served.push(pathname);
    return pathname === '/cadavre' ? new Response(null,{status:307,headers:{location:'/cadavre/'}}) : new Response('Arcade');
  }}};
  const tools = path => new Request('https://tools.ailab.gc.cuny.edu' + path);
  for (const path of ['/games', '/games/', '/games/cadavre/', '/games/assets/arcade.js']) assert.equal((await worker.fetch(tools(path), env)).status, 200);
  assert.deepEqual(served, ['/', '/', '/cadavre/', '/assets/arcade.js']);
  const slash = await worker.fetch(tools('/games/cadavre'), env);
  assert.equal(slash.headers.get('location'), '/games/cadavre/');
  const launch = await worker.fetch(tools('/games/play/chess-lm/?lesson=endgame'), env);
  assert.equal(launch.headers.get('location'), 'https://chess-lm.ailab-452.workers.dev/?lesson=endgame');
  const saved = await worker.fetch(tools('/games/cadavre/play/?work=saved-poem'), env);
  assert.equal(saved.headers.get('location'), 'https://cadavre.ailab-452.workers.dev/play/?work=saved-poem');
  const work = await worker.fetch(tools('/games/my-work/'), env);
  assert.equal(work.headers.get('location'), 'https://tools.ailab.gc.cuny.edu/my-work/');
  assert.equal((await worker.fetch(new Request('https://tools.ailab.gc.cuny.edu/gamesroom'), env)).status, 200);
  assert.equal(served.at(-1), '/gamesroom');
});

test('with a canonical origin set, every other address moves to the Tools mount', async () => {
  const env = {CANONICAL_ORIGIN:'https://tools.ailab.gc.cuny.edu', ASSETS:{fetch:async () => new Response('Arcade')}};
  const moved = async url => { const r = await worker.fetch(new Request(url), env); return [r.status, r.headers.get('location')]; };
  assert.deepEqual(await moved('https://games.ailab-452.workers.dev/'), [308, 'https://tools.ailab.gc.cuny.edu/games/']);
  assert.deepEqual(await moved('https://games.ailab-452.workers.dev/cadavre/play/?work=saved-poem'), [308, 'https://tools.ailab.gc.cuny.edu/games/cadavre/play/?work=saved-poem']);
  assert.deepEqual(await moved('https://games.ailab-452.workers.dev/games/chess-lm/'), [308, 'https://tools.ailab.gc.cuny.edu/games/chess-lm/']);
  assert.deepEqual(await moved('https://tools.ailab.gc.cuny.edu/games/chess-lm/'), [200, null]);
});

test('built pages link only inside the Tools mount', async () => {
  const {readFile} = await import('node:fs/promises');
  for (const page of ['dist/index.html', 'dist/cadavre/index.html']) {
    const local = [...(await readFile(page,'utf8')).matchAll(/(?:href|src)="(\/[^"]*)"/g)].map(match => match[1]);
    assert.ok(local.length > 5);
    assert.deepEqual(local.filter(path => !path.startsWith('/games/')), []);
  }
});
