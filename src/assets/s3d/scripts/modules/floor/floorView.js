import $ from 'jquery';
import i18next from 'i18next';
import EventEmitter from '../eventEmitter/EventEmitter';

class FloorView extends EventEmitter {
  constructor(model, elements) {
    super();
    this._model = model;
    this._elements = elements;

    model.wrapper.on('click', '.svg__floor', event => {
      this.emit('clickFloorHandler', event);
    });

    model.wrapper.on('click', '[data-floor_btn]', event => {
      this.emit('changeFloorHandler', event);
    });

    // events handler form start
    model.wrapper.on('click', '.js-callback-form', e => {
      e.preventDefault();
      $('.js-phone-order-popup').addClass('active');
    });

    model.wrapper.on('click', '.close-btn', e => {
      e.preventDefault();
      $('.js-phone-order-popup').removeClass('active');
    });
    // events handler form end

    model.wrapper.on('change', '.js-s3d__radio-type', el => {
      this.emit('changeRadioType', el);
    });

    model.wrapper.on('mouseleave', '.svg__flat', el => {
      this.emit('updateHoverDataFlat', this._model.getFlat(this._model.activeFlat));
    });

    model.wrapper.on('mouseenter', '.svg__flat', el => {
      this.emit('updateHoverDataFlat', el);
    });

    model.on('setHtml', html => { this.setHtml(html); });
    model.on('updateFloorData', data => { this.updateFloorData(data); });
    model.on('removeElement', tag => { this.removeElement(tag); });
    model.on('changeClassShow', elem => { this.changeClassShow(elem); });
    model.on('updateImg', data => { this.setNewImage(data); });
    model.on('updateDataFlats', data => { this.updateHoverFlats(data); });
    model.on('renderFloorChangeButtons', data => { this.renderFloorChangeButtons(data); });
    model.on('renderCurrentFloor', data => { this.renderCurrentFloor(data); });
  }

  setHtml(content) {
    $(this._model.wrapper).html(content);
  }

  updateFloorData(data) {
    const {
      flat, id,
    } = data;
    const wrap = $('.js-s3d__wrapper__flat');
    wrap.find('.js-s3d-flat__image')[0].src = flat.img;
    wrap.find('.js-s3d-flat__image')[0].dataset.mfpSrc = flat.img;
    wrap.find('.js-s3d-flat__card').html(flat['leftBlock']);
    wrap.find('.js-s3d-add__favourites')[0].dataset.id = id;
    $('polygon.u-svg-plan--active').removeClass('u-svg-plan--active');
    wrap.find(`.s3d-flat__floor [data-id=${id}]`).addClass('u-svg-plan--active');
  }

  removeElement(tag) {
    $(tag).remove();
  }

  renderCurrentFloor(data) {
    const { floor } = data;
    const floorElem = document.querySelector('[data-current-floor]');
    floorElem.setAttribute('data-value', floor);
    floorElem.innerHTML = floor;
    // const elements = [
    //   ...document.querySelectorAll('[data-current-floor]'),
    // ];
    // elements.forEach(node => {
    //   node.textContent = floor;
    // });
  }

  renderFloorChangeButtons(data) {
    const prevMethod = (data.prev) ? 'removeAttribute' : 'setAttribute';
    const nextMethod = (data.next) ? 'removeAttribute' : 'setAttribute';
    document.querySelector('[data-floor_direction="prev"]')[prevMethod]('disabled', true);
    document.querySelector('[data-floor_direction="next"]')[nextMethod]('disabled', true);
  }

  setNewImage(url) {
    $('.js-s3d-flat__image')[0].src = defaultProjectPath + url;
    $('.js-s3d-flat__image')[0].dataset['mfpSrc'] = defaultProjectPath + url;
  }

  updateHoverFlats(data) {
    $('.js-s3d__wrapper__flat [data-type="type"]').html(data['type']);
    $('.js-s3d__wrapper__flat [data-type="flat"]').html(data['rooms']);
    $('.js-s3d__wrapper__flat [data-type="area"]').html(data['area']);
  }
}

export default FloorView;
