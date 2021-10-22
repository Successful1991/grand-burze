import tippy from 'tippy.js';
import EventEmitter from '../eventEmitter/EventEmitter';
import { delegateHandler } from '../general/General';

class FlatView extends EventEmitter {
  constructor(model, elements, i18n) {
    super();
    this._model = model;
    this._elements = elements;
    this.i18n = i18n;

    this.mappingClickEvents = {
      polygon: elem => this.emit('clickFlatHandler', elem),
      floorBtn: elem => this.emit('changeFloorHandler', elem),
      toFloorBtn: elem => this.emit('toFloorPlan', elem),
      pdf: elem => this.emit('clickPdfHandler', elem),
      show3d: elem => this.emit('look3d', elem),
      radioView: elem => {
        if (elem.localName !== 'input') return;
        this.emit('changeRadioChecked', elem);
      },
    };

    model.wrapper.addEventListener('click', event => {
      event.preventDefault();
      const delegateElements = {
        polygon: delegateHandler('.s3d-flat__polygon', event),
        floorBtn: delegateHandler('[data-floor_btn]', event),
        toFloorBtn: delegateHandler('#s3d-to-floor', event),
        pdf: delegateHandler('.js-s3d__create-pdf', event),
        show3d: delegateHandler('#js-s3d__show-3d', event),
        radioView: delegateHandler('.js-s3d__radio-view-change', event),
      };

      const entries = Object.entries(delegateElements);
      entries.map(([key, value]) => _.isObject(value) && this.mappingClickEvents[key](value));
    });

    model.wrapper.addEventListener('click', elem => {
      const target = delegateHandler('.js-s3d__radio-type', elem);
      if (!_.isObject(target)) return;
      this.emit('changeRadioType', target);
    });

    model.wrapper.addEventListener('click', elem => {
      const target = delegateHandler('.js-s3d__radio-view', elem);
      if (!_.isObject(target)) return;
      this.emit('changeRadioView', target);
    });

    model.on('setFlat', html => { this.setFlat(html); });
    model.on('setFloor', html => { this.setFloor(html); });
    model.on('removeFloorSvg', () => { this.removeFloorSvg(); });
    model.on('removeElement', tag => { this.removeElement(tag); });
    model.on('changeClassShow', elem => { this.changeClassShow(elem); });
    model.on('updateImg', data => { this.setNewImage(data); });
    model.on('createRadioElement', data => { this.createRadio(data); });
    model.on('createRadioSvg', data => { this.createRadioSvg(data); });
    model.on('clearRadioElement', wrap => { this.clearRadio(wrap); });
    model.on('updateDataFlats', data => { this.updateHoverFlats(data); });
    // model.on('updateFloorNav', floor => { this.updateFloorNav(floor); });
    model.on('updateActiveFlatInFloor', id => { this.updateActiveFlatInFloor(id); });

    model.on('renderFloorChangeButtons', data => { this.renderFloorChangeButtons(data); });
    model.on('renderCurrentFloor', data => { this.renderCurrentFloor(data); });
  }

  setFlat(content) {
    this._model.wrapper.innerHTML = content;

    const points = this._model.wrapper.querySelectorAll('[data-peculiarity-content]');
    if (points.length === 0) return;
    tippy(points, {
      arrow: false,
      trigger: 'mouseenter click',
      placement: 'bottom',
      content: elem => {
        const container = document.createElement('div');
        container.classList = 'peculiarity__desc';
        container.innerHTML = `${elem.dataset.peculiarityContent}`;
        return container;
      },
    });
  }

  // updateFloorNav(floor) {
  //   const floorElements = document.querySelectorAll('[data-current-floor]');
  //   floorElements.forEach(el => {
  //     el.setAttribute('currentFloor', floor);
  //     el.innerHTML = floor;
  //   });
  // }

  renderCurrentFloor(data) {
    const { floor } = data;
    const floorElem = document.querySelector('[data-current-floor]');
    floorElem.setAttribute('data-value', floor);
    floorElem.innerHTML = floor;
  }

  renderFloorChangeButtons(data) {
    document.querySelector('[data-floor_direction="prev"]').disabled = (!data.prev);
    document.querySelector('[data-floor_direction="next"]').disabled = (!data.next);
  }

  updateActiveFlatInFloor(id) {
    const currentActiveFlat = document.querySelector('.js-s3d-flat__polygon.polygon__active-flat');
    if (currentActiveFlat) currentActiveFlat.classList.remove('polygon__active-flat');
    const nextActiveFlat = document.querySelector(`.js-s3d-flat__polygon[data-id="${id}"]`);
    if (nextActiveFlat) nextActiveFlat.classList.add('polygon__active-flat');
  }

  setFloor(html) {
    const node = document.querySelector('.s3d-flat__floor');
    node.insertAdjacentHTML('afterbegin', html);
    tippy('[data-tippy-element]', {
      arrow: false,
      trigger: 'mouseenter click',
      placement: 'bottom',
      content: elem => {
        const container = document.createElement('div');
        container.classList = 's3d-floor__miniInfo';
        container.innerHTML = `<div class="s3d-floor__miniInfo-val">${elem.dataset.type}</div>
<div class="s3d-floor__miniInfo-val">${this.i18n.t('Floor.miniInfo.rooms')}${elem.dataset.rooms}</div>
<div class="s3d-floor__miniInfo-val">${this.i18n.t('Floor.miniInfo.area')}${elem.dataset.area}</div>`;
        return container;
      },
    });
  }

  changeClassShow(config) {
    const { element, flag } = config;
    const container = document.querySelector(element);
    if (!_.isObjectLike(container)) return;
    const method = flag ? 'add' : 'remove';
    container.classList[method]('show');
  }

  removeFloorSvg() {
    this.removeElement('.s3d-floor__svg');
  }

  removeElement(tag) {
    const element = document.querySelector(tag);
    if (element) element.remove();
  }

  createRadio(data) {
    const {
      wrap, type, name,
    } = data;
    document.querySelector(wrap).insertAdjacentHTML('beforeend', `<label class="s3d-flat__button js-s3d__radio-${name}" data-type=${type} >
      <input type="radio" name=${name} class="s3d-flat__button-input" value=${type} />
    <span>${this.i18n.t(`Flat.buttons.${type}`)}</span></label>`);
  }

  createRadioSvg(wrap) {
    document.querySelector(wrap).insertAdjacentHTML('beforeend', `<div class="s3d-flat__buttons-bg js-s3d__btn-tab-svg"><svg viewBox="0 0 145 44" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 22C0 9.84974 9.84973 0 22 0H123C135.15 0 145 9.84974 145 22C145 34.1503 135.15 44 123 44H22C9.84974 44 0 34.1503 0 22Z"/>
        </svg></div>`);
  }

  clearRadio(wrap) {
    document.querySelector(wrap).innerHTML = '';
  }

  setNewImage(imgPath) {
    const imgContainer = document.querySelector('.js-s3d-flat__image');
    const url = `${defaultProjectPath}/assets${imgPath}`;
    imgContainer.setAttribute('src', url);
    imgContainer.setAttribute('data-mfp-src', url);
  }

  updateHoverFlats(data) {
    document.querySelector('.js-s3d__wrapper__flat [data-type="type"]').innerHTML = data['type'];
    document.querySelector('.js-s3d__wrapper__flat [data-type="flat"]').innerHTML = data['rooms'];
    document.querySelector('.js-s3d__wrapper__flat [data-type="area"]').innerHTML = data['area'];
  }
}

export default FlatView;
