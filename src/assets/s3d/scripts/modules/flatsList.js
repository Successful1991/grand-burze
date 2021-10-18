import $ from 'jquery';
import _ from 'lodash';
import paginationScroll from './pagination';
import sortArray from './sort';

class FlatsList {
  constructor(config) {
    // this.subject = config.subject;
    this.hoverData$ = config.hoverData$;
    this.currentFilterFlatsId$ = config.currentFilterFlatsId$;
    this.updateCurrentFilterFlatsId = config.updateCurrentFilterFlatsId;
    this.getFlat = config.getFlat;
    this.checkNextFlyby = config.checkNextFlyby;
    this.changePopupFlyby = config.changePopupFlyby;
    this.currentShowAmount = 0;
    this.showFlatList = [];
    this.wrapperNode = document.querySelector('.js-s3d-filter__table');
    this.updateFsm = config.updateFsm;
    this.filterHide = false;
    // this.nameSort = undefined;
    this.directionSortUp = true;
    this.filter = config.filter;
    this.favouritesIds$ = config.favouritesIds$;
    this.init();
  }

  init() {
    const filterContainer = document.querySelector('.js-s3d-filter');
    const tableContainer = document.querySelector('.js-s3d-filter__table');
    const bodyContainer = document.querySelector('.js-s3d-filter__body');

    this.currentFilterFlatsId$.subscribe(value => {
      // if (_.isArray(value) && value.length > 0) {
      tableContainer.scrollTop = 0;
      bodyContainer.textContent = '';
      this.currentShowAmount = 0;
      // }
      this.updateShowFlat(value);
      this.createListFlat(value, bodyContainer, 30);
    });

    this.hoverData$.subscribe(data => {
      const { id } = data;
      if (!id) return;
      this.setActiveFlat(id);
    });

    tableContainer.addEventListener('scroll', event => {
      if (event.target.scrollTop > 50 && !this.filterHide) {
        filterContainer.classList.add('s3d-filter__scroll-active');
        setTimeout(() => { this.filterHide = true; }, 500);
      } else if (event.target.scrollTop < 50 && this.filterHide) {
        filterContainer.classList.remove('s3d-filter__scroll-active');
        setTimeout(() => { this.filterHide = false; }, 500);
      }
      paginationScroll(event.target, this.showFlatList, this.currentShowAmount, this.createListFlat.bind(this));
    });

    $('.js-s3d-filter__mini-info__button').on('click', event => {
      filterContainer.classList.remove('s3d-filter__scroll-active');
      setTimeout(() => this.filterHide = false, 500);
    });

    $('.js-s3d-filter__body').on('click', '.s3d-filter__tr', event => {
      const id = +event.currentTarget.dataset.id;
      if (
        $(event.originalEvent.target).hasClass('js-s3d-add__favourite')
        || event.originalEvent.target.nodeName === 'INPUT') {
        return;
      }

      const config = this.checkNextFlyby({ type: 'flyby', method: 'search' }, id);
      if (config === null) {
        return null;
      }
      if (config.change) {
        this.changePopupFlyby(config, event.currentTarget);
        return;
      }

      if (window.innerWidth <= 992) {
        this.filter.emit('hideFilter');
      }
      this.updateFsm(config, id);
    });

    $('.js-s3d-filter__head').on('click', '.s3d-filter__th', e => {
      const nameSort = (e.currentTarget && e.currentTarget.dataset && _.has(e.currentTarget.dataset, 'sort')) ? e.currentTarget.dataset.sort : undefined;

      if (_.isUndefined(nameSort) || (nameSort && nameSort === 'none')) {
        return;
      }
      if (e.currentTarget.classList.contains('s3d-sort-active')) {
        this.directionSortUp = !this.directionSortUp;
      } else {
        this.directionSortUp = true;
      }
      $('.s3d-sort-active').removeClass('s3d-sort-active');
      if (this.directionSortUp) {
        $(e.currentTarget).addClass('s3d-sort-active');
      }

      this.updateCurrentFilterFlatsId(sortArray(this.showFlatList, nameSort, this.getFlat, this.directionSortUp));
    });
  }

  setActiveFlat(id) {
    $('.js-s3d-filter__body .active-flat').removeClass('active-flat');
    $(`.js-s3d-filter__body [data-id=${id}]`).addClass('active-flat');
  }

  updateShowFlat(list) {
    this.showFlatList = list;
  }

  createListFlat(flats, wrap, amount) {
    const favourites = this.favouritesIds$.value;
    const arr = flats.reduce((previous, current, index) => {
      if (index >= this.currentShowAmount && index < (this.currentShowAmount + amount)) {
        previous.push(this.createElem(this.getFlat(+current), favourites));
      }
      return previous;
    }, []);

    this.currentShowAmount += amount;
    document.querySelector('.js-s3d-filter__body').append(...arr);

    const { id } = this.hoverData$.value;
    if (!id) return;
    this.setActiveFlat(id);
  }

  createElem(flat, favourites) {
    const checked = favourites.includes(+flat.id) ? 'checked' : '';
    const tr = document.createElement('tr');
    tr.dataset.id = flat.id;
    tr.classList = 's3d-filter__tr js-s3d-filter__tr';
    tr.innerHTML = `
          <td class="s3d-filter__th--offset"></td>
					<td class="s3d-filter__td">${flat.type || '-'}</td>
					<td class="s3d-filter__td">${flat.rooms}</td>
					<td class="s3d-filter__td">${flat.floor}</td>
					<td class="s3d-filter__td">${flat.area} m<sup>2</sup></td>
					<td class="s3d-filter__td">
						<label data-id="${flat.id}" class="s3d__favourite s3d-filter__favourite js-s3d-add__favourite">
							<input type="checkbox" ${checked}>
							<svg role="presentation"><use xlink:href="#icon-favourites"></use></svg>
						</label>
					</td>
					<td class="s3d-filter__th--offset"></td>
			`;
    return tr;
  }
}

export default FlatsList;
