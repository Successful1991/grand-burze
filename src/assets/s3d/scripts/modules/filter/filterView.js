import $ from 'jquery';
import { Power1, TimelineMax } from 'gsap';
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
    $('#resetFilter-mobile').on('click', () => {
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
      this.emit('reduceFilterHandler');
    });

    $('.js-s3d-ctr__filter').on('click', event => {
      event.preventDefault();
      this.emit('reduceFilterHandler', false);
      this.show();
    });

    window.addEventListener('resize', () => {
      this.emit('resizeHandler');
      this.hidden();
      this.filterTopHeight = document.querySelector('.s3d-filter__top').offsetHeight;
      this.updateHeightFilter();
    });

    model.on('hideFilter', () => { this.hidden(); });
    model.on('setAmountAllFlat', data => { this.setAmountAllFlat(data); });
    model.on('setAmountSelectFlat', data => { this.setAmountSelectFlat(data); });
    model.on('updateMiniInfo', data => { this.updateMiniInfo(data); });
    model.on('updateHeightFilter', () => { this.updateHeightFilter(); });
    model.on('reduceFilter', state => { this.changeHeightFilterBlock(state); });
  }

  updateHeightFilter() {
    const filterTopContainer = document.querySelector('.s3d-filter__top');
    filterTopContainer.style.height = 'auto';
    this.filterTopHeight = filterTopContainer.offsetHeight;
    filterTopContainer.style.height = `${this.filterTopHeight}px`;
  }

  // показать фильтр
  show() {
    $('.js-s3d-filter').addClass('s3d-open-filter');
  }

  // спрятать фильтр
  hidden() {
    $('.js-s3d-filter').removeClass('s3d-open-filter');
  }

  setAmountAllFlat(value) {
    $('.js-s3d__amount-flat__num-all').html(value);
  }

  // установить кол-во наденных квартир
  setAmountSelectFlat(amount) {
    $('.js-s3d__amount-flat__num').html(amount);
  }

  // filteredPolygonRemoveClass() {
  //   $('.js-s3d__svgWrap .polygon__filter-select').removeClass('polygon__filter-select');
  // }
  //
  // // подсвечивает квартиры на svg облёта
  // showSelectedFlats(flats) {
  //   flats.forEach(id => {
  //     const floorPolygon = document.querySelectorAll(`#js-s3d__wrapper polygon[data-id="${id}"]`);
  //     floorPolygon.forEach(poly => poly.classList.add('polygon__filter-select'));
  //   });
  //
  //   // $('#js-s3d__wrapper polygon.polygon__filter-select').removeClass('polygon__filter-select');
  //   // flats.forEach(flat => {
  //   //   $(`#js-s3d__wrapper polygon[data-id=${flat.id || +flat}]`).addClass('polygon__filter-select');
  //   // });
  // }
  //
  // showSelectedFloors(floors) {
  //   // const floorPolygons = document.querySelectorAll('#js-s3d__wrapper polygon.polygon__filter-select');
  //   // floorPolygons.forEach(poly => poly.classList.remove('polygon__filter-select'));
  //   floors.forEach(floorData => {
  //     const { build, section, floor } = floorData;
  //     const floorPolygon = document.querySelectorAll(`#js-s3d__wrapper polygon[data-build="${build}"][data-section="${section}"][data-floor="${floor}"]`);
  //     floorPolygon.forEach(poly => poly.classList.add('polygon__filter-select'));
  //   });
  //
  //   // $('#js-s3d__wrapper polygon.polygon__filter-select').removeClass('polygon__filter-select');
  //   // flats.forEach(flat => {
  //   //   $(`#js-s3d__wrapper polygon[data-id=${flat.id || +flat}]`).addClass('polygon__filter-select');
  //   // });
  // }

  updateMiniInfo(data) {
    const { value, type, key } = data;
    const wrap = $(`.js-s3d-filter__mini-info [data-type=${type}]`);
    wrap.find(`[data-type=${key}]`).html(value);
  }

  changeHeightFilterBlock(state) {
    const elements = {
      filter: document.querySelector('.js-s3d-filter'),
      filterTop: document.querySelector('.s3d-filter__top'),
      miniInfo: document.querySelector('.js-s3d-filter__mini-info'),
      btn: document.querySelector('#hideFilter'),
    };

    const filterScrollHandler = state ? 'filterScrollActive' : 'filterScrollUnActive';
    this[filterScrollHandler](elements);
  }

  filterScrollActive(elements) {
    const {
      btn,
      filter,
      filterTop,
      miniInfo,
    } = elements;
    const tl = new TimelineMax();
    const paddingBottom = getComputedStyle(filterTop).getPropertyValue('--filter-title-height');
    const heightMiniInfo = getComputedStyle(miniInfo).getPropertyValue('--mini-info-height');
    btn.innerText = btn.dataset.showText;
    filter.classList.add('s3d-filter__scroll-active');
    tl.to(filterTop, {
      height: 0,
      paddingBottom,
      duration: 0.4,
      ease: Power1.easeInOut,
    }).to(miniInfo, {
      height: heightMiniInfo,
      opacity: 1,
      duration: 0.4,
      ease: Power1.easeInOut,
    }, '<').eventCallback('onComplete', () => {
      this.emit('changeListScrollBlocked', false);
    });
  }

  filterScrollUnActive(elements) {
    const {
      btn,
      filter,
      filterTop,
      miniInfo,
    } = elements;
    const tl = new TimelineMax();
    btn.innerText = btn.dataset.hideText;
    filter.classList.remove('s3d-filter__scroll-active');
    tl.to(filterTop, {
      height: this.filterTopHeight,
      paddingBottom: 0,
      duration: 0.4,
      ease: Power1.easeInOut,
    }).to(miniInfo, {
      height: 0,
      opacity: 0,
      duration: 0.4,
      ease: Power1.easeInOut,
    }, '<').eventCallback('onComplete', () => {
      setTimeout(() => {
        this.emit('changeListScrollBlocked', false);
      }, 400);
    });
  }
}

export default FilterView;
