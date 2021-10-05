function popupFlyby(i18n) {
  return `
    <div class="s3d-popup-flyby__wrap js-s3d-popup-flyby">
            <div class="s3d-popup-flyby__active js-s3d-popup-flyby__active"></div>
            <div class="s3d-popup-flyby__bg">
              <div class="s3d-popup-flyby__bg-active js-s3d-popup-flyby__bg-active"></div>
              <div class="s3d-popup-flyby__bg-all"></div>
            </div>
            <div class="s3d-popup-flyby">
              <div class="s3d-popup-flyby__close" data-type="close"></div>
              <div class="s3d-popup-flyby__title">${i18n.t('PopupFlyby.title')}<span data-type="title">2А</span></div>
              <div class="s3d-popup-flyby__line"></div>
              <div class="s3d-popup-flyby__text" data-type="text">${i18n.t('PopupFlyby.description')}</div>
              <button class="s3d-popup-flyby__link" data-type="next">
                ${i18n.t('PopupFlyby.btn')}
              </button>
            </div>
          </div>
  `;
}

export default popupFlyby;
