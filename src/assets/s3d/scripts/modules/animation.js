import { gsap, Power1, TimelineMax } from 'gsap';

function getOffset() {
  const width = document.documentElement.offsetWidth;
  const small = 10;
  const middle = 25;
  const large = 30;
  const largest = 40;

  switch (true) {
      case width < 576:
        return small;
      case width < 1440:
        return middle;
      case width < 2100:
        return large;
      default:
        return largest;
  }
}

function addAnimateBtnTabs(el, svgEl) {
  const elements = typeof el === 'string' ? document.querySelectorAll(el) : el;
  const svg = typeof svgEl === 'string' ? document.querySelector(svgEl) : svgEl;
  if (!elements || !svg) return;
  const wrap = elements[0].parentElement;

  const input = wrap.querySelector('input:checked');
  const activeBtn = input.closest('label');
  const width = activeBtn.offsetWidth;
  const left = activeBtn.offsetLeft;

  svg.style = `left: ${left}px;width: ${width}px;`;

  wrap.addEventListener('click', event => {
    const button = event.target.closest('label');
    const offset = 0;
    // const offset = getOffset();
    animateBtn(svg, button, offset);
  });
}

function animateBtn(svg, elem, offset) {
  const currentLeft = svg.offsetLeft;
  const currentWidth = svg.offsetWidth;
  const nextLeft = elem.offsetLeft;
  const nextWidth = elem.offsetWidth;
  const currentEnd = currentLeft + currentWidth;
  const nextEnd = nextLeft + nextWidth;
  const newWidth = currentEnd > nextEnd ? currentEnd : nextEnd;
  const newLeft = currentLeft < nextLeft ? currentLeft : nextLeft;

  const leftOffset = (offset / 2);

  const tl = new TimelineMax();
  tl.to(svg, {
    left: newLeft - leftOffset,
    width: newWidth + offset,
    duration: 0.3,
    ease: Power1.easeInOut,
  });
  tl.to(svg, {
    left: nextLeft - leftOffset,
    width: nextWidth + offset,
    duration: 0.4,
    ease: Power1.easeInOut,
  }, '>');
}

export default addAnimateBtnTabs;
