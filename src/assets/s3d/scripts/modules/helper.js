import $ from 'jquery';
import gsap from 'gsap/gsap-core';
import BezierEasing from 'bezier-easing';
import HelperNode from './templates/helper';

class HelperGif {
  constructor(i18n, countSlides = 3) {
    this.currentWindow = 0;
    this.countSlides = countSlides;
    this.i18n = i18n;
    this.easing = new BezierEasing(0, 1, 1, 0);
    this.animation = gsap.timeline({ duration: 0.4, ease: this.easing });
  }

  async init() {
    document.querySelector('body')
      .insertAdjacentHTML('afterend', HelperNode());

    this.wrap = document.querySelector('.js-s3d__helper-gif-wrap');

    $('.js-s3d__helper-gif__close').on('click', () => {
      this.hiddenHelper();
    });

    $('.js-s3d__helper-gif__link').on('click', () => {
      this.currentWindow++;
      if (this.currentWindow >= this.countSlides) {
        this.hiddenHelper();
        return;
      }
      this.update(this.currentWindow);
    });

    const openHelper = $('.js-s3d-ctr__helper');
    if (_.size(openHelper) > 0) {
      openHelper.on('click', () => {
        this.currentWindow = 0;
        this.update(this.currentWindow);
        setTimeout(() => {
          this.showHelper();
        }, 300);
      });
    }

    if (window.localStorage.getItem('info')) return;
    this.updateContent(0, () => {
      // todo: at the first boot it does not have time to load
      this.triggerGif(this.currentWindow);
    });
    this.wrap.querySelector('[data-all_count]').innerHTML = this.countSlides;
    setTimeout(() => {
      this.showHelper();
    }, 500);
  }

  update(numberSlide) {
    this.updateContent(numberSlide, () => {
      this.triggerGif(this.currentWindow, 'hide');
      this.triggerGif(this.currentWindow + 1);
    });
  }

  showHelper() {
    this.wrap.classList.add('s3d-active');
  }

  hiddenHelper() {
    this.wrap.classList.remove('s3d-active');
    window.localStorage.setItem('info', true);
    this.triggerGif(this.currentWindow, 'hide');
  }

  updateContent(numberSlide, cb) {
    const helper = document.querySelector('.js-s3d__helper-gif');
    helper.dataset.step = this.currentWindow;

    const titleContainer = this.wrap.querySelector('[data-type="title"]');
    const closeContainer = this.wrap.querySelector('[data-type="close"]');
    const groupContainer = this.wrap.querySelector('.s3d__helper-gif__group');
    const countCurrentContainer = this.wrap.querySelector('[data-current_count]');
    const countAllContainer = this.wrap.querySelector('[data-all_count]');

    this.animation
      .fromTo(titleContainer, { opacity: 1 }, { opacity: 0 })
      .fromTo(closeContainer, { opacity: 1 }, { opacity: 0 }, '<')
      .fromTo(groupContainer, { opacity: 1 }, { opacity: 0 }, '<')
      .then(() => {
        titleContainer.innerHTML = this.i18n.t(`Helper.slide-${numberSlide}--title`);
        closeContainer.innerHTML = this.i18n.t('Helper.close');
        countCurrentContainer.innerHTML = this.currentWindow + 1;
        countAllContainer.innerHTML = this.countSlides;
        cb();
        this.animation
          .fromTo(titleContainer, { opacity: 0 }, { opacity: 1 })
          .fromTo(closeContainer, { opacity: 0 }, { opacity: 1 }, '<')
          .fromTo(groupContainer, { opacity: 0 }, { opacity: 1 }, '<');
      }, '>');
  }

  triggerGif(num, type = 'show') {
    const numId = (num > 0) ? num : 1;
    const container = document.getElementById(`animated-svg-${numId}`);
    const easing = new BezierEasing(0, 1, 1, 0);
    const animate = gsap.timeline({ direction: 1.8, ease: easing });
    const prevAlpha = (type === 'hide') ? 1 : 0;
    const pastAlpha = (type === 'hide') ? 0 : 1;

    container.contentDocument
      .querySelector('svg')
      .dispatchEvent(new Event('click'));
    animate.fromTo(container, { autoAlpha: prevAlpha }, { autoAlpha: pastAlpha });
  }
}

export default HelperGif;
