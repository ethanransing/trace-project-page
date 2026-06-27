/* ─────────────────────────────────────────────────────────────
   TRACE project page — interaction script.
   Scroll-reveal ported from the GET_Planning page; interactive
   widgets for the TRACE demos are added below.
   ───────────────────────────────────────────────────────────── */

const PREFERS_MOTION = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

// Frame metadata shared by the hero loop and the Watch-It-Work viewer,
// derived verbatim from video/real_video/metrics.txt.
const RUN_BADGES = [
  'Initial estimate', 'After Divergence Push', 'After Cluster Dilation',
  'After Cluster Dilation', 'After Cluster Dilation', 'After Cluster Dilation',
  'After Cluster Dilation', 'Resolved ✓'
];
const RUN_FRAMES = 8;

// Preload run frames once for both widgets.
for (let k = 0; k < RUN_FRAMES; k++) { const p = new Image(); p.src = `media/run/iter_${k}.jpg`; }

// ── Hero auto-loop (content playback, not decorative motion) ──
(() => {
  const img = document.getElementById('heroImg');
  const badge = document.getElementById('heroBadge');
  const stage = document.querySelector('.hero-stage');
  if (!img || !badge) return;

  // Reduced motion: show the resolved end state, no playback.
  if (!PREFERS_MOTION) {
    const last = RUN_FRAMES - 1;
    img.src = `media/run/iter_${last}.jpg`;
    badge.textContent = RUN_BADGES[last];
    return;
  }

  let i = 0, timer = null;
  function show(n) {
    i = n % RUN_FRAMES;
    img.src = `media/run/iter_${i}.jpg`;
    badge.textContent = RUN_BADGES[i];
  }
  function start() { if (!timer) timer = setInterval(() => show(i + 1), 1200); }
  function stop() { clearInterval(timer); timer = null; }

  // Only loop while the hero is on screen.
  if ('IntersectionObserver' in window && stage) {
    new IntersectionObserver(
      entries => entries.forEach(e => (e.isIntersecting ? start() : stop())),
      { threshold: 0.25 }
    ).observe(stage);
  } else {
    start();
  }
})();

// ── Monochrome challenge toggle ─────────────────────────
(() => {
  const img = document.getElementById('challengeImg');
  const btns = document.querySelectorAll('.challenge .seg-btn');
  if (!img || !btns.length) return;
  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    img.style.opacity = '0';
    setTimeout(() => { img.src = btn.dataset.img; img.style.opacity = '1'; }, 180);
  }));
})();

// ── Run viewer (real logged robot run, 8 frames) ────────
(() => {
  const img = document.getElementById('runImg');
  const scrub = document.getElementById('runScrub');
  const playBtn = document.getElementById('runPlay');
  const idxEl = document.getElementById('runIdx');
  const capEl = document.getElementById('runCaption');
  const badgeEl = document.getElementById('runBadge');
  if (!img || !scrub) return;

  // Captions derived verbatim from video/real_video/metrics.txt
  // (badges + frame count + preload are shared via RUN_BADGES / RUN_FRAMES above).
  const captions = [
    'Iteration 0 — initial bi-directional trace. Several cables are still broken at crossings. Next move: Divergence Push (24.3°, 61 px).',
    'A tangential crossing has been separated. Next move: Cluster Dilation on a dense knot (area 3632 px²).',
    'Next move: Cluster Dilation (area 5123 px²).',
    'Next move: Cluster Dilation (area 4347 px²).',
    'Next move: Cluster Dilation (area 4160 px²).',
    'Next move: Cluster Dilation (area 3464 px²).',
    'Dense clusters loosened. Next move: Divergence Push (38.3°, 46 px).',
    'All six endpoints are traced as continuous, topologically consistent cables. Done.'
  ];
  const N = RUN_FRAMES;
  let i = 0, timer = null;

  function show(n) {
    i = (n + N) % N;
    img.src = `media/run/iter_${i}.jpg`;
    scrub.value = i;
    idxEl.textContent = i;
    capEl.textContent = captions[i];
    badgeEl.textContent = RUN_BADGES[i];
  }
  function stop() { clearInterval(timer); timer = null; playBtn.textContent = '▶ Play'; }
  function play() {
    if (i === N - 1) show(0);
    playBtn.textContent = '❚❚ Pause';
    timer = setInterval(() => {
      if (i === N - 1) { stop(); return; }
      show(i + 1);
    }, 1100);
  }

  playBtn.addEventListener('click', () => timer ? stop() : play());
  scrub.addEventListener('input', () => { stop(); show(parseInt(scrub.value, 10)); });
  show(0);
})();

