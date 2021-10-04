import $ from 'jquery';
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
    document.querySelector('#js-s3d__wrapper').insertAdjacentHTML('beforeend', popupFlyby(this.i18n));
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
    const wrap = $('.js-s3d-popup-flyby__active');
    const cor = flat.getBoundingClientRect();
    wrap.css({
      top: cor.y,
      left: cor.x,
      height: flat.offsetHeight,
      width: flat.offsetWidth,
    });

    wrap.html('');
    wrap.append(flat.cloneNode(true));

    const height = flat.offsetHeight;
    const top = cor.y + (height / 2);
    $('.js-s3d-popup-flyby__bg-active').css({
      transform: `translate(0, ${top}px)`,
      width: $('.js-s3d-filter')[0].offsetWidth,
    });

    this.flatId = _.toNumber(flat.dataset.id);
    this.popup.find('[data-type="title"]').html(flat.dataset.type);
  }

  openPopup(setting) {
    this.updateState(setting);
    if (!this.popup.hasClass('s3d-active')) {
      this.popup.addClass('s3d-active');
    }
  }

  closePopup() {
    this.popup.removeClass('s3d-active');
  }

  activateTranslate() {
    this.closePopup();
    this.updateFsm(this.state, this.flatId);
  }
}

export default PopupChangeFlyby;
