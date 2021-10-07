import $ from 'jquery';
import tippy from 'tippy.js';
import EventEmitter from '../eventEmitter/EventEmitter';
import { delegateHandler } from '../general/General';

class FlatView extends EventEmitter {
  constructor(model, elements, i18n) {
    super();
    this._model = model;
    this._elements = elements;
    this.i18n = i18n;

    // model.wrapper.on('click', '.js-s3d-flat__back', e => {
    //   this.emit('clickBackHandler', e)
    // })
    model.wrapper.addEventListener('click', event => {
      event.preventDefault();
      const polygon = delegateHandler('.s3d-flat__polygon', event);
      const floorBtn = delegateHandler('[data-floor_btn]', event);
      const toFloorBtn = delegateHandler('#s3d-to-floor', event);
      const pdf = delegateHandler('.js-s3d__create-pdf', event);
      const show3d = delegateHandler('#js-s3d__show-3d', event);
      const radioView = delegateHandler('.js-s3d__radio-view-change', event);

      switch (true) {
          case _.isObject(polygon):
            this.emit('clickFlatHandler', polygon);
            break;
          case _.isObject(floorBtn):
            this.emit('changeFloorHandler', floorBtn);
            break;
          case _.isObject(toFloorBtn):
            this.emit('toFloorPlan');
            break;
          case _.isObject(pdf):
            this.emit('clickPdfHandler', event);
            break;
          case _.isObject(show3d):
            this.emit('look3d');
            break;
          case _.isObject(radioView):
            if (radioView.localName !== 'input') return;
            this.emit('changeRadioChecked', radioView);
            break;
          default:
            break;
      }
    });
    // events handler form start
    // model.wrapper.on('click', '.js-callback-form', e => {
    //   e.preventDefault();
    //   $('.js-phone-order-popup').addClass('active');
    // });
    // model.wrapper.on('click', '.close-btn', e => {
    //   e.preventDefault();
    //   $('.js-phone-order-popup').removeClass('active');
    // });
    // events handler form end

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
    // model.wrapper.on('mouseleave', '.s3d-flat__polygon', el => {
    //   this.emit('updateHoverDataFlat');
    // });
    //
    // model.wrapper.on('mouseenter', '.s3d-flat__polygon', el => {
    //   this.emit('updateHoverDataFlat', el);
    // });

    model.on('setFlat', html => { this.setFlat(html); });
    // model.on('updateFlatData', data => { this.updateFlatData(data); });
    model.on('setFloor', html => { this.setFloor(html); });
    model.on('removeFloorSvg', () => { this.removeFloorSvg(); });
    model.on('removeElement', tag => { this.removeElement(tag); });
    model.on('changeClassShow', elem => { this.changeClassShow(elem); });
    model.on('updateImg', data => { this.setNewImage(data); });
    model.on('createRadioElement', data => { this.createRadio(data); });
    model.on('createRadioSvg', data => { this.createRadioSvg(data); });
    model.on('clearRadioElement', wrap => { this.clearRadio(wrap); });
    // model.on('showViewButton', flag => { this.showViewButton(flag); });
    model.on('updateDataFlats', data => { this.updateHoverFlats(data); });
    model.on('updateFloorNav', floor => { this.updateFloorNav(floor); });
    model.on('updateActiveFlatInFloor', id => { this.updateActiveFlatInFloor(id); });
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

  // updateFlatData(data) {
  //   const {
  //     flat, id,
  //   } = data;
  //   const wrap = $('.js-s3d__wrapper__flat');
  //   const pdfContainer = wrap.find('.js-s3d__create-pdf')[0];
  //   wrap.find('.js-s3d-flat__image')[0].src = flat.img;
  //   wrap.find('.js-s3d-flat__image')[0].dataset.mfpSrc = flat.img;
  //   wrap.find('.js-s3d-flat__card').html(flat['leftBlock']);
  //   wrap.find('.js-s3d-add__favourite')[0].dataset.id = id;
  //   $('polygon.u-svg-plan--active').removeClass('u-svg-plan--active');
  //   wrap.find(`.s3d-flat__floor [data-id=${id}]`).addClass('u-svg-plan--active');
  //   pdfContainer.dataset.id = id;
  //   if (flat && flat.pdf) {
  //     pdfContainer.style.display = '';
  //     pdfContainer.href = flat.pdf;
  //   } else {
  //     pdfContainer.style.display = 'none';
  //   }
  // }

  updateFloorNav(floor) {
    const floorElements = document.querySelectorAll('[data-current-floor]');
    floorElements.forEach(el => {
      el.setAttribute('currentFloor', floor);
      // eslint-disable-next-line no-param-reassign
      el.innerHTML = floor;
    });
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

  // showViewButton(flag) {
  //   if (flag) {
  //     $('.js-s3d-flat__buttons-view').addClass('show');
  //   } else {
  //     $('.js-s3d-flat__buttons-view').removeClass('show');
  //   }
  // }

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

  setNewImage(url) {
    const imgContainer = document.querySelector('.js-s3d-flat__image');
    imgContainer.setAttribute('src', defaultProjectPath + url);
    imgContainer.setAttribute('data-mfpSrc', defaultProjectPath + url);
  }

  updateHoverFlats(data) {
    document.querySelector('.js-s3d__wrapper__flat [data-type="type"]').innerHTML = data['type'];
    document.querySelector('.js-s3d__wrapper__flat [data-type="flat"]').innerHTML = data['rooms'];
    document.querySelector('.js-s3d__wrapper__flat [data-type="area"]').innerHTML = data['area'];
  }
}

export default FlatView;
