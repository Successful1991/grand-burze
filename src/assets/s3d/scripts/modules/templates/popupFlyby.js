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
              <div class="s3d-popup-flyby__title">Кв.<span data-type="title">2А</span></div>
              <div class="s3d-popup-flyby__line"></div>
              <div class="s3d-popup-flyby__text" data-type="text">Планування знаходиться на іншому будинку. Для перегляду його на 3D моделі вам треба перемкнутися на інший будинок.</div>
              <div class="s3d-popup-flyby__link"><span data-type="next">Змінити ракурс</span>
                <div class="s3d-popup-flyby__arrow">
                  <svg width="41" height="14" viewBox="0 0 41 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M41 7H1M1 7L7 1M1 7L7 13" stroke="#CFBE97"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
  `;
}

export default popupFlyby;
