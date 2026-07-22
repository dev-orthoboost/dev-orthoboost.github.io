// Siouxland Orthodontics — Concept 2 (browse-first direction).
// Generates the full flat site into dev-orthoboost/siouxland/concept-2 reusing
// the copy, photos, and logo from the existing siouxland-full build.
import { mkdirSync, writeFileSync, readFileSync, cpSync, copyFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'C:/Users/jules/Desktop/OrthoBoost/dev-orthoboost/siouxland-full';
const OUT = 'C:/Users/jules/Desktop/OrthoBoost/dev-orthoboost/siouxland/concept-2';

mkdirSync(join(OUT, 'assets', 'photos'), { recursive: true });
cpSync(join(SRC, 'assets', 'photos'), join(OUT, 'assets', 'photos'), { recursive: true });
for (const f of ['logo-horizontal.png', 'logo-main.png', 'logo-stacked.png']) {
  copyFileSync(join(SRC, 'assets', f), join(OUT, 'assets', f));
}

/* ---------- content lifted from the source build ---------- */

function liftFaq(file) {
  const html = readFileSync(join(SRC, file), 'utf8');
  const blocks = html.match(/<details>[\s\S]*?<\/details>/g) || [];
  return blocks.join('\n');
}

function liftLegal(file) {
  const html = readFileSync(join(SRC, file), 'utf8');
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '';
  const lede = (html.match(/class="lede"[^>]*>([\s\S]*?)<\/p>/) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '';
  const start = html.indexOf('<div class="legal-body">');
  const end = html.indexOf('</section>', start);
  let body = html.slice(start + '<div class="legal-body">'.length, end);
  body = body.replace(/<\/div>\s*$/g, '').replace(/<\/div>\s*<\/div>\s*$/g, '');
  // strip trailing closing divs left over from wrap containers
  while (/(<\/div>\s*)$/.test(body)) body = body.replace(/<\/div>\s*$/, '');
  return { h1, lede, body };
}

/* ---------- shared bits ---------- */

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Volkhov:ital,wght@0,400;0,700;1,400&family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>',
  braces: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="8" width="5" height="8" rx="1.5"/><rect x="16" y="8" width="5" height="8" rx="1.5"/><path d="M8 12h8"/><path d="M10.5 10.5v3M13.5 10.5v3"/></svg>',
  clearb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4" y="8" width="16" height="8" rx="4" stroke-dasharray="3.5 3"/><path d="M9 12h6"/></svg>',
  aligner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 10c0-3 3.6-5 8-5s8 2 8 5-3.6 5-8 5-8-2-8-5Z"/><path d="M4 14c0 3 3.6 5 8 5s8-2 8-5"/></svg>',
  kid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4.5"/><path d="M9.8 9.2c.5.8 1.3 1.3 2.2 1.3s1.7-.5 2.2-1.3"/><path d="M5 21c.8-3.4 3.6-5.5 7-5.5s6.2 2.1 7 5.5"/></svg>',
  adult: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M4 13h16"/></svg>',
  airway: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 8h9a3 3 0 1 0-3-3"/><path d="M3 12h14a3 3 0 1 1-3 3"/><path d="M3 16h6"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M6 21v-1a6 6 0 0 1 12 0v1"/><path d="M12 14v4"/><path d="M10 16h4"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m8.5 14 -1.5 7 5-2.5 5 2.5-1.5-7"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5.5 16a6.5 6.5 0 0 1 13 0"/><path d="M12 4.5V7M4.6 9.6l1.7 1.7M19.4 9.6l-1.7 1.7M2.5 16h2M19.5 16h2"/><path d="M3 19.5h18"/></svg>',
};

// filled location pin in the office's assigned brand color (matches concept-1 mapping)
const pinFill = (colorVar) =>
  `<svg class="opin" viewBox="0 0 24 24" fill="var(--${colorVar})" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4" fill="#fff"/></svg>`;

const NAV = [
  ['braces.html', 'Braces'],
  ['clear-braces.html', 'Clear braces'],
  ['invisalign.html', 'Invisalign'],
  ['kids-teens.html', 'Kids &amp; teens'],
  ['adults.html', 'Adults'],
  ['airway.html', 'Airway care'],
  ['financing.html', 'Financing'],
  ['about.html', 'About'],
  ['locations.html', 'Locations'],
];

function header(current) {
  const dept = NAV.map(([href, label]) =>
    `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<header>
  <div class="util"><div class="wrap util-in">
    <span class="util-msg"><span class="dot" aria-hidden="true"></span>Accepting new patients<a class="util-tel" href="tel:+17122762766">(712) 276-2766</a></span>
    <nav class="util-links" aria-label="Practice">
      <a href="about.html">About Dr. Williams</a>
      <a href="financing.html">Payment &amp; financing</a>
      <a href="contact.html">Contact</a>
    </nav>
  </div></div>
  <div class="masthead"><div class="wrap mast-in">
    <a class="logo" href="index.html"><img src="assets/logo-horizontal.png" alt="Siouxland Orthodontics"></a>
    <form class="search" id="search" role="search">
      <input type="search" id="q" placeholder="Search treatments, offices &amp; questions" aria-label="Search treatments, offices, and questions">
      <button type="submit" aria-label="Search">${ICONS.search}</button>
    </form>
    <div class="mast-actions">
      <a class="mast-ico" href="locations.html">${ICONS.pin}<span>Offices</span></a>
      <a class="mast-ico" href="tel:+17122762766">${ICONS.phone}<span>Call</span></a>
      <a class="btn btn-coral" href="appointment.html">Free consult</a>
    </div>
  </div></div>
  <nav class="deptnav" aria-label="Care"><div class="wrap dept-in">${dept}</div></nav>
</header>`;
}

const FOOTER = `<section class="prefoot"><div class="wrap prefoot-in">
  <h2>Ready to meet Dr. Williams?</h2>
  <p>Your first consultation is on us. No referral needed, and most insurance is accepted.</p>
  <a class="btn btn-coral" href="appointment.html">Request a free consult</a>
</div></section>
<footer>
  <div class="wrap foot-cols">
    <div class="foot-brand">
      <img src="assets/logo-stacked.png" alt="Siouxland Orthodontics">
      <p>Premium, personal orthodontic care for every smile in Siouxland. You get Dr. Williams, every visit.</p>
    </div>
    <div class="fcol"><h4>Treatments</h4>
      <a href="braces.html">Metal braces</a>
      <a href="clear-braces.html">Clear braces</a>
      <a href="invisalign.html">Invisalign aligners</a>
      <a href="airway.html">Airway-focused care</a>
    </div>
    <div class="fcol"><h4>Ages &amp; stages</h4>
      <a href="kids-teens.html">Kids &amp; teens</a>
      <a href="adults.html">Adults</a>
      <a href="kids-teens.html">Early evaluations</a>
    </div>
    <div class="fcol"><h4>Offices</h4>
      <a href="location-morningside.html">Morningside, Sioux City</a>
      <a href="location-leeds.html">Leeds, Sioux City</a>
      <a href="location-lemars.html">Le Mars, IA</a>
      <a href="location-wayne.html">Wayne, NE</a>
      <a href="locations.html">All locations</a>
    </div>
    <div class="fcol"><h4>Practice</h4>
      <a href="about.html">About Dr. Williams</a>
      <a href="financing.html">Payment &amp; financing</a>
      <a href="appointment.html">Request a free consult</a>
      <a href="financing.html#pay">Make a payment</a>
      <a href="contact.html#refer">Refer a patient</a>
      <a href="contact.html">Contact us</a>
    </div>
  </div>
  <div class="foot-bar"><div class="wrap foot-bar-in">
    <span>&copy; 2026 Siouxland Orthodontics. Dr. Aaron Williams is a Board-eligible orthodontist.</span>
    <span class="foot-legal"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="hipaa.html">HIPAA</a></span>
  </div></div>
</footer>
<script>
(function () {
  var form = document.getElementById('search');
  if (!form) return;
  var routes = [
    [/invis|align|tray/i, 'invisalign.html'],
    [/clear|ceramic/i, 'clear-braces.html'],
    [/airway|breath|sleep|snor/i, 'airway.html'],
    [/kid|child|teen|seven/i, 'kids-teens.html'],
    [/adult|professional/i, 'adults.html'],
    [/pay|financ|insur|cost|price/i, 'financing.html'],
    [/morningside|leeds|le ?mars|wayne|location|office|sioux/i, 'locations.html'],
    [/brace/i, 'braces.html'],
    [/williams|doctor|about|meet/i, 'about.html'],
    [/consult|appoint|book|exam|visit|start/i, 'appointment.html'],
    [/contact|phone|email|question/i, 'contact.html']
  ];
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = (document.getElementById('q').value || '').trim();
    if (!q) return;
    for (var i = 0; i < routes.length; i++) {
      if (routes[i][0].test(q)) { window.location.href = routes[i][1]; return; }
    }
    window.location.href = 'contact.html';
  });
})();
</script>`;

const DEFAULT_DESC = 'Premium, personal orthodontic care for kids, teens, and adults across Siouxland. You get Dr. Williams, every visit.';

function page({ file, title, current, main, bodyClass = '', desc = DEFAULT_DESC }) {
  const sticky = file === 'appointment.html' ? '' : '<a class="sticky-cta" href="appointment.html">Request a free consult</a>';
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="https://dev-orthoboost.github.io/siouxland/concept-2/assets/photos/kids-sunset.jpg">
<link rel="icon" type="image/png" href="assets/logo-main.png">
${FONTS}
<link rel="stylesheet" href="assets/browse.css">
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${header(current)}
<main>
${main}
</main>
${sticky}
${FOOTER}
</body>
</html>`;
  writeFileSync(join(OUT, file), html, 'utf8');
  console.log('wrote', file);
}

/* ---------- css ---------- */

const CSS = `/* Siouxland Orthodontics — Concept 2, browse-first direction.
   Search-led masthead, quick treatment menu, promo cards, and tile grids
   rendered in the Siouxland sunset brand system. */
:root{
  --coral:#F65822; --warm:#FC9C12; --amber:#D53C00; --gold:#FFDC49;
  --green:#415B2F; --scarlet:#A42C42; --purple:#6B3F82; --dusk:#4270AF;
  --black:#121520; --white:#FEFEFE;
  --ink:#1b1e2a; --body:#4a4d5a; --muted:#696c78;
  --cream:#FFF8F1; --cream-2:#FDEFE3; --line:#e8e4de;
  --serif:'Volkhov',Georgia,serif;
  --sans:'Figtree',-apple-system,'Segoe UI',sans-serif;
  --wrap:1280px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:var(--sans);color:var(--body);background:var(--white);font-size:16.5px;line-height:1.6;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:var(--serif);color:var(--ink);margin:0;line-height:1.15;font-weight:700}
h4{margin:0;color:var(--ink)}
p{margin:0}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
:focus-visible{outline:3px solid var(--coral);outline-offset:2px;border-radius:3px}
.wrap{max-width:var(--wrap);margin:0 auto;padding:0 24px}
section{padding:56px 0}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-family:var(--sans);font-weight:700;font-size:15px;border:none;border-radius:6px;padding:13px 24px;cursor:pointer;transition:background .15s,color .15s;white-space:nowrap;text-decoration:none}
.btn-coral{background:var(--coral);color:#fff}
.btn-coral:hover{background:var(--amber)}
.btn-dark{background:var(--black);color:#fff}
.btn-dark:hover{background:var(--coral)}
.btn-gold{background:var(--gold);color:var(--black)}
.btn-gold:hover{background:#fff}
.link-arrow{display:inline-flex;align-items:center;gap:7px;font-weight:700;font-size:14.5px;color:var(--coral)}
.link-arrow svg{width:15px;height:15px}
.link-arrow:hover{color:var(--amber);text-decoration:underline;text-underline-offset:3px}

/* header */
header{position:sticky;top:0;z-index:60;background:var(--white);box-shadow:0 1px 0 var(--line)}
.util{background:var(--cream);border-bottom:1px solid var(--line)}
.util-in{display:flex;justify-content:space-between;align-items:center;height:34px}
.util-links{display:flex;gap:20px}
.util-msg{display:inline-flex;align-items:center;gap:10px;font-size:12.5px;font-weight:700;color:var(--ink)}
.util-msg .dot{width:7px;height:7px;border-radius:50%;background:var(--green);flex:none}
.util a{font-size:12.5px;font-weight:600;color:var(--muted)}
.util a:hover{color:var(--coral)}
.util-tel{font-weight:700 !important;color:var(--ink) !important}
.util-tel:hover{color:var(--coral) !important}
.masthead{padding:14px 0}
.mast-in{display:flex;align-items:center;gap:26px}
.logo img{height:48px;width:auto}
.search{flex:1;max-width:600px;display:flex;align-items:center;background:var(--cream);border:1.5px solid var(--line);border-radius:999px;padding:4px 4px 4px 20px;transition:border-color .15s}
.search:focus-within{border-color:var(--coral);background:#fff}
.search input{flex:1;border:none;background:none;font-family:var(--sans);font-size:15px;color:var(--ink);outline:none;min-width:0}
.search input::placeholder{color:var(--muted)}
.search button{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:none;border-radius:50%;background:var(--coral);color:#fff;cursor:pointer;flex:none}
.search button:hover{background:var(--amber)}
.search button svg{width:17px;height:17px}
.mast-actions{display:flex;align-items:center;gap:18px;margin-left:auto}
.mast-ico{display:flex;flex-direction:column;align-items:center;gap:3px;color:var(--ink);font-size:11.5px;font-weight:600}
.mast-ico svg{width:22px;height:22px}
.mast-ico:hover{color:var(--coral)}
.deptnav{border-top:1px solid var(--line)}
.dept-in{display:flex;gap:26px;overflow-x:auto;scrollbar-width:none}
.dept-in::-webkit-scrollbar{display:none}
.deptnav a{padding:11px 0 9px;font-size:14.5px;font-weight:700;color:var(--ink);border-bottom:3px solid transparent;white-space:nowrap}
.deptnav a:hover{border-bottom-color:var(--black)}
.deptnav a[aria-current="page"]{border-bottom-color:var(--coral);color:var(--coral)}

/* hero — split band: copy panel left, photo right. Nothing overlays the photo,
   so faces stay clear at every viewport. */
.hero{display:grid;grid-template-columns:minmax(400px,2fr) 3fr;align-items:stretch;background:var(--cream);padding:0}
.hero-copy{align-self:center;padding:56px 44px 56px max(24px, calc((100vw - var(--wrap))/2 + 24px));max-width:660px}
.hero-copy h1{font-size:clamp(28px,3vw,42px)}
.hero-copy h1 em{font-style:normal;color:var(--coral)}
.hero-copy p{margin-top:14px;font-size:16.5px;max-width:46ch}
.hero-ctas{display:flex;align-items:center;gap:20px;margin-top:24px;flex-wrap:wrap}
.hero img{width:100%;height:min(560px,62vh);object-fit:cover;object-position:50% 35%}

/* section header row */
.sechead{display:flex;justify-content:space-between;align-items:baseline;gap:18px;margin-bottom:26px}
.sechead h2{font-size:clamp(22px,2.3vw,28px)}
.sechead a{font-size:14.5px;font-weight:700;color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.sechead a:hover{color:var(--coral)}

/* promo trio */
.promos{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.promo{display:flex;flex-direction:column}
.promo .ph{border-radius:6px;overflow:hidden;aspect-ratio:16/10;background:var(--cream-2)}
.promo .ph img{width:100%;height:100%;object-fit:cover;transition:transform .35s}
.promo:hover .ph img{transform:scale(1.04)}
.promo h3{font-size:20px;margin-top:16px}
.promo p{font-size:15px;margin-top:8px}
.promo .link-arrow{margin-top:12px}

/* treatment tiles */
.tiles{display:grid;grid-template-columns:repeat(6,1fr);gap:16px}
.tile{background:var(--cream);border-radius:6px;padding:24px 14px 20px;display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center;font-weight:700;font-size:14.5px;color:var(--ink);transition:transform .15s,box-shadow .15s}
.tile svg{width:42px;height:42px;color:var(--coral)}
.tile:hover{transform:translateY(-3px);box-shadow:0 10px 24px -14px rgba(18,21,32,.35)}

/* membership-style band */
.band{background:var(--green);color:#fff;padding:60px 0}
.band-in{display:grid;grid-template-columns:1fr 1.4fr;gap:48px;align-items:center}
.band h2{color:#fff;font-size:clamp(24px,2.6vw,32px)}
.band .band-sub{margin-top:12px;color:rgba(255,255,255,.85);font-size:16px}
.band .btn{margin-top:22px}
.pillars{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.pillar h3{font-family:var(--sans);font-size:16px;font-weight:800;color:var(--gold)}
.pillar p{margin-top:8px;font-size:14.5px;color:rgba(255,255,255,.85)}

/* kicker cards */
.kicks{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.kick{background:#fff;border:1px solid var(--line);border-radius:6px;padding:26px;display:flex;flex-direction:column}
.kick .kicker{font-size:11.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--coral)}
.kick h3{font-size:20px;margin-top:10px}
.kick p{font-size:15px;margin-top:10px}
.kick .link-arrow{margin-top:auto;padding-top:16px}

/* advice cards */
.advice{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
.adv{display:grid;grid-template-columns:44% 1fr;background:#fff;border:1px solid var(--line);border-radius:6px;overflow:hidden}
.adv img{width:100%;height:100%;object-fit:cover;min-height:200px}
.adv-body{padding:24px;display:flex;flex-direction:column}
.adv h3{font-size:19px}
.adv p{font-size:14.5px;margin-top:10px}
.adv .link-arrow{margin-top:auto;padding-top:14px}

/* value props */
.props{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center}
.prop{display:flex;flex-direction:column;align-items:center;gap:12px}
.prop .ring{width:64px;height:64px;border-radius:50%;background:var(--cream-2);display:flex;align-items:center;justify-content:center;color:var(--coral)}
.prop .ring svg{width:30px;height:30px}
.prop h3{font-family:var(--sans);font-size:16px;font-weight:800}
.prop p{font-size:14px}

/* office cards */
.offices{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.office{background:#fff;border:1px solid var(--line);border-radius:6px;padding:24px;display:flex;flex-direction:column;gap:8px}
.office h3{font-size:19px;display:flex;align-items:center;gap:8px}
.opin{width:18px;height:18px;flex:none}
.office .tag{font-size:14px;color:var(--muted)}
.office .addr{font-size:14.5px;margin-top:4px}
.office .tel{font-weight:700;color:var(--ink);font-size:14.5px}
.office .tel:hover{color:var(--coral)}
.office .link-arrow{margin-top:auto;padding-top:12px}

/* quote strip */
.quote-strip{background:var(--cream);text-align:center}
.quote-strip blockquote{font-family:var(--serif);font-style:italic;font-size:clamp(19px,2.2vw,25px);color:var(--ink);max-width:760px;margin:0 auto;line-height:1.5}
.quote-strip .note{margin-top:14px;font-size:12px;color:var(--muted)}

/* chips */
.chips{display:flex;flex-wrap:wrap;gap:10px}
.chips a{border:1.5px solid var(--line);border-radius:999px;padding:9px 18px;font-size:14px;font-weight:600;color:var(--ink)}
.chips a:hover{border-color:var(--coral);color:var(--coral)}

/* pre-footer + footer */
.prefoot{background:var(--black);color:#fff;text-align:center}
.prefoot h2{color:#fff;font-size:clamp(22px,2.4vw,30px)}
.prefoot p{margin:12px auto 0;color:#c9cad3;max-width:52ch}
.prefoot .btn{margin-top:22px}
footer{background:var(--cream);padding-top:52px}
.foot-cols{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr 1fr;gap:32px;padding-bottom:44px}
.foot-brand img{height:84px;width:auto}
.foot-brand p{margin-top:14px;font-size:14px;max-width:30ch}
.fcol{display:flex;flex-direction:column;gap:9px}
.fcol h4{font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--ink);margin-bottom:4px}
.fcol a{font-size:14.5px;color:var(--body)}
.fcol a:hover{color:var(--coral)}
.foot-bar{background:var(--black);color:#a9abb5;padding:16px 0;font-size:13px}
.foot-bar-in{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}
.foot-legal{display:flex;gap:18px}
.foot-legal a{color:#a9abb5}
.foot-legal a:hover{color:#fff}

/* interior pages */
.crumbs{padding:14px 0 0;font-size:13px;color:var(--muted)}
.crumbs a{color:var(--muted)}
.crumbs a:hover{color:var(--coral)}
.crumbs span{padding:0 7px;color:var(--line)}
.pagehead{padding:30px 0 8px}
.pagehead-in{display:grid;grid-template-columns:1.1fr .9fr;gap:48px;align-items:center}
.pagehead h1{font-size:clamp(30px,3.6vw,44px)}
.pagehead .lede{margin-top:16px;font-size:17.5px;max-width:56ch}
.pagehead .ph{border-radius:6px;overflow:hidden;aspect-ratio:16/10}
.pagehead .ph img{width:100%;height:100%;object-fit:cover}
.pagehead .btn{margin-top:22px}
.split{display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center}
.split .ph{border-radius:6px;overflow:hidden;aspect-ratio:5/4}
.split .ph img{width:100%;height:100%;object-fit:cover}
.split h2{font-size:clamp(22px,2.4vw,28px)}
.split p{margin-top:14px;font-size:15.5px}
.benefits{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.benefit{background:var(--cream);border-radius:6px;padding:20px;display:flex;gap:12px;align-items:flex-start;font-weight:600;font-size:14.5px;color:var(--ink)}
.benefit svg{width:20px;height:20px;color:var(--green);flex:none;margin-top:2px}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.step{background:#fff;border:1px solid var(--line);border-radius:6px;padding:26px}
.step .num{width:38px;height:38px;border-radius:50%;background:var(--coral);color:#fff;font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.step h3{font-size:18px}
.step p{margin-top:8px;font-size:14.5px}
.faq{max-width:820px}
.faq details{border-top:1px solid var(--line)}
.faq details:last-child{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;cursor:pointer;padding:18px 34px 18px 0;font-weight:700;font-size:16px;color:var(--ink);position:relative}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";position:absolute;right:6px;top:50%;transform:translateY(-50%);font-size:22px;font-weight:400;color:var(--coral)}
.faq details[open] summary::after{content:"\\2212"}
.faq details p{padding:0 0 20px;font-size:15px;max-width:64ch}
.callout{background:var(--cream);border-left:4px solid var(--coral);border-radius:0 6px 6px 0;padding:20px 24px;font-size:14.5px;max-width:820px}
.cta-band{background:var(--green);color:#fff;border-radius:6px;padding:40px 44px;display:flex;justify-content:space-between;align-items:center;gap:28px;flex-wrap:wrap}
.cta-band h2{color:#fff;font-size:clamp(21px,2.2vw,27px)}
.cta-band p{color:rgba(255,255,255,.85);margin-top:8px;font-size:15px}
.checklist{display:grid;gap:10px;margin:18px 0 0;padding:0;list-style:none}
.checklist li{display:flex;gap:12px;align-items:flex-start;font-size:15.5px}
.checklist svg{width:19px;height:19px;color:var(--green);flex:none;margin-top:4px}
.prose{max-width:780px}
.prose h2{font-size:22px;margin-top:36px}
.prose h3{font-size:18px;margin-top:26px}
.prose p,.prose li{font-size:15.5px;margin-top:12px}
.prose ul{padding-left:22px;margin:8px 0 0}
.addr-card{background:var(--cream);border-radius:6px;padding:24px;display:flex;flex-direction:column;gap:8px;font-size:15px}
.addr-card h3{font-size:18px;display:flex;align-items:center;gap:8px}
.addr-card .tel{font-weight:700;color:var(--ink)}

/* forms */
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.form-grid .full{grid-column:1/-1}
.field{display:flex;flex-direction:column;gap:6px}
.field label{font-size:13.5px;font-weight:700;color:var(--ink)}
.field input,.field select,.field textarea{font-family:var(--sans);font-size:15px;color:var(--ink);background:#fff;border:1.5px solid var(--line);border-radius:6px;padding:12px 14px}
.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--coral)}
.form-card{background:var(--cream);border-radius:6px;padding:32px}
.form-note{font-size:13px;color:var(--muted);margin-top:14px}

@media (max-width:1080px){
  .tiles{grid-template-columns:repeat(3,1fr)}
  .props,.offices,.benefits{grid-template-columns:repeat(2,1fr)}
  .band-in{grid-template-columns:1fr}
  .foot-cols{grid-template-columns:1fr 1fr;gap:28px}
  .foot-brand{grid-column:1/-1}
}
.sticky-cta{display:none}
@media (max-width:820px){
  section{padding:44px 0}
  body{padding-bottom:52px}
  .sticky-cta{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:70;background:var(--coral);color:#fff;font-weight:700;font-size:15.5px;justify-content:center;padding:15px;text-decoration:none}
  .mast-in{flex-wrap:wrap;gap:14px}
  .search{order:3;flex-basis:100%;max-width:none}
  .util-links{display:none}
  .promos,.kicks,.advice,.steps{grid-template-columns:1fr}
  .adv{grid-template-columns:1fr}
  .adv img{min-height:180px;max-height:220px}
  .pagehead-in,.split{grid-template-columns:1fr}
  .hero{grid-template-columns:1fr}
  .hero img{height:46vh;order:-1}
  .hero-copy{padding:30px 24px 40px;max-width:none}
  .form-grid{grid-template-columns:1fr}
  .cta-band{padding:30px}
}
@media (max-width:560px){
  .tiles{grid-template-columns:repeat(2,1fr)}
  .props,.offices,.benefits{grid-template-columns:1fr}
}
`;

writeFileSync(join(OUT, 'assets', 'browse.css'), CSS, 'utf8');
console.log('wrote assets/browse.css');

/* ---------- reusable page fragments ---------- */

function crumbs(items) {
  const parts = [`<a href="index.html">Home</a>`];
  for (const it of items) {
    parts.push('<span>/</span>');
    parts.push(typeof it === 'string' ? it : `<a href="${it[0]}">${it[1]}</a>`);
  }
  return `<div class="wrap crumbs">${parts.join('')}</div>`;
}

function pagehead(h1, lede, photo, cta) {
  return `<div class="wrap pagehead"><div class="pagehead-in">
  <div><h1>${h1}</h1><p class="lede">${lede}</p>${cta ? `<a class="btn btn-coral" href="appointment.html">${cta}</a>` : ''}</div>
  ${photo ? `<div class="ph"><img src="assets/photos/${photo.src}" alt="${photo.alt}"${photo.pos ? ` style="object-position:${photo.pos}"` : ''}></div>` : ''}
</div></div>`;
}

function steps(intro, list) {
  return `<section><div class="wrap">
  <div class="sechead"><h2>What to expect</h2></div>
  ${intro ? `<p style="margin:-12px 0 24px;max-width:60ch">${intro}</p>` : ''}
  <div class="steps">${list.map((s, i) =>
    `<div class="step"><div class="num">${i + 1}</div><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div>
</div></section>`;
}

function benefits(title, items) {
  return `<section style="padding-top:0"><div class="wrap">
  <div class="sechead"><h2>${title}</h2></div>
  <div class="benefits">${items.map(b => `<div class="benefit">${ICONS.check}<span>${b}</span></div>`).join('')}</div>
</div></section>`;
}

function faqSection(file) {
  const inner = liftFaq(file);
  if (!inner) return '';
  return `<section style="padding-top:0"><div class="wrap">
  <div class="sechead"><h2>Common questions</h2><a href="contact.html">Ask Dr. Williams a question</a></div>
  <div class="faq">${inner}</div>
</div></section>`;
}

const CTA_BAND = `<section style="padding-top:0"><div class="wrap">
  <div class="cta-band">
    <div><h2>You get Dr. Williams. Every visit.</h2>
    <p>One experienced orthodontist who learns your name, remembers your story, and personally guides your treatment from start to finish.</p></div>
    <a class="btn btn-gold" href="appointment.html">Request a free consult</a>
  </div>
</div></section>`;

/* ---------- home ---------- */

page({
  file: 'index.html',
  title: 'Siouxland Orthodontics — Get the Straight, Confident Smile You Deserve',
  current: 'index.html',
  main: `
<section class="hero">
  <div class="hero-copy">
    <h1>Get the Straight, <em>Confident Smile</em> You Deserve.</h1>
    <p>Expert orthodontic care for kids, teens, and adults across Siouxland, guided personally by Dr. Williams from your first visit to your last.</p>
    <div class="hero-ctas">
      <a class="btn btn-coral" href="appointment.html">Request your free consult</a>
      <a class="link-arrow" href="about.html">Meet Dr. Williams ${ICONS.arrow}</a>
    </div>
  </div>
  <img src="assets/photos/kids-sunset.jpg" alt="Five Siouxland kids smiling on an overlook at sunset">
</section>

<section><div class="wrap">
  <div class="sechead"><h2>Care for every age and stage</h2><a href="appointment.html">Request a free consult</a></div>
  <div class="promos">
    <a class="promo" href="kids-teens.html">
      <div class="ph"><img src="assets/photos/family-stories.jpg" alt="A Siouxland family with kids and teens"></div>
      <h3>Kids &amp; teens</h3>
      <p>Gentle, proven care for growing smiles that fits school, sports, and life. Early evaluations around age 7, with no pressure to start.</p>
      <span class="link-arrow">See kids &amp; teens care ${ICONS.arrow}</span>
    </a>
    <a class="promo" href="adults.html">
      <div class="ph"><img src="assets/photos/team-outdoor.jpg" alt="The Siouxland Orthodontics team outdoors"></div>
      <h3>Adults</h3>
      <p>It is never too late. Discreet options like clear braces and Invisalign fit a professional, busy life without slowing it down.</p>
      <span class="link-arrow">See adult care ${ICONS.arrow}</span>
    </a>
    <a class="promo" href="airway.html">
      <div class="ph"><img src="assets/photos/family-airway.jpg" alt="A family together at home"></div>
      <h3>Airway-focused care</h3>
      <p>Attention to how jaw development may support healthy breathing and sleep, explained in plain language at your consult.</p>
      <span class="link-arrow">Learn about airway care ${ICONS.arrow}</span>
    </a>
  </div>
</div></section>

<section style="padding-top:0"><div class="wrap">
  <div class="sechead"><h2>Explore treatments</h2><a href="appointment.html">Not sure? Start with a free consult</a></div>
  <div class="tiles">
    <a class="tile" href="braces.html">${ICONS.braces}<span>Metal braces</span></a>
    <a class="tile" href="clear-braces.html">${ICONS.clearb}<span>Clear braces</span></a>
    <a class="tile" href="invisalign.html">${ICONS.aligner}<span>Invisalign</span></a>
    <a class="tile" href="kids-teens.html">${ICONS.kid}<span>Kids &amp; teens</span></a>
    <a class="tile" href="adults.html">${ICONS.adult}<span>Adults</span></a>
    <a class="tile" href="airway.html">${ICONS.airway}<span>Airway care</span></a>
  </div>
</div></section>

<section class="band"><div class="wrap band-in">
  <div>
    <h2>Your first consultation is on us.</h2>
    <p class="band-sub">No referral needed. Meet Dr. Williams, get a plain-language look at your options, and leave with clear next steps.</p>
    <a class="btn btn-gold" href="appointment.html">Request a free consult</a>
  </div>
  <div class="pillars">
    <div class="pillar"><h3>One doctor</h3><p>You get Dr. Williams personally at every visit, from your first appointment to your last.</p></div>
    <div class="pillar"><h3>Four offices</h3><p>Morningside, Leeds, Le Mars, and Wayne. Care close to home, wherever home is in Siouxland.</p></div>
    <div class="pillar"><h3>Clear plans</h3><p>Insurance help, flexible monthly options, and plain-language answers before you commit.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <div class="sechead"><h2>Ways to start</h2></div>
  <div class="kicks">
    <div class="kick">
      <span class="kicker">Early evaluations</span>
      <h3>A first look around age 7</h3>
      <p>An early check-up lets Dr. Williams watch how the smile is developing. That often means simpler care later, and there is no pressure to start early.</p>
      <a class="link-arrow" href="kids-teens.html">Kids &amp; teens ${ICONS.arrow}</a>
    </div>
    <div class="kick">
      <span class="kicker">Discreet options</span>
      <h3>Straighten without the spotlight</h3>
      <p>Clear braces and Invisalign work quietly through school photos, meetings, and everything in between, with the same dependable results.</p>
      <a class="link-arrow" href="invisalign.html">Compare options ${ICONS.arrow}</a>
    </div>
    <div class="kick">
      <span class="kicker">Payment &amp; financing</span>
      <h3>The money part, made easy</h3>
      <p>Most insurance is accepted, we help you understand your benefits, and flexible monthly options keep the plan comfortable.</p>
      <a class="link-arrow" href="financing.html">See how it works ${ICONS.arrow}</a>
    </div>
  </div>
</div></section>

<section style="padding-top:0"><div class="wrap">
  <div class="sechead"><h2>Advice from Dr. Williams</h2></div>
  <div class="advice">
    <a class="adv" href="airway.html">
      <img src="assets/photos/dr-williams-home.jpg" alt="Dr. Aaron Williams">
      <div class="adv-body">
        <h3>What airway-focused orthodontics means</h3>
        <p>Orthodontics is about more than straight teeth. Dr. Williams looks at how jaw and dental development relate to the airway, an approach designed to support healthy breathing and restful sleep.</p>
        <span class="link-arrow">Read the overview ${ICONS.arrow}</span>
      </div>
    </a>
    <a class="adv" href="appointment.html">
      <img src="assets/photos/hero-team.jpg" alt="The Siouxland Orthodontics team welcoming a patient">
      <div class="adv-body">
        <h3>Your first visit, step by step</h3>
        <p>No pressure, no guesswork. A warm welcome, a relaxed first look, and a plain-language plan. Here is exactly what happens when you come see us.</p>
        <span class="link-arrow">See what to expect ${ICONS.arrow}</span>
      </div>
    </a>
  </div>
</div></section>

<section class="quote-strip"><div class="wrap">
  <blockquote>&ldquo;The team is genuinely kind, and every visit feels personal. We always know exactly what is happening and what comes next.&rdquo;</blockquote>
  <p class="note">Placeholder review for layout only. Replace with a real, consented patient review before publishing.</p>
</div></section>

<section><div class="wrap">
  <div class="sechead"><h2>Why families choose Siouxland</h2></div>
  <div class="props">
    <div class="prop"><div class="ring">${ICONS.doc}</div><h3>One doctor, every visit</h3><p>You get Dr. Williams personally, from your first appointment to your last.</p></div>
    <div class="prop"><div class="ring">${ICONS.badge}</div><h3>Board-eligible orthodontist</h3><p>University of Iowa DDS, University of Colorado specialty training, 10+ years in practice.</p></div>
    <div class="prop"><div class="ring">${ICONS.pin}</div><h3>Four locations</h3><p>Morningside, Leeds, Le Mars, and Wayne. Pick the office closest to home.</p></div>
    <div class="prop"><div class="ring">${ICONS.sun}</div><h3>Continuing 30+ years of care</h3><p>Rooted in Siouxland, carrying three decades of trusted hometown care forward.</p></div>
  </div>
</div></section>

<section style="padding-top:0"><div class="wrap">
  <div class="sechead"><h2>Four locations to choose from</h2><a href="locations.html">See all locations</a></div>
  <div class="offices">
    <div class="office"><h3>${pinFill('purple')}Morningside</h3><span class="tag">Sioux City, IA</span>
      <span class="addr">4224 Sergeant Rd, Sioux City, IA 51106</span>
      <a class="tel" href="tel:+17122762766">(712) 276-2766</a>
      <a class="link-arrow" href="location-morningside.html">Visit this office ${ICONS.arrow}</a></div>
    <div class="office"><h3>${pinFill('green')}Leeds</h3><span class="tag">Sioux City, IA</span>
      <span class="addr">2801 Outer Dr N, Sioux City, IA 51104</span>
      <a class="tel" href="tel:+17122390420">(712) 239-0420</a>
      <a class="link-arrow" href="location-leeds.html">Visit this office ${ICONS.arrow}</a></div>
    <div class="office"><h3>${pinFill('scarlet')}Le Mars</h3><span class="tag">Le Mars, IA</span>
      <span class="addr">405 Plymouth St NW, Le Mars, IA 51031</span>
      <a class="tel" href="tel:+17125465179">(712) 546-5179</a>
      <a class="link-arrow" href="location-lemars.html">Visit this office ${ICONS.arrow}</a></div>
    <div class="office"><h3>${pinFill('dusk')}Wayne</h3><span class="tag">Wayne, NE</span>
      <span class="addr">617 Pearl St Ste #2, Wayne, NE 68787</span>
      <a class="tel" href="tel:+14028331333">(402) 833-1333</a>
      <a class="link-arrow" href="location-wayne.html">Visit this office ${ICONS.arrow}</a></div>
  </div>
</div></section>

<section style="padding-top:0"><div class="wrap">
  <div class="sechead"><h2>Popular pages</h2></div>
  <div class="chips">
    <a href="braces.html">Metal braces</a>
    <a href="clear-braces.html">Clear braces</a>
    <a href="invisalign.html">Invisalign aligners</a>
    <a href="kids-teens.html">Kids &amp; teens</a>
    <a href="adults.html">Adults</a>
    <a href="airway.html">Airway-focused care</a>
    <a href="financing.html">Payment &amp; financing</a>
    <a href="about.html">About Dr. Williams</a>
    <a href="locations.html">Locations</a>
    <a href="appointment.html">Request a free consult</a>
  </div>
</div></section>`
});

/* ---------- treatment + audience pages ---------- */

const TREATMENTS = [
  {
    file: 'braces.html', title: 'Metal Braces — Siouxland Orthodontics', h1: 'Metal braces',
    lede: 'Time-tested, dependable, and a little more comfortable than they used to be. If your child needs braces, or you have been thinking about your own smile, we will walk you through every step.',
    photo: { src: 'kids-sunset.jpg', alt: 'Kids smiling outdoors at sunset' },
    crumb: 'Metal braces',
    aboutTitle: 'What metal braces do',
    about: ['Metal braces are the proven, reliable way to correct crowding, spacing, and bite issues. Small brackets and a gentle wire guide your teeth into place over time, and today&rsquo;s braces are smaller and more comfortable than the ones you might remember.',
      'Dr. Williams places and monitors every case personally, so the plan stays on track and you always know what comes next. Braces work beautifully for kids, teens, and adults alike.'],
    aboutPhoto: { src: 'family-stories.jpg', alt: 'A happy Siouxland family' },
    whoTitle: 'Who metal braces are for',
    who: ['Kids and teens who are ready to start treatment', 'Adults who want a dependable, proven approach', 'Crowding, spacing, and bite issues of most kinds', 'Families who want a straightforward, budget-friendly plan'],
    steps: [['Free consultation', 'We meet, take a look, and answer your questions. Your first consultation is on us, with no pressure to start.'],
      ['Your custom plan', 'Dr. Williams maps out a plan built around your smile, your goals, and your family&rsquo;s schedule, and explains it in plain language.'],
      ['Ongoing care with Dr. Williams', 'You see Dr. Williams at every visit, so your progress is monitored personally from your first appointment to your last.']],
    stepsIntro: 'A clear, low-pressure path from your first visit to your finished smile.'
  },
  {
    file: 'clear-braces.html', title: 'Clear Braces — Siouxland Orthodontics', h1: 'Clear braces',
    lede: 'All the dependable results of traditional braces, with brackets that blend right in. If you or your teen feel a little self-conscious about metal, clear braces are worth a look.',
    photo: { src: 'family-stories.jpg', alt: 'A smiling Siouxland family' },
    crumb: 'Clear braces',
    aboutTitle: 'A more discreet way to straighten',
    about: ['Clear braces use tooth-colored ceramic brackets that blend in with your smile, so they are far less noticeable than metal. They work the same proven way, gently guiding your teeth into place, and they give you the same dependable results.',
      'They are a favorite with teens and adults who want to feel comfortable in photos, at school, and at work while they straighten their smile. As always, Dr. Williams plans and monitors every case personally.'],
    aboutPhoto: { src: 'team-outdoor.jpg', alt: 'The Siouxland Orthodontics team outdoors' },
    whoTitle: 'Who clear braces are for',
    who: ['Teens and adults who feel self-conscious about metal', 'Anyone who wants a discreet, natural-looking option', 'Crowding, spacing, and bite issues of most kinds', 'People who prefer fixed braces over removable aligners'],
    steps: [['Free consultation', 'We take a look together and talk through whether clear braces are the right fit. Your first consultation is on us, with no pressure to start.'],
      ['Your custom plan', 'Dr. Williams builds a plan around your smile and your goals, and explains each step in plain language so you feel confident going in.'],
      ['Ongoing care with Dr. Williams', 'You see Dr. Williams at every visit, so your progress is checked personally from your first appointment through to the reveal.']],
    stepsIntro: 'A clear, low-pressure path from your first visit to your finished smile.'
  },
  {
    file: 'invisalign.html', title: 'Invisalign Clear Aligners — Siouxland Orthodontics', h1: 'Invisalign clear aligners',
    lede: 'Straighten your teeth with a series of clear, removable trays that most people will never notice. A great fit for teens and busy adults who want to keep life moving.',
    photo: { src: 'dr-williams-home.jpg', alt: 'Dr. Aaron Williams' },
    crumb: 'Invisalign',
    aboutTitle: 'Straightening that fits your day',
    about: ['Invisalign uses a set of removable, virtually invisible aligners to straighten your teeth without brackets or wires. You wear each set for a couple of weeks, then move to the next, and your smile shifts into place a little at a time.',
      'Because they are removable, you take them out to eat, brush, and enjoy special occasions, then pop them back in. Invisalign is popular with teens and busy adults, and Dr. Williams is an experienced provider who guides your progress at every step.'],
    aboutPhoto: { src: 'kids-sunset.jpg', alt: 'Teens smiling outdoors at sunset' },
    whoTitle: 'Why people love aligners',
    who: ['Virtually invisible', 'Removable', 'Fewer disruptions to daily life', 'Digital scans, no goopy impressions'],
    steps: [['Free consultation', 'We talk through your goals and see whether aligners are the right fit. Your first consultation is on us, with no pressure to start.'],
      ['Digital scan and plan', 'A quick digital scan, no goopy impressions, lets Dr. Williams map out your custom set of aligners and preview where your smile is headed.'],
      ['Ongoing care with Dr. Williams', 'You check in with Dr. Williams along the way, so your progress is monitored personally from your first tray to your last.']],
    stepsIntro: 'A clear, low-pressure path from your first visit to your finished smile.'
  },
  {
    file: 'kids-teens.html', title: 'Orthodontics for Kids &amp; Teens — Siouxland Orthodontics', h1: 'Orthodontics for kids &amp; teens',
    lede: 'Gentle, proven care for growing smiles that fits school, sports, and everything else your family has going on. We keep it simple, and we keep it kind.',
    photo: { src: 'kids-sunset.jpg', alt: 'Kids smiling outdoors at sunset', pos: 'center 20%' },
    crumb: 'Kids &amp; teens',
    aboutTitle: 'Care that fits their world',
    about: ['Kids and teens are busy, and their smiles are still growing and changing. We meet them where they are with gentle, proven care and a friendly team that helps them feel at ease from the very first visit.',
      'We suggest a first check-up around age 7 so we can watch how the smile is developing. That early look often means simpler care later, and there is no pressure to start treatment early. When the time is right, options include braces, clear braces, and Invisalign. We also offer <a href="airway.html" style="color:var(--coral);font-weight:600">airway-focused care</a>, an approach designed to support healthy breathing and sleep as the jaw develops.'],
    aboutPhoto: { src: 'family-airway.jpg', alt: 'A family together at home' },
    whoTitle: 'What families count on',
    who: ['A warm, welcoming team that kids actually like', 'Early evaluations around age 7, with no pressure to start', 'Braces, clear braces, and Invisalign options', 'Before and after school appointments'],
    steps: [['First check-up', 'Around age 7 we take a friendly first look at how the smile is developing. Your first consultation is on us, with no pressure to start early.'],
      ['A plan that fits their life', 'If and when treatment makes sense, Dr. Williams builds a plan around school, sports, and your family&rsquo;s schedule, and explains it clearly.'],
      ['Support all the way through', 'You see Dr. Williams at every visit, so your child&rsquo;s progress is monitored personally from that first look to the final smile.']],
    stepsIntro: 'A gentle, low-pressure path that grows with your child.'
  },
  {
    file: 'adults.html', title: 'Orthodontics for Adults — Siouxland Orthodontics', h1: 'Orthodontics for adults',
    lede: 'It is never too late for the smile you have always wanted. With discreet options that fit a professional, busy life, more adults are straightening their teeth than ever.',
    photo: { src: 'team-outdoor.jpg', alt: 'The Siouxland Orthodontics team outdoors' },
    crumb: 'Adults',
    aboutTitle: 'Your smile, on your schedule',
    about: ['Plenty of adults wish they had straightened their teeth years ago. The good news is that a healthy smile can come at any age, and today&rsquo;s options make it easier to fit treatment into a full calendar.',
      'Clear braces and Invisalign are both discreet choices that work well for work, meetings, and everyday life, so most people around you may never notice. And you get Dr. Williams at every visit, one experienced orthodontist who guides your care from start to finish.'],
    aboutPhoto: { src: 'dr-williams-home.jpg', alt: 'Dr. Aaron Williams' },
    whoTitle: 'Why adults choose us',
    who: ['Discreet options like clear braces and Invisalign', 'Care that fits a professional, busy life', 'You get Dr. Williams personally at every visit', 'Flexible monthly payment options, most insurance accepted'],
    steps: [['Free consultation', 'We talk through your goals and the options that fit your life. Your first consultation is on us, with no pressure to start.'],
      ['Your custom plan', 'Dr. Williams recommends the discreet option that suits you best and explains the plan in plain language, so you feel confident going in.'],
      ['Ongoing care with Dr. Williams', 'You see Dr. Williams at every visit, so your progress is monitored personally from your first appointment to your last.']],
    stepsIntro: 'A clear, low-pressure path that respects your time.'
  },
];

for (const t of TREATMENTS) {
  page({
    file: t.file, title: t.title, current: t.file, desc: t.lede,
    main: `
${crumbs([t.crumb])}
${pagehead(t.h1, t.lede, t.photo, 'Request a free consult')}
<section><div class="wrap split">
  <div><h2>${t.aboutTitle}</h2>${t.about.map(p => `<p>${p}</p>`).join('')}</div>
  <div class="ph"><img src="assets/photos/${t.aboutPhoto.src}" alt="${t.aboutPhoto.alt}"></div>
</div></section>
${benefits(t.whoTitle, t.who)}
${steps(t.stepsIntro, t.steps)}
${faqSection(t.file)}
${CTA_BAND}`
  });
}

/* ---------- airway ---------- */

page({
  file: 'airway.html', title: 'Airway-Focused Orthodontics — Siouxland Orthodontics', current: 'airway.html',
  main: `
${crumbs(['Airway-focused care'])}
${pagehead('Airway-focused orthodontics',
    'Orthodontics is about more than straight teeth. Dr. Williams also looks at how jaw and dental development relate to the airway, an approach designed to support healthy breathing, restful sleep, and overall wellbeing alongside a great smile.',
    { src: 'family-airway.jpg', alt: 'A family together at home' }, 'Ask about airway care')}
<section><div class="wrap split">
  <div><h2>What airway-focused orthodontics means</h2>
    <p>How the jaws and teeth develop can influence how easily we breathe, especially during sleep. Airway-focused orthodontics simply means Dr. Williams pays attention to that connection as part of your care. He looks at growth, spacing, and the shape of the bite with breathing in mind, then explains what he sees in plain language.</p>
    <p>It is a thoughtful, whole-picture way to plan treatment. For the right patient, it may help support better breathing and more restful sleep as the smile comes together.</p>
  </div>
  <div class="ph"><img src="assets/photos/family-stories.jpg" alt="A Siouxland family smiling together"></div>
</div></section>
<section style="padding-top:0"><div class="wrap">
  <div class="callout">Airway-focused orthodontics is designed to support healthy breathing and sleep. It is not a diagnosis, a treatment for any medical condition, or a cure, and any plan follows a personal evaluation with Dr. Williams. If you have concerns about sleep or breathing, we are glad to talk and, when helpful, coordinate with your physician.</div>
</div></section>
<section style="padding-top:0"><div class="wrap">
  <div class="sechead"><h2>Things families often ask us about</h2></div>
  <p style="margin:-12px 0 24px;max-width:64ch">Many parents come in with everyday questions. If any of these sound familiar, a friendly conversation is a good place to start. None of these are a diagnosis, and we will never guess. We look, we listen, and we explain.</p>
  <div class="benefits">
    <div class="benefit">${ICONS.check}<span>Mouth breathing during the day or while sleeping</span></div>
    <div class="benefit">${ICONS.check}<span>Snoring or restless, interrupted sleep</span></div>
    <div class="benefit">${ICONS.check}<span>Crowding, a narrow smile, or a bite that seems off</span></div>
    <div class="benefit">${ICONS.check}<span>A dentist who suggested an orthodontic look at development</span></div>
  </div>
  <p style="margin-top:24px;max-width:64ch">These are the kinds of observations that bring families to us, and they are worth a look. During a free consultation, Dr. Williams reviews how the jaw and teeth are developing and talks through whether an airway-focused approach may help in your situation. If orthodontics is a good fit, he will lay out your options. If another specialist would serve you better, he will tell you that too.</p>
</div></section>
${steps(null, [
    ['A relaxed first look', 'We start with a free, no-pressure consultation. Dr. Williams gets to know you, listens to your questions, and reviews how the smile is developing.'],
    ['A plain-language plan', 'If an airway-focused approach may help, he explains why, what it would involve, and the timeline, so you can decide with confidence.'],
    ['Care that fits real life', 'You get Dr. Williams at every visit, with coordination alongside your dentist or physician whenever that is helpful.']])}
${faqSection('airway.html')}
${CTA_BAND}`
});

/* ---------- about ---------- */

page({
  file: 'about.html', title: 'About Dr. Aaron Williams — Siouxland Orthodontics', current: 'about.html',
  main: `
${crumbs(['About Dr. Williams'])}
${pagehead('Meet Dr. Aaron Williams',
    'A Board-eligible orthodontist, a dad of five, and the one doctor you will see at every visit. Dr. Williams built Siouxland Orthodontics around a simple idea: you deserve to know your doctor, and your doctor should know you.',
    { src: 'dr-williams-about.jpg', alt: 'Dr. Aaron Williams portrait' }, 'Request a free consult')}
<section><div class="wrap split">
  <div class="ph"><img src="assets/photos/dr-williams-home.jpg" alt="Dr. Aaron Williams"></div>
  <div><h2>Experienced, and genuinely glad you are here</h2>
    <p>Dr. Williams earned his DDS from the University of Iowa in 2010, then completed orthodontic specialty training and a master&rsquo;s degree at the University of Colorado in 2013. He also holds an MBA. With more than ten years in practice, he has helped patients of every age feel confident about their smiles.</p>
    <p>What patients notice first is not the diplomas. It is that he takes the time to explain what he sees, answers your questions in plain language, and never rushes a decision. You will see the same friendly face every visit, because at Siouxland Orthodontics, you get Dr. Williams.</p>
  </div>
</div></section>
${benefits('The background behind your care', [
    'University of Iowa, Doctor of Dental Surgery (DDS), 2010',
    'University of Colorado, orthodontic specialty training and master&rsquo;s degree, 2013',
    'Master of Business Administration (MBA)',
    'Board-eligible orthodontist with 10+ years in practice'])}
<section style="padding-top:0"><div class="wrap split">
  <div><h2>A Siouxland family, putting down roots</h2>
    <p>Dr. Williams and his wife, Laura, are raising five kids, so a busy family calendar is something he understands firsthand. He is active, artistic, and athletic, and he is proud to be planting roots and building relationships across the Siouxland community.</p>
    <p>That family-first perspective shows up in the little things: appointments that respect your time, a team that treats you like a neighbor, and care that is built around real life.</p>
    <h2 style="margin-top:32px">Continuing 30+ years of trusted care</h2>
    <p>Siouxland Orthodontics carries forward a practice that has cared for local families for more than three decades. Dr. Williams is honored to build on that legacy of trusted, hometown care, and to guide it into a modern, personal chapter for the next generation of Siouxland smiles.</p>
  </div>
  <div class="ph"><img src="assets/photos/team-outdoor.jpg" alt="The Siouxland Orthodontics team outdoors"></div>
</div></section>
<section class="quote-strip" style="padding:48px 0"><div class="wrap">
  <blockquote>&ldquo;The team is genuinely kind, and every visit feels personal. We always know exactly what is happening and what comes next.&rdquo;</blockquote>
  <p class="note">Placeholder review for layout only. Replace with a real, consented patient review before publishing.</p>
</div></section>
${CTA_BAND}`
});

/* ---------- financing ---------- */

page({
  file: 'financing.html', title: 'Payment &amp; Financing — Siouxland Orthodontics', current: 'financing.html',
  main: `
${crumbs(['Payment &amp; financing'])}
${pagehead('Payment &amp; financing made simple',
    'Great orthodontic care should feel within reach. We keep the money part clear and low-pressure so you can focus on your child&rsquo;s smile.',
    { src: 'family-stories.jpg', alt: 'A happy Siouxland family' }, 'Request a free consult')}
<section><div class="wrap split">
  <div><h2>We make the money part easy</h2>
    <p>Starting treatment is a big step, and the cost question is often the first one on your mind. We walk through it with you in plain language, help you understand your benefits, and find a plan that works for your family. No surprises and no pressure.</p>
    <ul class="checklist">
      <li>${ICONS.check}<span>Most insurance accepted, including Medicaid</span></li>
      <li>${ICONS.check}<span>We help you understand and file your benefits</span></li>
      <li>${ICONS.check}<span>Flexible monthly payment options</span></li>
      <li>${ICONS.check}<span>Your first consultation is on us</span></li>
      <li>${ICONS.check}<span>No referral needed</span></li>
    </ul>
  </div>
  <div class="ph"><img src="assets/photos/kids-sunset.jpg" alt="Kids smiling outdoors at sunset"></div>
</div></section>
${steps('Three simple steps from your first hello to a plan that fits your budget.', [
    ['Free consult and a clear plan', 'Meet Dr. Williams, get a full look at your smile, and leave with a clear treatment plan and a written breakdown you can take home.'],
    ['We review your insurance and options', 'We check your benefits for you, explain what they cover in plain language, and lay out the options so nothing is confusing.'],
    ['A monthly plan that fits', 'Together we choose flexible monthly payment options that work for your family, and then it is time to get started.']])}
<section id="pay" style="padding-top:0"><div class="wrap">
  <div class="cta-band" style="background:var(--black)">
    <div><h2>Already a patient?</h2>
    <p>You can pay your account online through Vanco, the secure payment service our offices already use. We are connecting the online payment link now. Until it is live, call your office and the team will help you right away.</p></div>
    <a class="btn btn-gold" href="locations.html">Find your office</a>
  </div>
</div></section>
${faqSection('financing.html')}
${CTA_BAND}`
});

/* ---------- locations index ---------- */

const OFFICES = [
  { file: 'location-morningside.html', name: 'Morningside', place: 'Sioux City, IA', color: 'purple', tag: 'Fast, modern orthodontics that fits your family&rsquo;s schedule.', addr: '4224 Sergeant Rd, Sioux City, IA 51106', tel: '(712) 276-2766', telHref: '+17122762766' },
  { file: 'location-leeds.html', name: 'Leeds', place: 'Sioux City, IA', color: 'green', tag: 'Your neighborhood braces team for every kid on the block.', addr: '2801 Outer Dr N, Sioux City, IA 51104', tel: '(712) 239-0420', telHref: '+17122390420' },
  { file: 'location-lemars.html', name: 'Le Mars', place: 'Le Mars, IA', color: 'scarlet', tag: 'Big-city orthodontics with small-town relationships.', addr: '405 Plymouth St NW, Le Mars, IA 51031', tel: '(712) 546-5179', telHref: '+17125465179' },
  { file: 'location-wayne.html', name: 'Wayne', place: 'Wayne, NE', color: 'dusk', tag: 'Wayne&rsquo;s hometown orthodontist for families, teachers, and staff.', addr: '617 Pearl St Ste #2, Wayne, NE 68787', tel: '(402) 833-1333', telHref: '+14028331333' },
];

page({
  file: 'locations.html', title: 'Locations — Siouxland Orthodontics', current: 'locations.html',
  main: `
${crumbs(['Locations'])}
${pagehead('Four locations to choose from',
    'Wherever you live across Siouxland, there is a Siouxland Orthodontics office close to home. Pick the one that fits your family and come say hello.',
    { src: 'team-outdoor.jpg', alt: 'The Siouxland Orthodontics team outdoors' })}
<section><div class="wrap">
  <div class="offices">${OFFICES.map(o => `
    <div class="office"><h3>${pinFill(o.color)}${o.name}</h3><span class="tag">${o.place}</span>
      <span class="addr">${o.addr}</span>
      <span class="addr">By appointment, Monday through Friday.</span>
      <a class="tel" href="tel:${o.telHref}">${o.tel}</a>
      <a class="link-arrow" href="${o.file}">Visit this office ${ICONS.arrow}</a></div>`).join('')}
  </div>
</div></section>
<section style="padding-top:0"><div class="wrap split">
  <div><h2>The same Dr. Williams at every office</h2>
    <p>No matter which location you choose, you get Dr. Williams personally, every visit. Same warm team, same careful attention, same plain-language answers. We simply meet you at the office that is easiest for your family to reach.</p>
  </div>
  <div class="ph"><img src="assets/photos/dr-williams-home.jpg" alt="Dr. Aaron Williams"></div>
</div></section>
${CTA_BAND}`
});

/* ---------- location detail pages ---------- */

const LOC_DETAIL = {
  'location-morningside.html': {
    title: 'Orthodontist in Sioux City, IA | Siouxland Orthodontics',
    h1: 'Orthodontist in Sioux City, IA',
    lede: 'Fast, modern orthodontics that fits your family&rsquo;s schedule. Our Morningside office is the flagship home base for Sioux City families, and you get Dr. Williams personally at every visit.',
    crumb: 'Morningside',
    h2: 'Your home base for orthodontics in Sioux City.',
    body: ['Our Morningside office on Sergeant Road is our main Sioux City location, and it is built around real life. You will find modern technology, a warm team that learns your name, and a schedule that works around school, sports, and work.',
      'Whether it is your child&rsquo;s first orthodontic look or you are finally straightening your own smile, you get Dr. Williams every visit. One orthodontist who remembers your story and personally guides your care from the first day to the last.'],
    quote: 'The Morningside team made my daughter feel at ease from the first visit, and appointments always fit around our busy weeks. We are so glad we came here.',
    cta: 'Come see us in Sioux City.'
  },
  'location-leeds.html': {
    title: 'Orthodontist in Sioux City, IA | Siouxland Orthodontics',
    h1: 'Orthodontist in Sioux City, IA',
    lede: 'Your neighborhood braces team for every kid on the block. Our Leeds office brings friendly, personal orthodontic care close to home, and you get Dr. Williams every visit.',
    crumb: 'Leeds',
    h2: 'A neighborhood office that feels like family.',
    body: ['Leeds is a close-knit part of Sioux City, and our office on Outer Drive North fits right in. Kids see familiar faces, parents get straight answers, and the whole visit feels more like stopping by a friend&rsquo;s place than a clinic.',
      'You get Dr. Williams every visit. One orthodontist who learns your family&rsquo;s names, remembers where you left off, and personally guides your care from the first appointment onward.'],
    quote: 'Both of my boys have their braces done here, and it is so easy having a friendly office right in the neighborhood. Everyone treats them like their own.',
    cta: 'Come see us in the neighborhood.'
  },
  'location-lemars.html': {
    title: 'Orthodontist in Le Mars, IA | Siouxland Orthodontics',
    h1: 'Orthodontist in Le Mars, IA',
    lede: 'Big-city orthodontics with small-town relationships. Our Le Mars office brings advanced care to your hometown, and you get Dr. Williams personally at every visit.',
    crumb: 'Le Mars',
    h2: 'Advanced care, small-town heart.',
    body: ['Le Mars families should not have to drive to a big city for modern orthodontics. Our office on Plymouth Street brings the same technology and treatment options right to town, with the personal relationships that make small-town life so good.',
      'You get Dr. Williams every visit. One orthodontist who knows your family, remembers your story, and personally guides your care from start to finish.'],
    airway: true,
    quote: 'It means so much to get this level of care without leaving Le Mars. Dr. Williams took real time to answer our questions and never made us feel rushed.',
    cta: 'Come see us in Le Mars.'
  },
  'location-wayne.html': {
    title: 'Orthodontist in Wayne, NE | Siouxland Orthodontics',
    h1: 'Orthodontist in Wayne, NE',
    lede: 'Wayne&rsquo;s hometown orthodontist for families, teachers, and staff. Our Wayne office serves the whole community, and you get Dr. Williams personally at every visit.',
    crumb: 'Wayne',
    h2: 'Proud to be part of the Wayne community.',
    body: ['Our office on Pearl Street is right in the heart of Wayne, serving local families, teachers, and Wayne State College students and staff. We know how full your calendars get, so we make care straightforward and welcoming from the first hello.',
      'You get Dr. Williams every visit. One orthodontist who learns your name, remembers your story, and personally guides your care from the first appointment to the last.'],
    quote: 'Having an orthodontist right here in Wayne makes everything easier for our family. The team is warm and welcoming, and they truly know us by name.',
    cta: 'Come see us in Wayne.'
  },
};

const LOC_PHOTOS = {
  'location-morningside.html': 'hero-team.jpg',
  'location-leeds.html': 'kids-sunset.jpg',
  'location-lemars.html': 'family-airway.jpg',
  'location-wayne.html': 'team-outdoor.jpg',
};

for (const o of OFFICES) {
  const d = LOC_DETAIL[o.file];
  page({
    file: o.file, title: d.title, current: 'locations.html', desc: d.lede,
    main: `
${crumbs([['locations.html', 'Locations'], d.crumb])}
${pagehead(d.h1, d.lede, { src: LOC_PHOTOS[o.file], alt: `Siouxland Orthodontics ${o.name} office team` }, 'Request a free consult')}
<section><div class="wrap split">
  <div><h2>${d.h2}</h2>${d.body.map(p => `<p>${p}</p>`).join('')}</div>
  <div style="display:flex;flex-direction:column;gap:16px">
    <div class="addr-card"><h3>${pinFill(o.color)}${o.name} office</h3>
      <span>${o.addr}</span>
      <span>By appointment, Monday through Friday.</span>
      <a class="tel" href="tel:${o.telHref}">${o.tel}</a>
    </div>
    <div class="addr-card"><h3>Care at this office</h3>
      <span>Metal braces &bull; Clear braces &bull; Invisalign aligners</span>
      <span>Airway-focused care &bull; Kids, teens &amp; adults</span>
    </div>
  </div>
</div></section>
${d.airway ? `<section style="padding-top:0"><div class="wrap">
  <div class="sechead"><h2>Curious about airway-focused orthodontics?</h2></div>
  <p style="margin:-12px 0 16px;max-width:64ch">Le Mars families often ask us about airway-focused care, and Dr. Williams offers it right here. Beyond straightening teeth, he looks at how jaw and dental growth relate to the airway, an approach designed to support healthy breathing and restful sleep alongside a great smile.</p>
  <p style="margin:0 0 20px;max-width:64ch">If you have wondered whether it might be a fit for your child or for yourself, we are happy to talk it through in plain language, with no pressure.</p>
  <div class="callout">Airway-focused orthodontics is designed to support healthy breathing and sleep. It is not a diagnosis or a cure, and any treatment plan follows a personal evaluation with Dr. Williams.</div>
</div></section>` : ''}
<section class="quote-strip" style="padding:48px 0"><div class="wrap">
  <blockquote>&ldquo;${d.quote}&rdquo;</blockquote>
  <p class="note">Placeholder review for layout only. Replace with a real, consented patient review before publishing.</p>
</div></section>
<section style="padding-top:0"><div class="wrap">
  <div class="cta-band">
    <div><h2>${d.cta}</h2>
    <p>Your first consultation is on us. No referral needed, and most insurance is accepted.</p></div>
    <a class="btn btn-gold" href="appointment.html">Request a free consult</a>
  </div>
</div></section>`
  });
}

/* ---------- appointment ---------- */

page({
  file: 'appointment.html', title: 'Request a Free Consult — Siouxland Orthodontics', current: 'appointment.html',
  main: `
${crumbs(['Request a free consult'])}
${pagehead('Request a free consult',
    'Tell us a little about the smile you have in mind. We will reach out to find a time that works, answer your questions, and get you in to meet Dr. Williams. Your first visit is on us.')}
<section style="padding-top:24px"><div class="wrap split" style="align-items:start">
  <div class="form-card">
    <div id="thanks" hidden>
      <h2 style="font-size:24px">Thank you. We will be in touch soon.</h2>
      <p style="margin-top:12px">Your request is on its way to our team. We will reach out shortly to schedule your free consultation. If you would like to talk now, call us at <a href="tel:+17122762766" style="font-weight:700;color:var(--coral)">(712) 276-2766</a>.</p>
    </div>
    <form id="consult" novalidate>
      <h2 style="font-size:24px;margin-bottom:6px">Start your request</h2>
      <p style="margin-bottom:20px">It takes about a minute. No referral needed.</p>
      <div class="form-grid">
        <div class="field"><label for="f-name">Your name</label><input id="f-name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="f-phone">Phone</label><input id="f-phone" type="tel" autocomplete="tel" required></div>
        <div class="field full"><label for="f-office">Preferred office</label>
          <select id="f-office">
            <option>Morningside, Sioux City</option>
            <option>Leeds, Sioux City</option>
            <option>Le Mars, IA</option>
            <option>Wayne, NE</option>
            <option>Not sure yet</option>
          </select></div>
        <div class="field full"><label for="f-notes">Anything you would like us to know?</label><textarea id="f-notes" rows="4"></textarea></div>
        <div class="full"><button class="btn btn-coral" type="submit" style="width:100%">Request my free consult</button></div>
      </div>
      <p class="form-note">Prefer to talk? Call us at <a href="tel:+17122762766" style="font-weight:700;color:var(--coral)">(712) 276-2766</a>.</p>
    </form>
  </div>
  <div>
    <div class="sechead" style="margin-bottom:14px"><h2 style="font-size:22px">What to expect</h2></div>
    <ul class="checklist">
      <li>${ICONS.check}<span>A warm welcome and a relaxed, no-pressure visit.</span></li>
      <li>${ICONS.check}<span>A plain-language look at your options with Dr. Williams.</span></li>
      <li>${ICONS.check}<span>Clear next steps and answers to your questions.</span></li>
    </ul>
    <div class="sechead" style="margin:30px 0 14px"><h2 style="font-size:22px">Good to know</h2></div>
    <ul class="checklist">
      <li>${ICONS.check}<span>No referral needed to be seen.</span></li>
      <li>${ICONS.check}<span>Most insurance accepted, and we help with benefits.</span></li>
      <li>${ICONS.check}<span>Four offices: Morningside, Leeds, Le Mars, and Wayne.</span></li>
    </ul>
  </div>
</div></section>
<script>
(function(){
  var f = document.getElementById('consult');
  if (!f) return;
  f.addEventListener('submit', function(e){
    e.preventDefault();
    f.hidden = true;
    document.getElementById('thanks').hidden = false;
    window.scrollTo({top:0,behavior:'smooth'});
  });
})();
</script>`
});

/* ---------- contact ---------- */

page({
  file: 'contact.html', title: 'Contact — Siouxland Orthodontics', current: 'contact.html',
  main: `
${crumbs(['Contact'])}
${pagehead('Contact Siouxland Orthodontics',
    'We would love to hear from you. Reach out with a question or request your free consult, and a friendly member of our team will help you take the next step.')}
<section style="padding-top:24px"><div class="wrap split" style="align-items:start">
  <div><h2>The fastest way to get started</h2>
    <p>Requesting a free consult is the quickest way to reach us. Tell us a little about you, and we will follow up to find a time that works. There is no referral needed to be seen, and your first consultation is on us.</p>
    <ul class="checklist">
      <li>${ICONS.check}<span>No referral needed to be seen</span></li>
      <li>${ICONS.check}<span>Most insurance accepted</span></li>
      <li>${ICONS.check}<span>Prefer email? Reach us at hello@siouxlandorthodontics.com (placeholder address)</span></li>
    </ul>
    <a class="btn btn-coral" href="appointment.html" style="margin-top:24px">Request a free consult</a>
    <div class="sechead" style="margin:34px 0 12px"><h2 style="font-size:22px">What to expect when you reach out</h2></div>
    <ul class="checklist">
      <li>${ICONS.check}<span>A warm hello from our team, never a hard sell.</span></li>
      <li>${ICONS.check}<span>Clear answers to your questions in plain language.</span></li>
      <li>${ICONS.check}<span>Help finding the office and time that fit your family.</span></li>
      <li>${ICONS.check}<span>Se habla espa&ntilde;ol.</span></li>
    </ul>
  </div>
  <div style="display:flex;flex-direction:column;gap:16px">
    ${OFFICES.map(o => `<div class="addr-card"><h3>${pinFill(o.color)}${o.name}</h3>
      <span>${o.addr}</span>
      <span>By appointment, Monday through Friday.</span>
      <a class="tel" href="tel:${o.telHref}">${o.tel}</a></div>`).join('')}
  </div>
</div></section>
<section id="refer" style="padding-top:0"><div class="wrap">
  <div class="sechead"><h2>Referring doctors</h2></div>
  <p style="margin:-12px 0 0;max-width:64ch">Referring offices can send patients through our online referral form, powered by JotForm. The form is being connected now. Until then, call <a href="tel:+17122762766" style="color:var(--coral);font-weight:700">(712) 276-2766</a> and we will take it from there.</p>
</div></section>
${CTA_BAND}`
});

/* ---------- legal pages ---------- */

for (const f of ['privacy.html', 'terms.html', 'hipaa.html']) {
  const { h1, lede, body } = liftLegal(f);
  const src = readFileSync(join(SRC, f), 'utf8');
  const title = (src.match(/<title>([\s\S]*?)<\/title>/) || [])[1].trim();
  page({
    file: f, title, current: '',
    main: `
${crumbs([h1])}
${pagehead(h1, lede)}
<section style="padding-top:20px"><div class="wrap"><div class="prose">
${body}
</div></div></section>`
  });
}

console.log('done.');
