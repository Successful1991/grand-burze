import $ from 'jquery';
import _ from 'lodash';
import magnificPopup from 'magnific-popup';
import EventEmitter from '../eventEmitter/EventEmitter';
import {
  addBlur, unActive, preloader, updateFlatFavourite, compass, debounce,
} from '../general/General';
import asyncRequest from '../async/async';

class FlatModel extends EventEmitter {
  constructor(config) {
    super();
    this.type = config.type;
    this.id = config.id;
    this.changeViewBlock = config.changeViewBlock;
    this.imagesKeys = config.imagesKeys;
    this.generalWrapId = config.generalWrapId;
    this.activeFlat = config.activeFlat;
    this.hoverFlatId$ = config.hoverFlatId$;
    this.getFavourites = config.getFavourites;
    this.getFlat = config.getFlat;
    this.updateFsm = config.updateFsm;
    this.history = config.history;
    this.createWrap();
    this.wrapper = $(`.js-s3d__wrapper__${this.type}`);

    this.imagesType = '';
    this.imagesViewType = '';
  }

  init(config) {
    this.preloader = preloader();
    // получаем разметку квартиры с планом этажа
    this.activeFlat = +config.flatId;
    this.getPlane(config);
  }

  createWrap() {
    // все 3 обертки нужны, без них на мобилке пропадает прокрутка и всё ломается
    const wrap1 = createMarkup('div', { class: `s3d__wrap js-s3d__wrapper__${this.type} s3d__wrapper__${this.type}` });// const wrap2 = createMarkup(conf.typeCreateBlock, { id: `js-s3d__${conf.id}` })
    $(this.generalWrapId).append(wrap1);
  }

  update(config) {
    this.activeFlat = +config.flatId;
    this.getPlane(config);
  }

  // получаем разметку квартиры с планом этажа
  getPlane(config) {
    if (status === 'prod' || status === 'dev') {
      asyncRequest({
        url: '/wp-admin/admin-ajax.php',
        data: {
          method: 'POST',
          data: `action=createFlat&id=${config.activeFlat}`,
        },
        callback: this.setPlaneInPage,
      });
    } else {
      $.ajax('/wp-content/themes/template/assets/s3d/template/flat.php').then(response => {
        this.setPlaneInPage(response);
      });
    }
  }

  // вставляем разметку в DOM вешаем эвенты
  setPlaneInPage(response) {
    this.emit('setHtml', JSON.parse(response));
    this.checkPlaning();
    this.checkFavouriteApart();
    $('.js-s3d-flat__image').magnificPopup({
      type: 'image',
      showCloseBtn: true,
    });

    setTimeout(() => {
      this.preloader.turnOff($('.js-s3d__select[data-type="flat"]'));
      this.preloader.hide();
    }, 600);
  }

  radioTypeHandler(types) {
    const imgUrlObj = this.getFlat(this.activeFlat).images[types];
    this.imagesType = types;
    this.emit('showViewButton', false);
    const keys = Object.keys(imgUrlObj);
    if (keys.length > 1) {
      this.emit('showViewButton', true);
    }
    $(`.js-s3d__radio-view [value=${keys[0]}]`).prop('checked', true);
    this.radioViewHandler(keys[0]);
  }

  getNewFlat(id) {
    if (status === 'prod' || status === 'dev') {
      asyncRequest({
        url: '/wp-admin/admin-ajax.php',
        data: {
          method: 'POST',
          data: `action=halfOfFlat&id=${id}`,
        },
        callback: response => {
          this.updateFlat(JSON.parse(response), id);
        },
      });
    } else {
      console.log('запрос для замены квартиры');
    }
  }

  updateFlat(flat, id) {
    this.activeFlat = id;
    this.hoverFlatId$.next(id);
    this.emit('updateHtmlFlat', { flat, id });
    this.checkPlaning();
    this.checkFavouriteApart();
  }

  checkFavouriteApart() {
    const favourite = this.getFavourites();
    // if (favourite.length > 0) {
    //   $('.s3d-flat__favourites').removeClass('s3d-hidden');
    //   $('.js-s3d-favourites-amount').html(favourite.length);
    // }

    $('.s3d-flat__like input').prop('checked', favourite.includes(+this.activeFlat));
  }

  checkPlaning() {
    this.emit('changeClassShow', { element: '.js-s3d-flat .show', flag: false });
    const flat = this.getFlat(this.activeFlat);
    const size = _.size(flat.images);
    const keys = Object.keys(flat.images);
    if (keys.length === 0) {
      return;
    }

    this.imagesType = keys[0];
    this.imagesViewType = Object.keys(flat.images[keys[0]])[0];
    if (size > 1) {
      for (const imageKey in flat.images) {
        this.emit('createRadioElement', {
          wrap: '.js-s3d-flat__buttons-type',
          type: imageKey,
          name: 'type',
          text: imageKey,
        });
      }
    }

    $(`.js-s3d__radio-type[data-type=${this.imagesType}] input`).prop('checked', true);
    this.radioTypeHandler(this.imagesType);
  }

  radioViewHandler(viewType) {
    this.imagesViewType = viewType;
    const obj = this.getFlat(this.activeFlat).images;
    const image = obj[this.imagesType][viewType];
    const checked = $('.js-s3d__radio-view-change input');
    if (viewType === '2d') {
      checked.prop('checked', false);
    } else {
      checked.prop('checked', true);
    }

    this.emit('updateImg', image);
  }

  radioCheckedHandler(value) {
    if (value) {
      $('.js-s3d__radio-view[data-type="3d"]').click();
    } else {
      $('.js-s3d__radio-view[data-type="2d"]').click();
    }
  }

  updateMiniInfo(event) {
    if (event.currentTarget && event.currentTarget.hasAttribute('data-id')) {
      this.emit('updateDataFlats', this.getFlat(+event.currentTarget.dataset.id));
    } else {
      this.emit('updateDataFlats', this.getFlat(this.activeFlat));
    }
  }
}

export default FlatModel;