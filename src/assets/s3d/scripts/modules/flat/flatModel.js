import $ from 'jquery';
import _ from 'lodash';
import magnificPopup from 'magnific-popup';
import addAnimateBtnTabs from '../animation';
import EventEmitter from '../eventEmitter/EventEmitter';
import {
  unActive, preloader, compass, debounce,
} from '../general/General';
import asyncRequest from '../async/async';
import CreateFlat from '../templates/flat';
import createFloorSvg from '../templates/floorSvg';

class FlatModel extends EventEmitter {
  constructor(config, i18n) {
    super();
    this.type = config.type;
    this.generalWrapId = config.generalWrapId;
    this.activeFlat = config.activeFlat;
    this.hoverData$ = config.hoverData$;
    this.getFavourites = config.getFavourites;
    this.updateFavourites = config.updateFavourites;
    this.getFlat = config.getFlat;
    this.updateFsm = config.updateFsm;
    this.floorList$ = config.floorList$;
    this.i18n = i18n;
    this.favouritesIds$ = config.favouritesIds$;
    this.createWrap();
    this.wrapper = document.querySelector(`.js-s3d__wrapper__${this.type}`);
    this.imagesType = '';
    this.imagesViewType = '';
    this.configProject = this.createConfigProject();
  }

  createConfigProject() {
    const { build, section, floor } = this.getFlat(this.activeFlat);
    return {
      build,
      section,
      floor,
    };
  }

  init(config) {
    this.preloader = preloader();
  }

  createWrap() {
    // все 3 обертки нужны, без них на мобилке пропадает прокрутка и всё ломается
    const wrap1 = createMarkup('div', { class: `s3d__wrap js-s3d__wrapper__${this.type} s3d__wrapper__${this.type}` });// const wrap2 = createMarkup(conf.typeCreateBlock, { id: `js-s3d__${conf.id}` })
    $(this.generalWrapId).append(wrap1);
  }

  async update(id) {
    this.activeFlat = id;
    this.setPlaneInPage(this.activeFlat);
    await this.updateFloor();

    setTimeout(() => {
      const btn = document.querySelector('.js-s3d__select[data-type="flat"]');
      this.preloader.turnOff(btn);
      this.preloader.hide();
    }, 600);
  }

  async updateFloor() {
    const floorData = await this.getFloor(this.configProject);
    this.setFloorInPage(floorData.data);

    this.emit('updateActiveFlatInFloor', this.activeFlat);
  }

  preparationFlats(flatsIds) {
    return flatsIds.map(id => this.getFlat(id));
  }

  // вставляем разметку в DOM вешаем эвенты
  setPlaneInPage(flatId) {
    const flat = this.getFlat(+flatId);
    const html = CreateFlat(this.i18n, flat, this.favouritesIds$);

    this.emit('setFlat', html);
    this.checkPlaning();

    $('.js-s3d-flat__image').magnificPopup({
      type: 'image',
      showCloseBtn: true,
    });
    addAnimateBtnTabs('.s3d-flat__button', '.js-s3d__btn-tab-svg');
  }

  radioTypeHandler(types) {
    const imgUrlObj = this.getFlat(this.activeFlat).images[types];
    this.imagesType = types;
    this.emit('changeClassShow', { element: '.js-s3d-flat__buttons-view', flag: false });
    const keys = Object.keys(imgUrlObj);
    if (keys.length > 1) {
      this.emit('changeClassShow', { element: '.js-s3d-flat__buttons-view', flag: true });
    }

    const radioView = document.querySelector(`.js-s3d__radio-view[data-type="${keys[0]}"]`);
    const input = radioView.querySelector('input');

    input.checked = true;
    this.radioViewHandler(keys[0]);
  }

  toFloorPlan() {
    const { build, floor, sec } = this.getFlat(this.activeFlat);
    this.updateFsm({
      type: 'floor',
      build,
      floor,
      sec,
    });
  }

