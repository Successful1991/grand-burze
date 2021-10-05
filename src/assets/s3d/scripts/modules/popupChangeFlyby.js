import popupFlyby from './templates/popupFlyby';

class PopupChangeFlyby {
  constructor(data, i18n) {
    this.state = {};
    this.i18n = i18n;
    this.updateFsm = data.updateFsm;

    this.init();

    this.updateState = this.updateState.bind(this);
    this.updateContent = this.updateContent.bind(this);
  }

  init() {
    document.querySelector('.js-s3d__slideModule').insertAdjacentHTML('beforeend', popupFlyby(this.i18n));
    this.popup = document.querySelector('.js-s3d-popup-flyby');
    this.popup.addEventListener('click', event => {
      if (!event.target.closest('[data-type="close"]')) return;
      this.closePopup();
    });
    this.popup.addEventListener('click', event => {
      if (!event.target.closest('[data-type="next"]')) return;
      this.activateTranslate();
    });
  }

  updateState(config) {
    this.state = config;
  }

  updateContent(flat) {
    const wrap = document.querySelector('.js-s3d-popup-flyby__active');
    const filter = document.querySelector('.js-s3d-filter');
    const cor = flat.getBoundingClientRect();
    wrap.setAttribute('style', `
      top: ${cor.y}px;
      left: ${cor.x}px;
      height: ${flat.offsetHeight}px;
      width: ${flat.offsetWidth}px;
    `);

    wrap.innerHTML = '';
    wrap.insertAdjacentElement('beforeend', flat.cloneNode(true));

    const height = flat.offsetHeight;
    const top = cor.y + (height / 2);
    document.querySelector('.js-s3d-popup-flyby__bg-active').setAttribute('style', `
      transform: translate(0, ${top}px);
      width: ${filter.offsetWidth}px`);

    this.flatId = _.toNumber(flat.dataset.id);
    this.popup.querySelector('[data-type="title"]').innerHTML = flat.dataset.type;
  }

  openPopup(setting) {
    this.updateState(setting);
    if (!this.popup.classList.contains('s3d-active')) {
      this.popup.classList.add('s3d-active');
    }
  }

  closePopup() {
    this.popup.classList.remove('s3d-active');
  }

  activateTranslate() {
    this.closePopup();
    this.updateFsm(this.state, this.flatId);
  }
}

export default PopupChangeFlyby;
