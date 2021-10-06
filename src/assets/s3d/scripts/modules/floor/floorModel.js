import _ from 'lodash';
import createFloor from '../templates/floor';
import createFloorSvg from '../templates/floorSvg';
import EventEmitter from '../eventEmitter/EventEmitter';
import {
  preloader, preloaderWithoutPercent,
} from '../general/General';
import asyncRequest from '../async/async';

class Floor extends EventEmitter {
  constructor(data, i18n) {
    super();
    this.type = data.type;
    this.getFlat = data.getFlat;
    this.generalWrapId = data.generalWrapId;
    this.createWrap();
    this.wrapper = document.querySelector(`.js-s3d__wrapper__${this.type}`);
    this.history = data.history;
    this.updateFsm = data.updateFsm;
    this.configProject = data.settings;
    this.preloader = preloader();
    this.preloaderWithoutPercent = preloaderWithoutPercent();
    this.floorList$ = data.floorList$;
    this.i18n = i18n;
    this.changeFloorData = {
      prev: data.settings.floor,
      // current: data.settings.floor,
      next: data.settings.floor,
    };
  }

  init() {
    this.update();
  }

  async update() {
    const floorData = await this.getFloor(this.configProject);
    this.setPlaneInPage(floorData);

    setTimeout(() => {
      this.preloader.turnOff(document.querySelector('.js-s3d__select[data-type="floor"]'));
      this.preloader.hide();
      this.preloaderWithoutPercent.hide();
    }, 600);
  }

  createWrap() {
    const wrap = createMarkup('div', { class: `s3d__wrap js-s3d__wrapper__${this.type}` });
    document.querySelector(this.generalWrapId).insertAdjacentElement('beforeend', wrap);
  }

  selectFlat(id) {
    this.updateFsm({
      type: 'flat',
      id,
    });
  }

  checkChangeFloor() {
    const { build: currentBuild, floor: currentFloor } = this.configProject;
    const listFloors = this.floorList$.value
      .filter(data => data.build === currentBuild)
      // eslint-disable-next-line radix
      .map(data => parseInt(data.floor));

    const index = listFloors.indexOf(currentFloor);
    const changeFloorData = {
      prev: listFloors[index - 1],
      next: listFloors[index + 1],
    };
    if (index === 0) {
      changeFloorData.prev = null;
    }
    if (index === listFloors.length - 1) {
      changeFloorData.next = null;
    }
    // const changeFloorData = this.floorList$.value.reduce((acc, data) => {
    //   const { floor, build } = data;
    //   if (build !== currentBuild) return acc;
    //   if (floor < currentFloor && floor > acc.prev) {
    //     return {
    //       ...acc,
    //       prev: floor,
    //     };
    //   }
    //   if (floor > currentFloor && floor < acc.next) {
    //     return {
    //       ...acc,
    //       next: floor,
    //     };
    //   }
    //   return acc;
    // }, this.changeFloorData);
    this.changeFloorData = changeFloorData;
    this.emit('renderFloorChangeButtons', this.changeFloorData);
  }

  changeFloorHandler(direction) {
    // const currentFloor = this.configProject.floor;
    // eslint-disable-next-line radix
    const nextFloor = this.changeFloorData[direction];
    // const nextFloor = parseInt(currentFloor) + (direction === 'next' ? 1 : -1);
    // debugger;
    this.configProject = {
      ...this.configProject,
      floor: nextFloor,
    };
    this.update();
  }

  preparationFlats(flatsIds) {
    return flatsIds.map(id => this.getFlat(id));
  }

  preparationFloor() {
    const floors = this.floorList$.value;
    const { floor, build } = this.configProject;
    return _.find(floors, { floor, build });
  }

  setPlaneInPage(response) {
    const { url, flatsIds } = response;
    const preparedFlats = this.preparationFlats(flatsIds);
    const preparedFloor = this.preparationFloor();

    const floorHtml = createFloor(this.i18n, preparedFloor);
    const floorSvgHtml = createFloorSvg(this.i18n, url, preparedFlats);
    this.emit('setFloor', floorHtml);
    this.emit('removeFloorSvg');
    this.emit('setFloorSvg', floorSvgHtml);
    this.emit('renderCurrentFloor', this.configProject);

    this.checkChangeFloor();
  }

  getFloor() {
    if (status === 'local') {
      const floorData = {
        url: '/wp-content/themes/template/assets/s3d/images/examples/floor.png',
        flatsIds: [30, 31, 32, 33, 34, 35, 36, 37],
      };
      return new Promise((resolve, reject) => {
        resolve(floorData);
      });
      // asyncRequest({
      //   url: `${defaultModulePath}template/floor.php`,
      //   callbacks: this.setPlaneInPage.bind(this),
      // });
    } else {
      const dat = `action=getFloor&build=${data.build}&floor=${data.floor}`;
      return asyncRequest({
        url: '/wp-admin/admin-ajax.php',
        data: {
          method: 'POST',
          data: `action=createFlat&id=${config.activeFlat}`,
        },
        callbacks: this.setPlaneInPage.bind(this),
      });
    }
  }

  updateHoverDataFlat(elem) {
    if (!elem || !elem.hasAttribute('data-id')) {
      this.emit('clearDataFlats', {});
      return;
    }
    const id = elem.getAttribute('data-id');
    const data = _.pick(this.getFlat(+id), ['area', 'number', 'type', 'rooms']);
    this.emit('updateDataFlats', data);
  }
}
export default Floor;
