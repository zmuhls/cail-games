import { games } from '../src/games.js';
// Project pages precede launch; each game keeps its identity and save boundary.
const origins = Object.freeze({
  cadavre: 'https://cadavre.ailab-452.workers.dev',
  jeopardy: 'https://jeopardy.ailab-452.workers.dev',
  cloze: 'https://cloze.ailab-452.workers.dev',
  'cli-adventures': 'https://cli-adventures.ailab-452.workers.dev',
  'chess-lm': 'https://chess-lm.ailab-452.workers.dev',
});
// Doorway serves the arcade at tools.ailab.gc.cuny.edu/games and forwards the full path.
const MOUNT = '/games';
const privateHeaders = { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin' };
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (env.LEGACY_REDIRECT === 'true') {
      const target = new URL('https://games.ailab-452.workers.dev');
      target.pathname = url.pathname; target.search = url.search;
      return new Response(null,{status:308,headers:{...privateHeaders,location:target.href}});
    }
    const mounted = url.pathname === MOUNT || url.pathname.startsWith(MOUNT + '/');
    if (mounted) url.pathname = url.pathname.slice(MOUNT.length) || '/';
    // Once the Tools mount is live, every other address moves there.
    if (env.CANONICAL_ORIGIN && url.pathname !== '/health' && (!mounted || url.origin !== env.CANONICAL_ORIGIN)) {
      const target = new URL(env.CANONICAL_ORIGIN);
      target.pathname = MOUNT + url.pathname; target.search = url.search;
      return new Response(null,{status:308,headers:{...privateHeaders,location:target.href}});
    }
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', {status:405, headers:{...privateHeaders,allow:'GET, HEAD'}});
    if (url.pathname === '/health') {
      const checks = await Promise.all(Object.keys(origins).map(async app => {
        try {
          const response = await env[app.replaceAll('-', '_').toUpperCase()].fetch(new Request(origins[app] + '/health', {signal:AbortSignal.timeout(5000)}));
          const data = await response.json();
          return [app, {ok:response.ok && data.ok === true, release:data.release || null}];
        } catch { return [app, {ok:false,release:null}]; }
      }));
      const games = Object.fromEntries(checks);
      const ok = checks.every(([, game]) => game.ok);
      return Response.json({ok,release:env.RELEASE,games}, {status:ok ? 200 : 503,headers:privateHeaders});
    }
    const launch = url.pathname.match(/^\/play\/([a-z][a-z0-9-]*)\/?$/);
    const match = url.pathname.match(/^\/(cadavre|jeopardy|cloze)(\/.*)?$/);
    const game = launch && games.find(game => game.id === launch[1]);
    // Preserve older deep links and saved-work launch URLs; base routes are project pages.
    const oldLaunch = match && ((match[2] && match[2] !== '/') || url.searchParams.has('work'));
    if (game || oldLaunch) {
      const target = new URL(game ? game.play : origins[match[1]]);
      if (!game) target.pathname = match[2] || '/';
      target.search = url.search;
      return new Response(null, {status:302,headers:{...privateHeaders,location:target.href}});
    }
    if (['/auth/start', '/my-work', '/my-work/'].includes(url.pathname)) {
      return new Response(null, {status:302,headers:{...privateHeaders,location:'https://tools.ailab.gc.cuny.edu/my-work/'}});
    }
    const response = await env.ASSETS.fetch(new Request(url, request));
    const headers = new Headers(response.headers);
    // The asset layer redirects by unmounted path, such as /cadavre to /cadavre/.
    const location = headers.get('location');
    if (location?.startsWith('/') && !location.startsWith('//')) headers.set('location', MOUNT + location);
    headers.set('x-content-type-options','nosniff');
    headers.set('referrer-policy','strict-origin-when-cross-origin');
    headers.set('content-security-policy',"default-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
    return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
  },
};
