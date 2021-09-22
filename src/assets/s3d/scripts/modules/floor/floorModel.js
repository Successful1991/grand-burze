import $ from 'jquery';
import CreateFloor from '../templates/floor';
import EventEmitter from '../eventEmitter/EventEmitter';
import {
  preloader, preloaderWithoutPercent,
} from '../general/General';
import asyncRequest from '../async/async';

class Floor extends EventEmitter {
  constructor(data) {
    super();
    this.type = data.type;
    // this.id = data.id;
    this.getFlat = data.getFlat;
    this.generalWrapId = data.generalWrapId;
    this.createWrap();
    this.wrapper = $(`.js-s3d__wrapper__${this.type}`);
    this.history = data.history;
    this.updateFsm = data.updateFsm;
    this.configProject = data.settings;
    this.preloader = preloader();
    this.preloaderWithoutPercent = preloaderWithoutPercent();
    this.floorList$ = data.floorList$;
    this.changeFloorData = {
      prev: false,
      // current: 1,
      next: true,
    };
    console.log(data);
  }

  init() {
    this.getFloor(this.configProject);
  }

  update(config) {
    this.activeFlat = +config.flatId;
    this.getFloor(config);
  }

  createWrap() {
    const wrap1 = createMarkup('div', { class: `s3d__wrap js-s3d__wrapper__${this.type}` });
    $(this.generalWrapId).append(wrap1);
  }

  checkChangeFloor() {
    // this.changeFloorData = {
    //   prev: false,
    //   next: true,
    // };

    const { house: currentHouse, floor: currentFloor } = this.configProject;
    const changeFloorData = this.floorList$.value.reduce((acc, data) => {
      const { floor, house } = data;
      if (house !== currentHouse) return acc;
      if (floor < currentFloor) {
        return {
          ...acc,
          prev: true,
        };
      }
      if (floor > currentFloor) {
        return {
          ...acc,
          next: true,
        };
      }
      return acc;
    }, { prev: false, next: false });
    this.changeFloorData = changeFloorData;
    this.emit('renderFloorChangeButtons', this.changeFloorData);
  }

  changeFloorHandler(direction) {
    const currentFloor = this.configProject.floor;
    // eslint-disable-next-line radix
    const nextFloor = parseInt(currentFloor) + (direction === 'next' ? 1 : -1);

    this.configProject = {
      ...this.configProject,
      floor: nextFloor,
    };
    this.getFloor(this.configProject);
  }

  setPlaneInPage(response) {
    this.emit('setHtml', response);
    this.emit('renderCurrentFloor', this.configProject);
    // this.setHtml(response);
    this.checkChangeFloor();
    setTimeout(() => {
      this.preloader.turnOff($('.js-s3d__select[data-type="floor"]'));
      this.preloader.hide();
      this.preloaderWithoutPercent.hide();
    }, 600);
  }

  getFloor(data) {
    if (status === 'local') {
      this.setPlaneInPage(CreateFloor());
      // asyncRequest({
      //   url: `${defaultModulePath}template/floor.php`,
      //   callbacks: this.setPlaneInPage.bind(this),
      // });
    } else {
      const dat = `action=getFloor&house=${data.house}&floor=${data.floor}`;
      asyncRequest({
        url: '/wp-admin/admin-ajax.php',
        data: {
          method: 'POST',
          data: `action=createFlat&id=${config.activeFlat}`,
        },
        callbacks: this.setPlaneInPage.bind(this),
      });
    }
  }
}
export default Floor;
