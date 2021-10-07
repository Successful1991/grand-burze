import $ from 'jquery';
import Card from './templates/card';
import paginationScroll from './pagination';
import {
  preloader, preloaderWithoutPercent,
} from './general/General';

class Plannings {
  constructor(config, i18n) {
    this.getFlat = config.getFlat;
    this.setFlat = config.setFlat;
    // this.subject = config.subject;
    this.wrap = '.js-s3d-pl__list';
    this.wrapperNode = document.querySelector('.js-s3d-pl__list');
    this.wrapperNotFoundFlat = document.querySelector('.js-s3d-pl__not-found');
    this.activeFlat = config.activeFlat;
    this.currentFilterFlatsId$ = config.currentFilterFlatsId$;
    this.defaultShowingFlats = config.currentFilterFlatsId$.value;
    this.currentShowAmount = 0;
    this.showFlatList = [];
    this.updateFsm = config.updateFsm;
    this.i18n = i18n;
    this.favouritesIds$ = config.favouritesIds$;
    // this.history = conf.history;
    this.preloader = preloader();
    this.preloaderWithoutPercent = preloaderWithoutPercent();
  }

  init() {
    // if (status === 'local') {
    // $.ajax(`${defaultModulePath}template/card.php`).then(response => {
    //   this.templateCard = JSON.parse(response);
    // this.templateCard = Card();
    this.subscribeFilterFlat();
    setTimeout(() => {
      // this.preloader.turnOff($('.js-s3d__select[data-type="plannings"]'));
      this.preloader.hide();
      this.preloaderWithoutPercent.hide();
    }, 600);
    // });
    // } else {
    //   $.ajax('/wp-admin/admin-ajax.php', {
    //     method: 'POST',
    //     data: { action: 'getCard' },
    //   }).then(response => {
    //     this.templateCard = JSON.parse(response);
    //     this.subscribeFilterFlat();
    //     setTimeout(() => {
    //       // this.preloader.turnOff($('.js-s3d__select[data-type="plannings"]'));
    //       this.preloader.hide();
    //       this.preloaderWithoutPercent.hide();
    //     }, 600);
    //   });
    // }

    // this.subject.subscribe(data => {
      // updateFlatFavourite(this.wrap, data);
    // });

    $('.js-s3d-pl__list').on('click', '.js-s3d-card', event => {
      if (event.target.closest('.js-s3d-add__favourite')) {
        return;
      }
      const id = $(event.currentTarget).data('id');
      this.activeFlat = id;
      this.updateFsm({ type: 'flat', id });
    });

    this.wrapperNode.addEventListener('scroll', event => {
      paginationScroll(event.target, this.showFlatList, this.currentShowAmount, this.createListCard.bind(this));
    });
  }

  visibleAvailableContainer(isShowing = false) {
    this.wrapperNotFoundFlat.style.display = isShowing ? '' : 'none';
  }

  subscribeFilterFlat() {
    this.currentFilterFlatsId$.subscribe(flats => {
      this.wrapperNode.scrollTop = 0;
      this.wrapperNode.textContent = '';
      this.currentShowAmount = 0;

      this.updateShowFlat(flats);
      this.visibleAvailableContainer(false);
      if (flats.length === 0) {
        const randomFlats = this.selectRandomAvailableFlats(5);
        this.visibleAvailableContainer(true);
        this.createListCard(randomFlats, this.wrapperNode, 1);
        paginationScroll(this.wrapperNode, randomFlats, this.currentShowAmount, this.createListCard.bind(this));
        return;
      }
      this.createListCard(flats, this.wrapperNode, 1);
      paginationScroll(this.wrapperNode, flats, this.currentShowAmount, this.createListCard.bind(this));
    });
  }

  updateShowFlat(list) {
    this.showFlatList = list;
  }

  createListCard(flats, wrap, amount) {
    flats.forEach((id, index) => {
      if (index >= this.currentShowAmount && index < (this.currentShowAmount + amount)) {
        wrap.insertAdjacentHTML('beforeend', Card(this.i18n, this.getFlat(id), this.favouritesIds$));
      }
    });
    this.currentShowAmount += amount;
  }

  selectRandomAvailableFlats(count = 5) {
    let selectedFlatsCount = 0;
    const selectedFlats = this.defaultShowingFlats.filter(flatId => {
      const flat = this.getFlat(flatId);
      if (flat.sale !== 1 || selectedFlatsCount >= count) return false;
      selectedFlatsCount += 1;
      return true;
    });
    return selectedFlats;
  }
}

export default Plannings;
