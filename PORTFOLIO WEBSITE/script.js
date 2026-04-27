/* ── THEME ── */
const html      = document.documentElement;
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

// load saved theme (default: dark)
const saved = localStorage.getItem('pm-theme') || 'dark';
html.setAttribute('data-theme', saved);
themeIcon.textContent = saved === 'dark' ? '☀' : '☾';

themeBtn.addEventListener('click', () => {
  const cur  = html.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  themeIcon.textContent = next === 'dark' ? '☀' : '☾';
  localStorage.setItem('pm-theme', next);
});


/* ── SCROLL REVEAL ── */
// generic reveal for .edu-item and .proj
const revealEls = document.querySelectorAll('.edu-item, .proj');

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // stagger slightly based on position in list
      const siblings = [...e.target.parentElement.children];
      const idx = siblings.indexOf(e.target);
      setTimeout(() => {
        e.target.classList.add('visible');
      }, idx * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObs.observe(el));


/* ── SKILLS REVEAL (left-slide) ── */
const skillEls = document.querySelectorAll('.sk');

const skillObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const siblings = [...e.target.parentElement.children];
      const idx = siblings.indexOf(e.target);
      setTimeout(() => {
        e.target.classList.add('visible');
      }, idx * 70);
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

skillEls.forEach(el => skillObs.observe(el));


/* ── COUNTER ANIMATION ── */
const statNums = document.querySelectorAll('.sn[data-target]');

function animateNum(el) {
  const target   = parseFloat(el.dataset.target);
  const isFloat  = el.dataset.float === 'true';
  const duration = 1400;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = eased * target;

    el.textContent = isFloat ? value.toFixed(2) : Math.floor(value);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = isFloat ? target.toFixed(2) : target;
    }
  }

  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateNum(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObs.observe(el));


/* ── ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.hn');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`.hn[href="#${e.target.id}"]`);
      if (active) active.style.color = 'var(--acc)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObs.observe(s));


/* ── SMOOTH HOVER on proj — number color ── */
// already handled via CSS :hover, nothing extra needed


/* ── SUBTLE CURSOR TRAIL (optional, desktop only) ── */
if (window.matchMedia('(pointer: fine)').matches) {
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed;
    width: 6px; height: 6px;
    background: var(--acc);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    mix-blend-mode: difference;
  `;
  document.body.appendChild(trail);

  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    trail.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    trail.style.opacity = '0';
  });

  (function loop() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    trail.style.left = cx + 'px';
    trail.style.top  = cy + 'px';
    requestAnimationFrame(loop);
  })();
}
