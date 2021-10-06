const createInfoFloor = (i18n, floor) => {
  const fields = [['build', 'build'], ['sec', 'section'], ['floor', 'floor'], ['count', 'floor__all--flats'], ['free', 'floor__free--flats']];
  return fields.map(([name, keyText]) => `<tr class="s3d-info__row">
    <th class="s3d-info__name">${i18n.t(keyText)}:</th>
    <th class="s3d-info__value">${floor[name]}</th>
  </tr>`).join('');
};

function Floor(i18n, floor) {
  const infoFloor = createInfoFloor(i18n, floor);
  return `
  <div class="s3d-floor js-s3d-floor">
    <div class="s3d-floor__info">
      <div class="s3d-flat__info">
        <p class="s3d-info__title">${floor.floor} ${i18n.t('floor')}</p>
        <table class="s3d-info__table">
          <tbody>
            ${infoFloor}
          </tbody>
        </table>
      </div>
    </div>

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
        ${i18n.t('callback--1')}
      </span>
    </button>
    <div class="s3d-floor__flat" id="s3d-data-flat">
      <div class="s3d-flat__info">
        <p class="s3d-info__title" data-update="rooms" data-default-text="–">-</p>
        <table class="s3d-info__table">
          <tbody>
            <tr class="s3d-info__row">
              <th class="s3d-info__name">${i18n.t('allArea')}:</th>
              <th class="s3d-info__value" data-update="area" data-default-text="–">-</th>
            </tr>
            <tr class="s3d-info__row">
              <th class="s3d-info__name">${i18n.t('type')}:</th>
              <th class="s3d-info__value" data-update="type" data-default-text="–">-</th>
            </tr>
            <tr class="s3d-info__row">
              <th class="s3d-info__name">${i18n.t('apartment--number')}:</th>
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
    </div>
  </div>
`;
}

export default Floor;
