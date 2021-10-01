import createFloorSvg from './floorSvg';

const createInfoFloor = (i18n, floor) => {
  const fields = [['count', 'floor.all_flats'], ['free', 'floor.free_flats']];
  return fields.map(([name, keyText]) => `<tr class="s3d-info__row">
    <th class="s3d-info__name">${i18n.t(keyText)}:</th>
    <th class="s3d-info__value">${floor[name]}</th>
  </tr>`);
};

function Floor(i18n, { floor, flats, url }) {
  const infoFloor = createInfoFloor(i18n, floor);
  const svgFloor = createFloorSvg(i18n, url, flats);

  return `
  <div class="s3d-floor js-s3d-floor">
    <div class="s3d-floor__info">
      <div class="s3d-flat__info">
        <p class="s3d-info__title">4 ${i18n.t('floor.info_title')}</p>
        <table class="s3d-info__table">
          <tbody>
            ${infoFloor}
          </tbody>
        </table>
      </div>
    </div>
    ${svgFloor}
    <article class="s3d-floor__nav">
      <button data-floor_btn data-floor_direction="prev" >
         <svg class="s3d-floor__nav-prev"><use xlink:href="#icon-arrow"></use></svg>
      </button>
      <p data-current-floor=${floor.floor}>${floor.floor}</p>
      <button data-floor_btn data-floor_direction="next">
         <svg class="s3d-floor__nav-next"><use xlink:href="#icon-arrow"></use></svg>
       </button>
    </article>
    <div class="s3d-floor__border-horizontal"></div>
    <div class="s3d-floor__border-vertical"></div>
    <div class="s3d-floor__bg"></div>
    <button class="s3d__callback">
      <div class="s3d__callback-icon">
        <svg role="presentation">
          <use xlink:href="#icon-callback"></use>
        </svg>
      </div>
      <span class="s3d__callback-text">
        Зв’язатись з менеджером
      </span>
    </button>
    <div class="s3d-floor__flat" id="s3d-data-flat">
      <div class="s3d-flat__info">
        <p class="s3d-info__title" data-update="rooms" data-default-text="–">-</p>
        <table class="s3d-info__table">
          <tbody>
            <tr class="s3d-info__row">
              <th class="s3d-info__name">Загальна площа:</th>
              <th class="s3d-info__value" data-update="area" data-default-text="–">-</th>
            </tr>
            <tr class="s3d-info__row">
              <th class="s3d-info__name">Тип:</th>
              <th class="s3d-info__value" data-update="type" data-default-text="–">-</th>
            </tr>
            <tr class="s3d-info__row">
              <th class="s3d-info__name">Номер:</th>
              <th class="s3d-info__value" data-update="number" data-default-text="–">-</th>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="s3d__compass">
        <svg class="icon--Compass" role="presentation">
          <use xlink:href="#icon-Compass"></use>
        </svg>
      </div>
<!--      <div class="peculiarities">-->
<!--        <div class="peculiarity" data-tippy-content="Тераса">-->
<!--          <svg class="peculiarity__icon"><use xlink:href="#icon-peculiarity-terrace"></use></svg>-->
<!--        </div>-->
<!--        <div class="peculiarity" data-tippy-content="Ремонт">-->
<!--          <svg class="peculiarity__icon"><use xlink:href="#icon-peculiarity-repair"></use></svg>-->
<!--        </div>-->
<!--      </div>-->
    
    </div>
  </div>
`;
}

export default Floor;
