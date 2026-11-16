/* PIXTION · studio/watch.js
   While an animation plays and the preview is off screen, a "Watch the animation" pill drops in at the top.
   Tapping it glides down to the preview. Once you are down there, "Back to canvas" takes you up again.
   On phones the canvas also drifts with a gentle parallax as you scroll, and panels rise in as they appear. */
import { $ } from '../core/dom.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const phone = matchMedia('(max-width: 759px)');

let playing = false, pvVisible = true, boardVisible = true;

function studioOpen(){ const s = $('#p-studio'); return !!s && !s.hidden && !s.closest('[hidden]'); }

function update(){
  const open = studioOpen();
  $('#watchPill').classList.toggle('show', open && playing && !pvVisible);
  $('#backPill').classList.toggle('show', open && phone.matches && window.scrollY > 220 && !(playing && !pvVisible));
}

function glide(el, block){
  el.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block });
}

let ticking = false;
function parallax(){
  ticking = false;
  const st = $('#p-studio');
  if (!st || !studioOpen() || !phone.matches || reduce.matches){ st?.style.removeProperty('--par'); return; }
  const y = Math.max(0, Math.min(window.scrollY, 900));
  st.style.setProperty('--par', y.toFixed(1));
  update();
}

export function init(){
  document.body.insertAdjacentHTML('beforeend',
    '<button class="watch-pill" id="watchPill" type="button"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg><span>Watch the animation</span><b aria-hidden="true">↓</b></button>' +
    '<button class="watch-pill back" id="backPill" type="button"><b aria-hidden="true">↑</b><span>Back to canvas</span></button>');

  $('#watchPill').addEventListener('click', () => glide($('[data-o=preview]'), 'start'));
  $('#backPill').addEventListener('click', () => scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' }));

  // follow play / stop from the real Play button
  const btn = $('#playBtn');
  const read = () => { playing = ($('#playBtn span')?.textContent || '').trim() === 'Stop'; update(); };
  new MutationObserver(read).observe(btn, { childList: true, subtree: true, characterData: true });
  read();

  const onSee = es => {
    for (const e of es){
      if (e.target.id === 'pv') pvVisible = e.intersectionRatio > 0.7;
      if (e.target.dataset.o === 'board') boardVisible = e.intersectionRatio > 0.55;
    }
    update();
  };
  // on phones the quick-tools dock covers the bottom of the screen, so it doesn't count as "visible"
  let io;
  const watchAreas = () => {
    io?.disconnect();
    io = new IntersectionObserver(onSee, { threshold: [0, 0.15, 0.35, 0.55, 0.7, 0.85, 1], rootMargin: phone.matches ? '0px 0px -250px 0px' : '0px' });
    io.observe($('#pv'));
    io.observe($('[data-o=board]'));
  };
  watchAreas();
  phone.addEventListener('change', watchAreas);

  // panels below the canvas rise in as they scroll into view
  const rise = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); rise.unobserve(e.target); } }), { threshold: 0.12 });
  if (phone.matches) document.querySelectorAll('#p-studio [data-o]:not([data-o=board]):not([data-o=mframes])').forEach(el => { el.classList.add('rise'); rise.observe(el); });

  addEventListener('scroll', () => { if (!ticking){ ticking = true; requestAnimationFrame(parallax); } }, { passive: true });
  new MutationObserver(() => { update(); parallax(); }).observe($('#p-studio'), { attributes: true, attributeFilter: ['hidden'] });
}
