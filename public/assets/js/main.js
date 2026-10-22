// ---- Theme toggle ----
const root = document.documentElement;
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
});

// Code lines type in sequence
document.querySelectorAll('.code .ln').forEach((l, i) => l.style.setProperty('--i', i));

// Spotlight cells: pointer position -> CSS vars (no layout work)
document.querySelectorAll('.spot').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  c.style.setProperty('--my', (e.clientY - r.top) + 'px');
}));

// Copy buttons ([data-copy]): contact section and email links inside chat answers
document.addEventListener('click', async e => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    btn.classList.add('done'); btn.title = 'Copied';
  } catch { btn.title = 'Copy failed'; }
  setTimeout(() => { btn.classList.remove('done'); btn.title = 'Copy email'; }, 1600);
});

// ---- GSAP: inertia scroll (Locomotive-style) + scroll-linked reveals ----
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let smoother = null;
if (!reduceMotion && window.gsap && window.ScrollSmoother) {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper', content: '#smooth-content',
    smooth: 1.2, smoothTouch: false, effects: false,
  });

  // Reveals: commits and contact rows rise in as they enter
  gsap.set('.reveal', { opacity: 0, y: 40 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .85, ease: 'power3.out', stagger: .2, overwrite: true }),
  });

  // Bento cells: cascade in reading order
  gsap.set('.bento .cell', { opacity: 0, y: 30 });
  ScrollTrigger.batch('.bento .cell', {
    start: 'top 90%',
    onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .7, ease: 'power3.out', stagger: .08, overwrite: true }),
  });

  // Shopify icon: 3D roll that swells to full size as its card crosses the viewport centre
  const shopIcon = document.querySelector('.cell.shopify .logos .logo');
  if (shopIcon) {
    gsap.set(shopIcon, { transformPerspective: 500 });
    gsap.timeline({ scrollTrigger: { trigger: '.cell.shopify', start: 'top bottom', end: 'bottom top', scrub: 1 } })
      .fromTo(shopIcon,
        { rotationY: -360, rotationX: 20, scale: .7 },
        { rotationY: 0, rotationX: 0, scale: 1.5, ease: 'sine.inOut' })
      .to(shopIcon, { rotationY: 360, rotationX: -20, scale: .7, ease: 'sine.inOut' });
  }
}

// Typing loop on the role: type, hold 5s, erase, repeat
const roleEl = document.querySelector('h1 .accent');
if (roleEl && !reduceMotion) {
  const text = roleEl.textContent;
  roleEl.textContent = '';
  const typed = document.createElement('span');
  const caret = document.createElement('span');
  caret.className = 'caret';
  caret.setAttribute('aria-hidden', 'true');
  roleEl.setAttribute('aria-label', text);
  roleEl.append(typed, caret);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  (async () => {
    while (true) {
      for (let i = 1; i <= text.length; i++) { typed.textContent = text.slice(0, i); await sleep(80); }
      await sleep(5000);
      for (let i = text.length - 1; i >= 0; i--) { typed.textContent = text.slice(0, i); await sleep(35); }
      await sleep(500);
    }
  })();
}

// Anchor links: route through the smoother when active, native otherwise
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const href = a.getAttribute('href');
  if (!smoother) return;                       // native scroll + scroll-padding-top handles it
  e.preventDefault();
  if (href.length < 2) { smoother.scrollTo(0, true); return; }
  const t = document.querySelector(href);
  if (t) smoother.scrollTo(t, true, 'top 84px');
}));

// ---- Project slider: true infinite loop via a cloned set ----
// Slides are duplicated once; whenever the scroll settles inside the clone
// set, the position folds back by one set-width with zero visible movement.
const track = document.getElementById('track');
const originals = [...track.querySelectorAll('.slide')];
const n = originals.length;
// Clone sets on BOTH sides so cards are visible left and right from the start
const makeClone = s => {
  const c = s.cloneNode(true);
  c.setAttribute('aria-hidden', 'true');
  c.querySelectorAll('a, [tabindex]').forEach(el => el.tabIndex = -1);
  if (c.tagName === 'A') c.tabIndex = -1;
  return c;
};
const before = document.createDocumentFragment();
const after = document.createDocumentFragment();
originals.forEach(s => { before.appendChild(makeClone(s)); after.appendChild(makeClone(s)); });
track.insertBefore(before, track.firstElementChild);
track.appendChild(after);
const slides = [...track.querySelectorAll('.slide')];
const dotsBox = document.getElementById('sDots');
originals.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Go to project ' + (i + 1));
  b.addEventListener('click', () => { normalize(); centerSlide(n + i); });
  dotsBox.appendChild(b);
});
const dots = [...dotsBox.children];

const setWidth = () => slides[n].offsetLeft - slides[0].offsetLeft;
function centerSlide(i, behavior = 'smooth') {
  const s = slides[i];
  track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior });
}
function activeIndex() {
  const mid = track.scrollLeft + track.clientWidth / 2;
  let best = 0, bestD = Infinity;
  slides.forEach((s, i) => {
    const d = Math.abs(s.offsetLeft + s.clientWidth / 2 - mid);
    if (d < bestD) { bestD = d; best = i; }
  });
  return best;
}
// Keep the settled index inside the middle (original) set: [n, 2n)
function normalize() {
  const i = activeIndex();
  if (i < n) track.scrollLeft += setWidth();
  else if (i >= 2 * n) track.scrollLeft -= setWidth();
}
let raf = 0, settle = 0;
function update() {
  const i = activeIndex();
  slides.forEach((s, j) => s.classList.toggle('active', j === i));
  dots.forEach((d, j) => d.classList.toggle('on', j === i % n));
}
track.addEventListener('scroll', () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(update);
  clearTimeout(settle);
  settle = setTimeout(normalize, 150);
}, { passive: true });

// Looping navigation: stepping past either end crosses into a clone set seamlessly
function step(dir) {
  normalize();
  centerSlide(activeIndex() + dir);
}
document.getElementById('sPrev').addEventListener('click', () => step(-1));
document.getElementById('sNext').addEventListener('click', () => step(1));
track.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
});

// Start centered on the first ORIGINAL slide (clones visible on both sides)
centerSlide(n, 'auto');
update();
addEventListener('resize', () => { normalize(); centerSlide(n + activeIndex() % n, 'auto'); });

// Slide-up entrance the first time the slider scrolls into view
const shell = document.querySelector('.slider-shell');
const sio = new IntersectionObserver(es => {
  if (es[0].isIntersecting) {
    slides.forEach((s, i) => s.style.animationDelay = (Math.abs(i - n) * 130) + 'ms');
    shell.classList.add('shown');
    sio.disconnect();
  }
}, { threshold: 0.15 });
sio.observe(shell);

// Autoplay: advance every 3s, loop, pause while the user is looking or dragging
if (!reduceMotion) {
  let timer = setInterval(() => step(1), 3000);
  const stop = () => { clearInterval(timer); timer = 0; };
  const start = () => { if (!timer) timer = setInterval(() => step(1), 3000); };
  ['mouseenter', 'pointerdown', 'focusin', 'touchstart'].forEach(ev => track.addEventListener(ev, stop, { passive: true }));
  ['mouseleave', 'focusout'].forEach(ev => track.addEventListener(ev, start));
}
