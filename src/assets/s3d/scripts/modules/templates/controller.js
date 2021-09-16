
function Controller() {
  return `<div class="s3d-ctr js-s3d-ctr unselectable" data-type="complex">
            <div class="s3d-ctr__open-filter js-s3d-ctr__open-filter">
              <div class="s3d-ctr__open-filter__icon">
                <svg width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line y1="2.5" x2="26" y2="2.5" stroke="white"></line>
                  <line y1="18.5" x2="26" y2="18.5" stroke="white"></line>
                  <line y1="10.5" x2="26" y2="10.5" stroke="white"></line>
                  <circle cx="20.5" cy="2.5" r="2" fill="#007275" stroke="white"></circle>
                  <circle cx="20.5" cy="18.5" r="2" fill="#007275" stroke="white"></circle>
                  <circle cx="5.5" cy="10.5" r="2" fill="#007275" stroke="white"></circle>
                </svg>
              </div><span class="s3d-ctr__open-filter__text">підбір за параметрами</span>
            </div>
            <div class="s3d-ctr__compass js-s3d-ctr__compass">
              <svg class="icon--Compass" role="presentation">
                <use xlink:href="#icon-Compass"></use>
              </svg>
            </div>
            <div class="s3d-ctr__elem js-s3d-ctr__elem">
              <div class="s3d-ctr__elem__title">Меню 3D</div>
              <button class="s3d-ctr__select js-s3d__select active" type="button" data-type="flyby" data-flyby="1" data-side="outside">3D генплан</button>
              <button class="s3d-ctr__select js-s3d__select" type="button" data-type="plannings">
                Вибір <wbr>
                планування
              </button>
              <button class="s3d-ctr__select js-s3d__select" type="button" data-type="flat" disabled>Квартира</button>
            </div>
            <div class="s3d-ctr__title js-s3d-ctr__title">Вибір на <wbr/>3D моделі</div>
            <div class="s3d-ctr__selected js-s3d-ctr__selected">
              <button class="s3d-ctr__selected--button" data-selected-type="flat">flat</button>
              <button class="s3d-ctr__selected--button" data-selected-type="floor">flor</button>
            </div>
            <div class="s3d-ctr__favourites-bg js-s3d-ctr__favourites-bg"></div>
            <div class="js-s3d-infoBox s3d-infoBox s3d-card" data-s3d-type="infoBox">
              <label class="s3d-card__add-favourites s3d-infoBox__add-favourites js-s3d-add__favourites" data-s3d-update="id" data-id="1">
                <input type="checkbox" data-s3d-update="checked">
                <svg role="presentation">
                  <use xlink:href="#icon-favourites"></use>
                </svg>
              </label>
              <div class="s3d-card__close" data-s3d-event="closed"></div>
              <div class="s3d-card__image"><img data-s3d-event="update" src="" data-s3d-update="image"></div>
              <div class="s3d-card__type" data-s3d-event="update" data-s3d-update="type"><span></span></div>
              <table class="s3d-card__table">
                <tbody>
                  <tr class="s3d-card__row">
                    <td class="s3d-card__name">№ квартиры</td>
                    <td class="s3d-card__value" data-s3d-event="update" data-s3d-update="number"></td>
                  </tr>
                  <tr class="s3d-card__row">
                    <td class="s3d-card__name">Этаж</td>
                    <td class="s3d-card__value" data-s3d-event="update" data-s3d-update="floor"></td>
                  </tr>
                  <tr class="s3d-card__row">
                    <td class="s3d-card__name">Комнаты</td>
                    <td class="s3d-card__value" data-s3d-event="update" data-s3d-update="rooms"></td>
                  </tr>
                  <tr class="s3d-card__row">
                    <td class="s3d-card__name">Площадь м<sup>2</sup></td>
                    <td class="s3d-card__value" data-s3d-event="update" data-s3d-update="area">88.06</td>
                  </tr>
                </tbody>
              </table>
              <div class="s3d-card__buttons">
                <button class="s3d-card__link" type="button" data-id="33" data-s3d-update="id" data-s3d-event="transition"><span>Детальніше</span>
                  <div class="s3d-card__link-arrow">
                    <svg width="67" height="18" viewBox="0 0 67 18" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.99382e-07 9L65 9.00001M65 9.00001L57.3333 17M65 9.00001L57.3333 1.00001" stroke="#CFBE97" stroke-width="2"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
            <div class="s3d-ctr__open">
              <div class="s3d-ctr__open-helper js-s3d-ctr__open-helper">
                <div class="s3d-ctr__open-helper--text">повторить обучение</div><span class="s3d-ctr__open-helper--line"></span>
                <svg class="icon--icon-question s3d-ctr__open-helper--icon" role="presentation">
                  <use xlink:href="#icon-icon-question"></use>
                </svg>
              </div>
            </div>
          </div>
      `;
}

export default Controller;
