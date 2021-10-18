function Floor(i18n, data) {
  const {
    floor,
    count,
    free,
  } = data;
  return `<div class="s3d-infoBox__title">
    <span data-s3d-event="update" data-s3d-update="floor">${floor}</span>
    ${i18n.t('floor')}
  </div>
  <table class="s3d-infoBox__table">
    <tbody>
      <tr class="s3d-infoBox__row">
        <td class="s3d-infoBox__name">${i18n.t('apartments_2')}:</td>
        <td class="s3d-infoBox__value" data-s3d-event="update" data-s3d-update="rooms">${count}</td>
      </tr>
      <tr class="s3d-infoBox__row">
        <td class="s3d-infoBox__name">${i18n.t('floor__free--flats')}:</td>
        <td class="s3d-infoBox__value" data-s3d-event="update" data-s3d-update="free">${free}</td>
      </tr>
    </tbody>
  </table>`;
}

export default Floor;
