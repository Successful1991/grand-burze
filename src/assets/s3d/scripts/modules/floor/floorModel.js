import {
  find,
  pick,
} from 'lodash';

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
    this.preloader = preloader;
    this.preloaderWithoutPercent = preloaderWithoutPercent();
    this.floorList$ = data.floorList$;
    this.i18n = i18n;
    this.changeFloorData = {
      prev: data.settings.floor,
      next: data.settings.floor,
    };
  }

  init() {
    this.update();
  }

  async update(config) {
    // console.log(this.configProject);
    this.configProject = config ?? this.configProject;
    // debugger;
    const floorData = await this.getFloor(this.configProject).then(({ data }) => {
      if (!data) {
        throw new Error('Error getting floor');
      }
      return data;
    }).catch(err => {
      throw new Error('Error getting floor');
    });
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
    const { build: currentBuild, section: currentSection, floor: currentFloor } = this.configProject;
    const listFloors = this.floorList$.value
      .filter(data => data.build === currentBuild && data.section === currentSection)
      .map(data => window.parseInt(data.floor));

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
    this.changeFloorData = changeFloorData;

    this.emit('renderCurrentFloor', this.configProject);
    this.emit('renderFloorChangeButtons', this.changeFloorData);
  }

  changeFloorHandler(direction) {
    // eslint-disable-next-line radix
    const nextFloor = this.changeFloorData[direction];
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
    const { floor, build, section } = this.configProject;
    return find(floors, { floor, build, section });
  }

  setPlaneInPage(response) {
    const { url, flatsIds, size: sizeImage } = response;

    const preparedFlats = this.preparationFlats(flatsIds);
    const preparedFloor = this.preparationFloor();
    const floorHtml = createFloor(this.i18n, preparedFloor);
    const floorSvgHtml = createFloorSvg(this.i18n, url, preparedFlats, sizeImage);
    this.emit('setFloor', floorHtml);
    this.emit('removeFloorSvg');
    this.emit('setFloorSvg', floorSvgHtml);

    this.checkChangeFloor();
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
      // const test = {
      //   build: 2,
      //   section: 5,
      //   floor: 14,
      // };

      const config = {
        action: 'getFloor',
        // ...test,
        ...data,
      };
      return asyncRequest({
        url: '/wp-admin/admin-ajax.php',
        method: 'post',
        data: config,
      });
    }
  }

  updateHoverDataFlat(elem) {
    if (!elem || !elem.hasAttribute('data-id')) {
      this.emit('clearDataFlats', {});
      return;
    }
    const id = elem.getAttribute('data-id');
    const data = pick(this.getFlat(+id), ['area', 'number', 'type', 'rooms']);
    this.emit('updateDataFlats', data);
  }
}
export default Floor;
