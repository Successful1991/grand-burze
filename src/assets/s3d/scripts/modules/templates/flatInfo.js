function flatInfo(i18n, flats) {
  return ` <div class="s3d-flat__info">
    <p class="s3d-info__title">${flats.rooms}-${i18n.t('count--rooms')}</p>
    <table class="s3d-info__table">
      <tbody>
        <tr class="s3d-info__row">
          <th class="s3d-info__name">${i18n.t('floor')}:</th>
          <th class="s3d-info__value">${flats.floor}</th>
        </tr>
        <tr class="s3d-info__row">
          <th class="s3d-info__name">${i18n.t('allArea')}:</th>
          <th class="s3d-info__value">${flats.area}</th>
        </tr>
        <tr class="s3d-info__row">
          <th class="s3d-info__name">${i18n.t('type')}:</th>
          <th class="s3d-info__value">${flats.type}</th>
        </tr>
        <tr class="s3d-info__row">
          <th class="s3d-info__name">${i18n.t('apartment--number')}:</th>
          <th class="s3d-info__value">${flats.number}</th>
        </tr>
      </tbody>
    </table>
  </div>`;
}

export default flatInfo;
