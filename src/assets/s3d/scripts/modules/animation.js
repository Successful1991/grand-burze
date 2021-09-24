import { gsap, Power1, TimelineMax } from 'gsap';

function addAnimateBtnTabs(el) {
  const elements = typeof el === 'string' ? document.querySelectorAll(el) : el;
  if (!elements) return;
  const wrap = elements[0].parentElement;
  const svg = document.querySelector('.js-s3d__btn-tab-svg');

  const input = wrap.querySelector('input:checked');
  const activeBtn = input.closest('label');
  const width = activeBtn.offsetWidth;
  const left = activeBtn.offsetLeft;
  svg.style = `left: ${left}px;width: ${width}px;`;

  wrap.addEventListener('change', event => {
    const button = event.target.closest('label');
    animateBtn(svg, button);
  });
}

function animateBtn(svg, elem) {
  const currentLeft = svg.offsetLeft;
  const currentWidth = svg.offsetWidth;
  const nextLeft = elem.offsetLeft;
  const nextWidth = elem.offsetWidth;
  // const next = elem.getBoundingClientRect();
  // const prev = svg.getBoundingClientRect();
  const currentEnd = currentLeft + currentWidth;
  const nextEnd = nextLeft + nextWidth;
  const newWidth = currentEnd > nextEnd ? currentEnd : nextEnd;
  const newLeft = currentLeft < nextLeft ? currentLeft : nextLeft;
  console.log(newWidth);
  console.log(newLeft);
  console.log('nextLeft', nextLeft);
  console.log('nextWidth', nextWidth);
  // svg.style = `left: ${newLeft}px;width: ${newWidth}px`;
  const tl = new TimelineMax();
  tl.to(svg, {
    left: newLeft - 10,
    width: newWidth + 20,
    duration: 0.3,
    ease: Power1.easeInOut,
  });
  tl.to(svg, {
    left: nextLeft - 10,
    width: nextWidth + 20,
    duration: 0.4,
    ease: Power1.easeInOut,
  }, '>');
}

export default addAnimateBtnTabs;