  look3d() {
    this.updateFsm({ type: 'flyby', id: this.activeFlat });
  }

  checkPlaning() {
    this.emit('changeClassShow', { element: '.js-s3d-flat__buttons-view.show', flag: false });
    const flat = this.getFlat(this.activeFlat);
    const size = _.size(flat.images);
    if (size === 0) {
      this.emit('updateImg', '/assets/s3d/images/examples/no-image.png');
      return;
    }

    const keys = Object.keys(flat.images);

    this.imagesType = keys[0];
    this.imagesViewType = Object.keys(flat.images[keys[0]])[0];
    this.emit('clearRadioElement', '.js-s3d-flat__buttons-type');
    if (size > 1) {
      this.emit('createRadioSvg', '.js-s3d-flat__buttons-type');
      for (const imageKey in flat.images) {
        this.emit('createRadioElement', {
          wrap: '.js-s3d-flat__buttons-type',
          type: imageKey,
          name: 'type',
        });
      }
    }

    const radioBtn = document.querySelector(`.js-s3d__radio-type[data-type=${this.imagesType}] input`);
    radioBtn.checked = true;
    this.radioTypeHandler(this.imagesType);
  }

  radioViewHandler(viewType) {
    this.imagesViewType = viewType;
    const obj = this.getFlat(this.activeFlat).images;
    const image = obj[this.imagesType][viewType];
    const checked = document.querySelector('.js-s3d__radio-view-change input');
    const target = document.querySelector(`.js-s3d__radio-view[data-type="${viewType}"] input`);
    target.checked = true;
    if (viewType === '2d') {
      checked.checked = false;
    } else {
      checked.checked = true;
    }
    this.emit('updateImg', image);
  }

  radioCheckedHandler(value) {
    if (value) {
      document.querySelector('.js-s3d__radio-view[data-type="3d"]').click();
    } else {
      document.querySelector('.js-s3d__radio-view[data-type="2d"]').click();
    }
  }

  getFloor(data) {
    if (status === 'local') {
      const floorData = {
        url: '/wp-content/themes/template/assets/s3d/images/examples/floor.png',
        flatsIds: [30, 31, 32, 33, 34, 35, 36, 37],
      };
      return new Promise((resolve, reject) => {
        resolve(floorData);
      });
    } else {
      const test = {
        build: 2,
        section: 5,
        floor: 14,
      };
      const config = {
        action: 'getFloor',
        ...test,
        // ...data,
      };
      return asyncRequest({
        url: '/wp-admin/admin-ajax.php',
        method: 'post',
        data: config,
      });
    }
  }

  setFloorInPage(response) {
    const { url, flatsIds } = response;
    const preparedFlats = this.preparationFlats(flatsIds);
    const floorSvg = createFloorSvg(this.i18n, url, preparedFlats);
    this.emit('removeFloorSvg');
    this.emit('setFloor', floorSvg);
    this.emit('updateFloorNav', this.configProject.floor);
  }

  changeFloorHandler(direction) {
    const currentFloor = this.configProject.floor;
    // eslint-disable-next-line radix
    const nextFloor = parseInt(currentFloor) + (direction === 'next' ? 1 : -1);

    this.configProject = {
      ...this.configProject,
      floor: nextFloor,
    };

    this.updateFloor();
  }

  getPdfLink(id) {
    asyncRequest('/wp-admin/admin-ajax.php', {
      method: 'POST',
      data: {
        action: 'createPdf',
        id,
      },
    })
      .then(resp => JSON.parse(resp))
      .then(url => {
        const pdfLink = document.querySelector('.initClickPdf');
        if (pdfLink) {
          pdfLink.remove();
        }
        document.body.insertAdjacentHTML('beforebegin', `<a class="initClickPdf" target="_blank" href="${url}"></a>`);
        document.querySelector('.initClickPdf').click();
      });
  }
}

export default FlatModel;
