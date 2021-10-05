import $ from 'jquery';
import _ from 'lodash';
import CreateFloor from '../templates/floor';
import EventEmitter from '../eventEmitter/EventEmitter';
import {
  preloader, preloaderWithoutPercent,
} from '../general/General';
import asyncRequest from '../async/async';

class Floor extends EventEmitter {
  constructor(data, i18n) {
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
    this.i18n = i18n;
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
    this.getFloor(config);
  }

  createWrap() {
    const wrap1 = createMarkup('div', { class: `s3d__wrap js-s3d__wrapper__${this.type}` });
    $(this.generalWrapId).append(wrap1);
  }

  selectFlat(id) {
    this.updateFsm({
      type: 'flat',
      id,
    });
  }

  checkChangeFloor() {
    // this.changeFloorData = {
    //   prev: false,
    //   next: true,
    // };

    const { build: currentbuild, floor: currentFloor } = this.configProject;
    const changeFloorData = this.floorList$.value.reduce((acc, data) => {
      const { floor, build } = data;
      if (build !== currentbuild) return acc;
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

    const html = CreateFloor(this.i18n, { url, flats: preparedFlats, floor: preparedFloor });
    this.emit('setHtml', html);
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
      const floorData = {
        url: '/wp-content/themes/template/assets/s3d/images/examples/floor.png',
        flatsIds: [30, 31, 32, 33, 34, 35, 36, 37],
      };
      this.setPlaneInPage(floorData);
      // asyncRequest({
      //   url: `${defaultModulePath}template/floor.php`,
      //   callbacks: this.setPlaneInPage.bind(this),
      // });
    } else {
      const dat = `action=getFloor&build=${data.build}&floor=${data.floor}`;
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

  updateHoverDataFlat(event) {
    // if (event.currentTarget && event.currentTarget.hasAttribute('data-id')) {
    //   this.emit('updateDataFlats', this.getFlat(+event.currentTarget.dataset.id));
    // } else {
    //   this.emit('updateDataFlats', this.getFlat(this.activeFlat));
    // }
  // debugger
    if (!event || !event.currentTarget.hasAttribute('data-id')) {
      this.emit('clearDataFlats', {});
      return;
    }
    const { id } = event.currentTarget.dataset;
    // const { area, number, type, rooms } = this.getFlat(+id);
    // const data = { area, number, type, rooms };
    const data = _.pick(this.getFlat(+id), ['area', 'number', 'type', 'rooms']);
    this.emit('updateDataFlats', data);
  }
}
export default Floor;
