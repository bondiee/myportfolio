const $ = (s) => document.querySelector(s);
const tabs = [...document.querySelectorAll('.tab')];
tabs.forEach((t, i) =>
  t.addEventListener('click', () => {
    tabs.forEach((x, j) => {
      x.setAttribute('aria-selected', i == j);
      $('#pn' + j).hidden = i != j;
    });
  }),
);
const lb = $('#lb');
document.addEventListener('click', (e) => {
  const b = e.target.closest('.shot');
  if (b) {
    lb.querySelector('img').src = b.querySelector('img').src;
    lb.querySelector('img').alt = b.querySelector('img').alt;
    lb.showModal();
  }
});
// click anywhere (image or backdrop) or press Esc to close
lb.addEventListener('click', () => lb.close());
$('#yr').textContent = new Date().getFullYear();

// ---- motion ----
const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;

// split title
const w = $('#word');
w.innerHTML = [...'Portfolio']
  .map((c, i) => `<span style="animation-delay:${0.15 + i * 0.07}s">${c}</span>`)
  .join('');

// typewriter
const full = 'UI/UX Designer & Visual Storyteller',
  ty = $('#typed');
if (rm) ty.textContent = full;
else {
  let i = 0;
  setTimeout(function t() {
    ty.textContent = full.slice(0, ++i);
    if (i < full.length) setTimeout(t, 45);
  }, 1300);
}

// marquees
const mk = (id, a) => {
  const h = a.map((x) => `<span>${x}</span><span>✦</span>`).join('');
  $(id).innerHTML = h + h;
};
mk('#m1', [
  'UI/UX Design',
  'Graphic Design',
  'Figma',
  'Photoshop',
  'Canva',
  'Visual Storytelling',
  'Prototyping',
  'Social Campaigns',
]);
mk('#m2', [
  'Posters',
  'Infographics',
  'Event Collateral',
  'Brand Systems',
  'Pixel Art',
  'Publication Layouts',
]);

// reveal + counters
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
      e.target.querySelectorAll('[data-n]').forEach((n) => {
        const t = +n.dataset.n;
        let v = 0;
        const id = setInterval(
          () => {
            n.textContent = ++v + (t == 5 ? '+' : '');
            if (v >= t) clearInterval(id);
          },
          rm ? 0 : 140,
        );
      });
    }),
  { threshold: 0.15 },
);
document.querySelectorAll('.rv').forEach((el) => io.observe(el));

// scroll: progress bar + parallax sparkles
const sps = [...document.querySelectorAll('.sp[data-p]')];
addEventListener(
  'scroll',
  () => {
    const y = scrollY;
    $('#bar').style.width = (y / (document.documentElement.scrollHeight - innerHeight)) * 100 + '%';
    if (!rm) sps.forEach((s) => (s.style.translate = `0 ${y * s.dataset.p}px`));
  },
  { passive: true },
);

// fine-pointer effects
if (matchMedia('(pointer:fine)').matches && !rm) {
  const tr = $('#trail');
  let lx = 0,
    ly = 0,
    tx = 0,
    ty2 = 0;
  addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty2 = e.clientY;
    tr.style.opacity = 0.9;
  });
  (function loop() {
    lx += (tx - lx) * 0.18;
    ly += (ty2 - ly) * 0.18;
    tr.style.transform = `translate(${lx + 10}px,${ly + 10}px) rotate(${lx * 0.4}deg)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', (e) => {
    const b = e.target.closest('a,button');
    tr.style.width = b ? '44px' : '26px';
  });
  // tilt
  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.proj .shot:hover').forEach((b) => {
      const r = b.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      b.firstElementChild.style.setProperty('--ry', x * 10 + 'deg');
      b.firstElementChild.style.setProperty('--rx', -y * 10 + 'deg');
    });
  });
  document.addEventListener('mouseout', (e) => {
    const b = e.target.closest('.proj .shot');
    if (b) {
      b.firstElementChild.style.setProperty('--rx', '0deg');
      b.firstElementChild.style.setProperty('--ry', '0deg');
    }
  });
  // magnetic
  document.querySelectorAll('.mag').forEach((m) => {
    m.addEventListener('mousemove', (e) => {
      const r = m.getBoundingClientRect();
      m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    m.addEventListener('mouseleave', () => (m.style.transform = ''));
  });
}

// nav highlight
const secs = ['about', 'ui', 'graphics', 'contact'].map((id) => document.getElementById(id));
secs.forEach((s) =>
  new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting)
          document
            .querySelectorAll('nav ul a')
            .forEach((a) => a.classList.toggle('on', a.getAttribute('href') == '#' + e.target.id));
      }),
    { rootMargin: '-45% 0px -50% 0px' },
  ).observe(s),
);