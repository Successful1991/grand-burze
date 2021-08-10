import $ from 'jquery';
import {
  preloader, debounce, preloaderWithoutPercent,
} from './general/General';
import { isDevice } from './checkDevice';

class Layout {
  constructor(data) {
    this.type = data.type;
    // this.loader = data.loader
    this.wrapperId = data.idCopmlex;
    this.wrapper = $(`.js-s3d__wrapper__${this.wrapperId}`);
    this.click = data.click;
    this.configProject = data.configProject;
    this.scrollToBlock = data.scrollToBlock;
    this.update = this.update.bind(this);
    this.setFloorInPage = this.setFloorInPage.bind(this);
    this.changeCurrentFloor = data.changeCurrentFloor;
    this.floorEventType = 'mouseover'; // event for helper
    this.ActiveHouse = data.ActiveHouse;
    this.preloader = preloader();
    init();
  }

  init() {
    let event = {};
    this.wrapper.on('click', 'g', e => {
      e.preventDefault();
      this.activeSvg = $(e.target).closest('svg');
      $(this.activeSvg).css({ fill: '' });
      $('.s3d-floor__helper').css({ visibility: 'hidden', opacity: 0, top: '-10000px' });
      if (!isDevice()) {
        this.click(e, this.type);
      } else {
        this.updateInfoFloor(e);
        event = e;
        $('.s3d-floor__helper-close').on('click', () => {
          $('.s3d-floor__helper').css({ visibility: 'hidden', opacity: 0, top: '-10000px' });
        });
      }
    });

    $('.s3d-floor__helper').on('click', e => {
      if ($(e.target).closest('.s3d-floor__helper-close').length === 0) {
        $('.s3d-floor__helper').css({ visibility: 'hidden', opacity: 0, top: '-10000px' });
        this.click(event, this.type);
      }
    });
    if (isDevice()) {
      this.floorEventType = 'click';
    }
  }

  getFloor(data, callback) {
    const dat = `action=getFloor&house=${data.house}&floor=${data.floor}`;
    $.ajax({
      type: 'POST',
      // url: '/wp-admin/apParse.php',
      url: '/wp-admin/admin-ajax.php',
      data: dat,
      success: res => callback(res),
    });
  }
}
export default Layout;
