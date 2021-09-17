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
              <div class="s3d-popup-flyby__lines-top">
                <svg viewBox="0 0 236 31" fill="none" preserveAspectRatio="xMinYMax meet" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 1V30H1V1H30Z" stroke="#CFBE97" fill="none" stroke-width="2"></path>
                  <path d="M7 25V7H12.6667V24H18.3333V7H24V25" fill="none" stroke="#CFBE97" stroke-width="2"></path>
                  <path d="M51 1L236 1" stroke="#CFBE97" fill="none" stroke-width="2"></path>
                </svg>
              </div>
              <div class="s3d-popup-flyby__lines-right">
                <svg viewBox="0 0 2 320" fill="none" preserveAspectRatio="xMinYMax slice" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 0L1 320" stroke="#CFBE97" stroke-width="2" fill="none"></path>
                </svg>
              </div>
              <div class="s3d-popup-flyby__lines-bottom">
                <svg viewBox="0 0 236 26" fill="none" preserveAspectRatio="xMinYMax meet" xmlns="http://www.w3.org/2000/svg">
                  <path d="M236 1L1 1L1 13L235 13L235 25L2.86197e-07 25" stroke="#CFBE97" stroke-width="2" fill="none"></path>
                </svg>
              </div>
            </div>
          </div>
  `;
}

export default popupFlyby;
