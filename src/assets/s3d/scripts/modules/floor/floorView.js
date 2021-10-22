import { delegateHandler } from '../general/General';
import EventEmitter from '../eventEmitter/EventEmitter';

class FloorView extends EventEmitter {
  constructor(model, elements) {
    super();
    this._model = model;
    this._elements = elements;

    model.wrapper.addEventListener('click', event => {
      event.preventDefault();
      const polygon = delegateHandler('.s3d-flat__polygon', event);
      const floorBtn = delegateHandler('[data-floor_btn]', event);
      switch (true) {
          case _.isObject(polygon):
            this.emit('clickFloorHandler', polygon);
            break;
          case _.isObject(floorBtn):
            this.emit('changeFloorHandler', floorBtn);
            break;
          default:
            break;
      }
    });

    model.wrapper.addEventListener('mouseout', event => {
      const elem = delegateHandler('.s3d-flat__polygon', event);
      if (!elem) return;
      this.emit('updateHoverDataFlat');
    });

    model.wrapper.addEventListener('mouseover', event => {
      const elem = delegateHandler('.s3d-flat__polygon', event);
      if (!elem || elem.dataset['sold']) return;
      this.emit('updateHoverDataFlat', elem);
    });

    model.on('setFloor', html => { this.setFloor(html); });
    model.on('setFloorSvg', html => { this.setFloorSvg(html); });
    model.on('removeFloorSvg', () => { this.removeFloorSvg(); });
    model.on('removeElement', tag => { this.removeElement(tag); });
    model.on('changeClassShow', elem => { this.changeClassShow(elem); });
    model.on('updateImg', data => { this.setNewImage(data); });
    model.on('clearDataFlats', () => { this.clearHoverFlats(); });
    model.on('updateDataFlats', data => { this.updateHoverFlats(data); });
    model.on('renderFloorChangeButtons', data => { this.renderFloorChangeButtons(data); });
    model.on('renderCurrentFloor', data => { this.renderCurrentFloor(data); });
  }

  setFloor(content) {
    this._model.wrapper.innerHTML = content;
  }

  setFloorSvg(content) {
    const node = document.querySelector('.js-s3d-floor');
    node.insertAdjacentHTML('afterbegin', content);
  }

  removeFloorSvg() {
    this.removeElement('.s3d-floor__svg');
  }

  removeElement(tag) {
    const element = document.querySelector(tag);
    if (element) element.remove();
  }

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

  setNewImage(url) {
    const imgContainer = document.querySelector('.js-s3d-flat__image');
    imgContainer.setAttribute('src', defaultProjectPath + url);
    imgContainer.setAttribute('data-mfpSrc', defaultProjectPath + url);
  }

  updateHoverFlats(data) {
    const entries = Object.entries(data);
    const container = document.getElementById('s3d-data-flat');
    entries.forEach(([key, value]) => {
      const element = container.querySelector(`[data-update="${key}"]`);

      if (element) {
        element.innerHTML = (key !== 'rooms') ? value : `${value}-кімнатна`;
      }
    });
  }

  clearHoverFlats() {
    const container = document.getElementById('s3d-data-flat');
    const elements = container.querySelectorAll('[data-update]');
    if (elements.length == 0) return;
    elements.forEach(element => {
      const value = element.dataset.defaultText || '-';
      // eslint-disable-next-line no-param-reassign
      element.innerHTML = value;
    });
  }
}

export default FloorView;
