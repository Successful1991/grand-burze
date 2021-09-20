import $ from 'jquery';
import EventEmitter from '../eventEmitter/EventEmitter';
import Svg from '../Svg';

class SliderView extends EventEmitter {
  constructor(model, elements) {
    super();
    this._model = model;
    this._elements = elements;

    this.wrapper = $(elements.wrapper);

    // attach model listeners
    model.on('hideActiveSvg', () => { this.hideActiveSvg(); });
    model.on('showActiveSvg', () => { this.showActiveSvg(); });
    model.on('changeSvgActive', svg => { this.updateSvgActive(svg); });
    model.on('changeFlatActive', svg => { this.updateFlatActive(svg); });
    model.on('removeSvgFlatActive', () => { this.removeSvgFlatActive(); });
    model.on('updateLoaderProgress', amount => { this.updatePreloaderPercent(amount); });
    model.on('progressBarHide', () => { this.progressBarHide(); });

    model.on('createSvg', config => { this.createSvg(config); });
    model.on('changeSvg', (config, type) => { this.changeSvg(config, type); });
    model.on('createBackground', () => { this.createBackground(); });
    model.on('createArrow', () => { this.createArrow(); });

    // attach listeners to HTML controls
    this.wrapper.on('mousedown', event => {
      this.emit('mouseKeyDown', event);
    });
    this.wrapper.on('mousemove', elements.wrapperEvent, event => {
      this.emit('mouseMove', event);
    });
    this.wrapper.on('mouseup mouseleave', event => {
      this.emit('mouseKeyUp', event);
    });
    this.wrapper.on('click touch', 'polygon', event => {
      this.emit('touchPolygon', event);
    });
    window.addEventListener('keydown', event => {
      this.emit('keyPress', event);
    });
  }

  hideActiveSvg() {
    this._model.getSvgActive().css({ opacity: 0 });
  }

  showActiveSvg() {
    this._model.getSvgActive().css({ opacity: 1 });
  }

  updateSvgActive(svg) {
    this._model.wrapper.find('.s3d__svg__active').removeClass('s3d__svg__active');
    svg.addClass('s3d__svg__active');
  }

  updateFlatActive(data) {
    console.trace();
    const { id, house, floor } = data;
    this.removeSvgFlatActive();

    if (id) {
      $(`.js-s3d__svgWrap [data-id=${id}]`).addClass('active-flat');
    } else {
      $(`.js-s3d__svgWrap [data-house=${house}][data-floor=${floor}]`).addClass('active-flat');
    }
  }

  removeSvgFlatActive() {
    $('.js-s3d__svgWrap .active-flat').removeClass('active-flat');
  }

  updatePreloaderPercent(percent) {
    $('.fs-preloader-amount').html(Math.ceil(percent));
  }

  progressBarHide() {
    $('.fs-preloader').removeClass('preloader-active');
  }

  // инициализация svg слайдера
  createSvg(sliderModule) {
    const svg = new Svg(sliderModule);
    svg.init();
  }

  changeSvg(config) {
    this.wrapper.find('.s3d__svg-container').remove();
    this.createSvg(config);
  }

  createArrow() {
    const arrowLeft = createMarkup('button', { class: 's3d__button s3d__button-left js-s3d__button-left unselectable', content: '<svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 1L1 7.5L7.5 14"/></svg>' });
    arrowLeft.dataset.type = 'prev';

    const arrowRight = createMarkup('button', { class: 's3d__button s3d__button-right js-s3d__button-right unselectable', content: '<svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 1L7 7.5L0.5 14"/></svg>' });
    arrowRight.dataset.type = 'next';

    this.wrapper.append(arrowLeft);
    arrowLeft.addEventListener('click', event => this._model.checkDirectionRotate(event.target.dataset.type));
    this.wrapper.append(arrowRight);
    arrowRight.addEventListener('click', event => this._model.checkDirectionRotate(event.target.dataset.type));
  }

  createBackground() {
    const top = createMarkup('div', { class: 's3d__slider__bg s3d__slider__bg-top' });
    const bottom = createMarkup('div', { class: 's3d__slider__bg s3d__slider__bg-bottom' });
    this._model.wrapper.append(top);
    this._model.wrapper.append(bottom);
  }
}


export default SliderView;
