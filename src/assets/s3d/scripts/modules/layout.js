import $ from 'jquery';
import {
  preloader, debounce, preloaderWithoutPercent,
} from './general/General';
import { isDevice } from './checkDevice';
import asyncRequest from './async/async';

class Layout {
  constructor(data) {
    this.type = data.type;
    // this.loader = data.loader
    this.id = data.id;
    this.generalWrapId = data.generalWrapId;
    this.createWrap();
    this.wrapper = $(`.js-s3d__wrapper__${this.type}`);
    this.configProject = data.settings;
    // this.ActiveHouse = data.ActiveHouse;
    this.preloader = preloader();
    this.preloaderWithoutPercent = preloaderWithoutPercent();
  }

  init() {
    this.getFloor(this.configProject);
    // let event = {};
    // this.wrapper.on('click', 'g', e => {
    //   e.preventDefault();
    //   this.activeSvg = $(e.target).closest('svg');
    //   $(this.activeSvg).css({ fill: '' });
    //   $('.s3d-floor__helper').css({ visibility: 'hidden', opacity: 0, top: '-10000px' });
    //   if (!isDevice()) {
    //     this.click(e, this.type);
    //   } else {
    //     this.updateInfoFloor(e);
    //     event = e;
    //     $('.s3d-floor__helper-close').on('click', () => {
    //       $('.s3d-floor__helper').css({ visibility: 'hidden', opacity: 0, top: '-10000px' });
    //     });
    //   }
    // });

    // $('.s3d-floor__helper').on('click', e => {
    //   if ($(e.target).closest('.s3d-floor__helper-close').length === 0) {
    //     $('.s3d-floor__helper').css({ visibility: 'hidden', opacity: 0, top: '-10000px' });
    //     this.click(event, this.type);
    //   }
    // });
    // if (isDevice()) {
    //   this.floorEventType = 'click';
    // }
  }

  setHtml(content) {
    console.trace();
    console.log(this)
    console.log(content)
    $(this.wrapper).html(content);
  }

  createWrap() {
    const wrap1 = createMarkup('div', { class: `s3d__wrap js-s3d__wrapper__${this.type} s3d__wrapper__${this.type}` });
    $(this.generalWrapId).append(wrap1);
  }

  setPlaneInPage(response) {
    this.setHtml(response);
    // $('.js-s3d-flat__image').magnificPopup({
    //   type: 'image',
    //   showCloseBtn: true,
    // });

    setTimeout(() => {
      console.log(this.preloader);
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
export default Layout;