// ── Divergence stepper ──────────────────────────────────
(() => {
  const stepper = document.getElementById('divergeStepper');
  const cap = document.getElementById('divergeCaption');
  if (!stepper) return;
  const green = document.querySelectorAll('.s-endpoints');
  const cyan = document.querySelectorAll('.s-diverge');
  const text = {
    endpoints: '<strong>A</strong> and <strong>B</strong> connectors are detected (green). Each one seeds an independent trace.',
    trace: 'The <span style="color:#d33">red</span> trace runs from A; the white trace from B. Where they agree, the paths overlap (orange).',
    diverge: 'Where the two traces stop overlapping are the <strong>divergence points</strong> (cyan) — exactly where cable identity is ambiguous.'
  };
  stepper.querySelectorAll('.step-btn').forEach(btn => btn.addEventListener('click', () => {
    stepper.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const step = btn.dataset.step;
    green.forEach(m => m.classList.toggle('show', step === 'endpoints'));
    cyan.forEach(m => m.classList.toggle('show', step === 'diverge'));
    cap.innerHTML = text[step];
  }));
  green.forEach(m => m.classList.add('show')); // initial step = endpoints
})();

// ── Perception primitive density selector ───────────────
(() => {
  const btns = document.querySelectorAll('.density-toggle .seg-btn');
  const cards = document.querySelectorAll('.primitive-card');
  if (!btns.length) return;
  function select(density) {
    const target = density === 'low' ? 'push' : 'dilation';
    cards.forEach(c => c.classList.toggle('selected', c.dataset.primitive === target));
  }
  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    select(btn.dataset.density);
  }));
  select('low');
})();

// ── Results bar chart ───────────────────────────────────
(() => {
  const chart = document.getElementById('chart');
  const cap = document.getElementById('chartCaption');
  const btns = document.querySelectorAll('[data-chart]');
  if (!chart) return;

  const data = {
    clutter: {
      handloom: [37.6, 36.3, 52.6, 34.4],
      trace:    [94.4, 91.4, 88.3, 82.9],
      caption: 'With clutter, TRACE traced 100% of all cables in 32 of 60 trials, an average 77% improvement over HANDLOOM 2.0.'
    },
    clean: {
      handloom: [89.5, 86.2, 60.0, 68.2],
      trace:    [99.1, 91.2, 94.2, 89.4],
      caption: 'Even without clutter, TRACE leads every tier, with the largest margins on the hardest 3–4 cable scenes.'
    }
  };

  // Static tier labels under the chart
  const tiers = document.createElement('div');
  tiers.className = 'chart-tiers';
  tiers.innerHTML = [1, 2, 3, 4].map(t => `<div class="bar-tier">Tier ${t}</div>`).join('');
  chart.after(tiers);

  function render(key) {
    const d = data[key];
    chart.innerHTML = [0, 1, 2, 3].map(t => `
      <div class="bar-group">
        <div class="bar" data-h="${d.handloom[t]}" style="background:#5B8DB8"><span class="bar-val">${d.handloom[t]}%</span></div>
        <div class="bar" data-h="${d.trace[t]}" style="background:#E8801A"><span class="bar-val">${d.trace[t]}%</span></div>
      </div>`).join('');
    cap.textContent = d.caption;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      chart.querySelectorAll('.bar').forEach(b => { b.style.height = b.dataset.h + '%'; });
    }));
  }

  btns.forEach(btn => btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.chart);
  }));
  render('clutter');
})();
