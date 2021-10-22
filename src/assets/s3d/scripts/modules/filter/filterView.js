import $ from 'jquery';
import EventEmitter from '../eventEmitter/EventEmitter';

class FilterView extends EventEmitter {
  constructor(model, elements) {
    super();
    this._model = model;
    this._elements = elements;
    this.filterTopHeight = document.querySelector('.s3d-filter__top').offsetHeight;

    $('#resetFilter').on('click', () => {
      this.emit('resetFilter');
    });
    $('.js-s3d-filter__close').on('click', () => {
      this.hidden();
    });
    $('.js-s3d-filter').on('click', '.js-s3d-filter__button--apply', () => {
      this.hidden();
    });

    $('.js-s3d-filter__checkboxes').on('click', 'input', () => {
      this.emit('changeFilterHandler');
    });

    $('#hideFilter').on('click', () => {
      // this.hideFilterBlock();
      this.emit('reduceFilterHandler');
    });

    $('.js-s3d-ctr__filter').on('click', event => {
      event.preventDefault();
      this.show();
    });

    $(window).resize(() => {
      this.emit('resizeHandler');
      this.filterTopHeight = document.querySelector('.s3d-filter__top').offsetHeight;
    });

    model.on('showSelectElements', data => { this.showSvgSelect(data); });
    model.on('hideSelectElements', () => { this.hideSvgSelect(); });
    model.on('hideFilter', () => { this.hidden(); });
    model.on('setAmountAllFlat', data => { this.setAmountAllFlat(data); });
    model.on('setAmountSelectFlat', data => { this.setAmountSelectFlat(data); });
    model.on('updateMiniInfo', data => { this.updateMiniInfo(data); });
    model.on('updateHeightFilter', () => { this.updateHeightFilter(); });
    model.on('reduceFilter', state => { this.changeHeightFilterBlock(state); });
  }

  updateHeightFilter() {
    const filterTopContainer = document.querySelector('.s3d-filter__top');
    this.filterTopHeight = filterTopContainer.offsetHeight;
    filterTopContainer.style.height = `${this.filterTopHeight}px`;
    // $('.s3d-filter__top').css('height', this.filterTopHeight);
  }

  // показать фильтр
  show() {
    $('.s3d-filter__top').css('height', this.filterTopHeight);
    $('.js-s3d-filter').addClass('s3d-open-filter');
  }

  // спрятать фильтр
  hidden() {
    $('.js-s3d-filter').removeClass('s3d-open-filter');
    $('.s3d-filter__top').css('height', '');
  }

  setAmountAllFlat(value) {
    $('.js-s3d__amount-flat__num-all').html(value);
  }

  // установить кол-во наденных квартир
  setAmountSelectFlat(amount) {
    $('.js-s3d__amount-flat__num').html(amount);
  }

  hideSvgSelect() {
    $('.js-s3d__svgWrap .active-selected').removeClass('active-selected');
  }

  // подсвечивает квартиры на svg облёта
  showSvgSelect(data) {
    $('#js-s3d__wrapper polygon.active-selected').removeClass('active-selected');
    data.forEach(flat => {
      $(`#js-s3d__wrapper polygon[data-id=${flat.id || +flat}]`).addClass('active-selected');
    });
  }

  updateMiniInfo(data) {
    const { value, type, key } = data;
    const wrap = $(`.js-s3d-filter__mini-info [data-type=${type}]`);
    wrap.find(`[data-type=${key}]`).html(value);
  }

  changeHeightFilterBlock(state) {
    const filter = document.querySelector('.js-s3d-filter');
    const btn = filter.querySelector('#hideFilter');
    if (state) {
      btn.innerText = btn.dataset.showText;
      filter.classList.add('s3d-filter__scroll-active');
      return;
    }
    btn.innerText = btn.dataset.hideText;
    filter.classList.remove('s3d-filter__scroll-active');
  }
}

export default FilterView;
