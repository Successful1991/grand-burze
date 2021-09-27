import $ from 'jquery';
import Card from './templates/card';
import CreateCard from './createCard';
import paginationScroll from './pagination';
import {
  preloader, updateFlatFavourite, preloaderWithoutPercent,
} from './general/General';

class Plannings {
  constructor(conf) {
    this.getFlat = conf.getFlat;
    this.setFlat = conf.setFlat;
    this.subject = conf.subject;
    this.wrap = '.js-s3d-pl__list';
    this.wrapperNode = document.querySelector('.js-s3d-pl__list');
    this.wrapperNotFoundFlat = document.querySelector('.js-s3d-pl__not-found');
    this.activeFlat = conf.activeFlat;
    this.currentFilterFlatsId$ = conf.currentFilterFlatsId$;
    this.defaultShowingFlats = conf.currentFilterFlatsId$.value;
    this.currentShowAmount = 0;
    this.showFlatList = [];
    this.updateFsm = conf.updateFsm;
    // this.history = conf.history;
    this.preloader = preloader();
    this.preloaderWithoutPercent = preloaderWithoutPercent();
  }

  init() {
    if (status === 'local') {
      // $.ajax(`${defaultModulePath}template/card.php`).then(response => {
      //   this.templateCard = JSON.parse(response);
      this.templateCard = Card();
      this.subscribeFilterFlat();
      setTimeout(() => {
        // this.preloader.turnOff($('.js-s3d__select[data-type="plannings"]'));
        this.preloader.hide();
        this.preloaderWithoutPercent.hide();
      }, 600);
      // });
    } else {
      $.ajax('/wp-admin/admin-ajax.php', {
        method: 'POST',
        data: { action: 'getCard' },
      }).then(response => {
        this.templateCard = JSON.parse(response);
        this.subscribeFilterFlat();
        setTimeout(() => {
          // this.preloader.turnOff($('.js-s3d__select[data-type="plannings"]'));
          this.preloader.hide();
          this.preloaderWithoutPercent.hide();
        }, 600);
      });
    }

    this.subject.subscribe(data => {
      updateFlatFavourite(this.wrap, data);
    });

    $('.js-s3d-pl__list').on('click', '.js-s3d-card', event => {
      if (event.target.closest('.js-s3d-add__favourite')) {
        return;
      }
      console.log(event.currentTarget);
      const id = $(event.currentTarget).data('id');
      this.activeFlat = id;
      console.log('card click and translate');
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
    const arr = flats.reduce((previous, current, index) => {
      if (index >= this.currentShowAmount && index < (this.currentShowAmount + amount)) {
        const node = $.parseHTML(this.templateCard)[0];
        // debugger;
        previous.push(CreateCard(this.getFlat(+current), node));
      }
      return previous;
    }, []);
    this.currentShowAmount += amount;
    wrap.append(...arr);
  }

  // createCard(el) {
  //   const checked = el.favourite ? 'checked' : '';
  //   const div = $.parseHTML(this.templateCard)[0];
  //   div.dataset.id = el.id;
  //
  //   const typeEl = div.querySelector('[data-key="type"]');
  //   const idEl = div.querySelector('[data-key="id"]');
  //   const numberEl = div.querySelector('[data-key="number"]');
  //   const floorEl = div.querySelector('[data-key="floor"]');
  //   const roomsEl = div.querySelector('[data-key="rooms"]');
  //   const areaEl = div.querySelector('[data-key="area"]');
  //   const srcEl = div.querySelector('[data-key="src"]');
  //   if (typeEl) {
  //     typeEl.innerHTML = el.type || '-';
  //   }
  //   if (idEl) {
  //     idEl.dataset.id = el.id || null;
  //   }
  //   if (numberEl) {
  //     numberEl.innerHTML = el.number || '-';
  //   }
  //   if (floorEl) {
  //     floorEl.innerHTML = el.floor || '-';
  //   }
  //   if (roomsEl) {
  //     roomsEl.innerHTML = el.rooms || '-';
  //   }
  //   if (areaEl) {
  //     areaEl.innerHTML = el.area || '-';
  //   }
  //   if (srcEl) {
  //     srcEl.src = el['img_small'] || `${defaultProjectPath}/s3d/images/examples/no-image.png`;
  //   }
  //
  //   div.querySelector('[data-key="checked"]').checked = checked;
  //
  //   return div;
  // }

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
