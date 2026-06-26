// ── Static noise texture (potato friendly, generated once) ──────────
(function () {
  const canvas = document.getElementById('noise');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const SIZE = 256;
  canvas.width = SIZE;
  canvas.height = SIZE;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';

  const img = ctx.createImageData(SIZE, SIZE);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255 | 0;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  // Scale noise via CSS background-size trick — static, zero CPU after init
  canvas.style.backgroundImage = `url(${canvas.toDataURL()})`;
  canvas.style.backgroundSize = '256px 256px';
  canvas.style.backgroundRepeat = 'repeat';
  // We drew it once, don't need to animate
})();


// ── Scroll reveal with stagger ──────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    // Group entries by parent to stagger siblings
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.max(0, idx * 90));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => observer.observe(el));
})();


// ── Nav scroll ──────────────────────────────────────────────────────
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.style.borderBottomColor = window.scrollY > 30
          ? 'rgba(240,240,232,0.12)'
          : 'rgba(240,240,232,0.1)';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


// ── Smooth anchor scroll ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── Pause ticker on hover (accessibility) ────────────────────────────
const tickerInner = document.querySelector('.ticker__inner');
if (tickerInner) {
  tickerInner.parentElement.addEventListener('mouseenter', () => {
    tickerInner.style.animationPlayState = 'paused';
  });
  tickerInner.parentElement.addEventListener('mouseleave', () => {
    tickerInner.style.animationPlayState = 'running';
  });
}
