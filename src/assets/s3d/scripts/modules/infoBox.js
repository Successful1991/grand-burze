import $ from 'jquery';
import placeElemInWrapperNearMouse from './placeElemInWrapperNearMouse';
import renderInfoFloor from './templates/infoBoxes/floor';
import renderInfoFlat from './templates/infoBoxes/flat';
import renderInfoBuild from './templates/infoBoxes/general';
import renderInfoNoSale from './templates/infoBoxes/noSale';
import renderInfoInfrastructure from './templates/infoBoxes/infrastructure';
import { delegateHandler } from './general/General';

class InfoBox {
  constructor(data) {
    this.infoBox = '';
    this.hoverData$ = data.hoverData$;
    this.selectData = data.selectData;
    this.updateFsm = data.updateFsm;
    this.getFlat = data.getFlat;
    this.getFloor = data.getFloor;
    this.state = {
      type: data.typeSelectedFlyby$.value,
    };
    this.stateUI = {
      status: 'static',
    };
    this.stateConfig = ['static', 'hover', 'active'];
    this.isInfoBoxMoving = true; // translate or static position
    this.i18n = data.i18n;

    this.changeState = this.changeState.bind(this);
    this.disable = this.disable.bind(this);
    this.init();
  }

  mappingClickEvents = {
    closed: elem => {
      this.updateState('static');
      // this.removeSvgFlatActive();
      this.removePolygonSelected();
    },
    link: elem => {
      this.updateState('static');
      // this.removeSvgFlatActive();
      this.removePolygonSelected();
      this.updateFsm(elem.dataset);
    },
  };

  init() {
    this.createInfo();
    this.infoBox.addEventListener('click', event => {
      const delegateElements = {
        closed: delegateHandler('[data-s3d-event="closed"]', event),
        link: delegateHandler('[data-s3d-event="transform"]', event),
      };
      const entries = Object.entries(delegateElements);
      entries.map(([key, value]) => _.isObject(value) && this.mappingClickEvents[key](value));
    });
    // this.infoBox.addEventListener('click', event => {
    //   if (event.target.closest('[data-s3d-event=closed]')) {
    //     return;
    //   }
    //   this.updateState('static');
    //   this.removeSvgFlatActive();
    // });

    if (this.isInfoBoxMoving) {
      this.infoBox.classList.add('s3d-infoBox__moving');
    }
  }

  removeSvgFlatActive() {
    $('.js-s3d__svgWrap .polygon__flat-svg').removeClass('polygon__flat-svg');
  }

  removePolygonSelected() {
    $('.js-s3d__svgWrap .polygon__selected').removeClass('polygon__selected');
  }

  // updateState use only from this class. change state without check exceptions
  updateState(state, flat) {
    if (this.stateConfig.includes(state)) {
      this.stateUI.status = state;
    }
    this.dispatch(flat);
    return '';
  }

  changeState(value, data = null) {
    const prevState = this.stateUI.status;
    // const nextState = value;
    if (prevState === 'active') return;
    let flat = null;
    if (data) {
      this.state.type = data.type;
      switch (data.type) {
          case 'flat':
            flat = this.getFlat(+data.id);
            break;
          case 'floor':
            flat = this.getFloor(data);
            break;
          default:
            flat = data;
            break;
      }
    }

    if (!flat) {
      this.updateState('static', null);
      return;
    }

    if (_.isEqual(data, this.hoverData$.value)) return;
    if (value === 'hover' && value === this.stateUI.status) {
      this.hoverData$.next(data);
      this.updateInfo(flat);
      return;
    }
    this.updateState(value, flat);
  }

  dispatch(flat) {
    switch (this.stateUI.status) {
        case 'static':
          this.hoverData$.next({});
          this.infoBox.style.cssText = 'opacity: 0; pointer-events: none;';
          break;
        case 'hover':
          this.hoverData$.next(flat);
          this.infoBox.style.cssText = 'opacity: 1; pointer-events: painted;';
          this.updateInfo(flat);
          break;
        case 'active':
          this.hoverData$.next(flat);
          this.infoBox.style.cssText = 'opacity: 1; pointer-events: painted;';
          this.updateInfo(flat);
          break;
        default:
          this.hoverData$.next({});
          this.infoBox.style.cssText = 'opacity: 0; pointer-events: none;';
          break;
    }
  }

  update(flat, state) {
    // this.updateInfo(flat);
    if (state !== undefined) {
      this.updateState(state);
    }
  }

  disable(value) {
    if (this.infoBox === '') {
      return;
    }

    if (value) {
      this.infoBox.classList.add('s3d-infoBox__disable');
    } else {
      this.infoBox.classList.remove('s3d-infoBox__disable');
    }
  }

  createInfo() {
    this.infoBox = document.querySelector('[data-s3d-type="infoBox"]');
  }

  updatePosition(e) {
    if (!this.isInfoBoxMoving) {
      return;
    }
    // передвигаем блок за мышкой
    const { x, y } = placeElemInWrapperNearMouse(this.infoBox, document.documentElement, e, 50);
    this.infoBox.style.top = `${y}px`;
    this.infoBox.style.left = `${x}px`;
  }

  updateInfo(data) {
    if (_.isUndefined(data)) {
      return;
    }
    const createTemplate = {
      floor: renderInfoFloor,
      flat: renderInfoFlat,
      section: renderInfoBuild,
      flyby: renderInfoBuild,
      noSale: renderInfoNoSale,
      infrastructure: renderInfoInfrastructure,
    };

    if (createTemplate[this.state.type]) {
      this.infoBox.innerHTML = createTemplate[this.state.type](this.i18n, data);
    } else {
      this.updateState('static');
    }
  }
}
export default InfoBox;
