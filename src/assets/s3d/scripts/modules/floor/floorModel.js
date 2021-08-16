import $ from 'jquery';
import EventEmitter from '../eventEmitter/EventEmitter';
import {
  preloader, preloaderWithoutPercent,
} from '../general/General';
import asyncRequest from '../async/async';

class Floor extends EventEmitter {
  constructor(data) {
    super();
    this.type = data.type;
    this.id = data.id;
    this.getFlat = data.getFlat;
    this.generalWrapId = data.generalWrapId;
    this.createWrap();
    this.wrapper = $(`.js-s3d__wrapper__${this.type}`);
    this.history = data.history;
    this.updateFsm = data.updateFsm;
    this.configProject = data.settings;
    this.preloader = preloader();
    this.preloaderWithoutPercent = preloaderWithoutPercent();
  }

  init() {
    this.getFloor(this.configProject);
  }

  update(config) {
    this.activeFlat = +config.flatId;
    this.getFloor(config);
  }

  createWrap() {
    const wrap1 = createMarkup('div', { class: `s3d__wrap js-s3d__wrapper__${this.type} s3d__wrapper__${this.type}` });
    $(this.generalWrapId).append(wrap1);
  }

  setPlaneInPage(response) {
    this.emit('setHtml', response);
    // this.setHtml(response);

    setTimeout(() => {
      this.preloader.turnOff($('.js-s3d__select[data-type="floor"]'));
      this.preloader.hide();
      this.preloaderWithoutPercent.hide();
    }, 600);
  }

  getFloor(data) {
    if (status === 'prod' || status === 'dev') {
      const dat = `action=getFloor&house=${data.house}&floor=${data.floor}`;
      asyncRequest({
        url: '/wp-admin/admin-ajax.php',
        data: {
          method: 'POST',
          data: `action=createFlat&id=${config.activeFlat}`,
        },
        callbacks: this.setPlaneInPage.bind(this),
      });
    } else {
      asyncRequest({
        url: `${defaultModulePath}template/floor.php`,
        callbacks: this.setPlaneInPage.bind(this),
      });
    }
  }
}
export default Floor;
