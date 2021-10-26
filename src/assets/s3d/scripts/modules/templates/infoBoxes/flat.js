function Flat(i18n, data) {
  const {
    rooms,
    area,
    floor,
  } = data;
  return `<div class="s3d-infoBox__title">
  <span data-s3d-event="update" data-s3d-update="rooms">${rooms}</span>
  ${i18n.t('count--rooms')}
</div>
<table class="s3d-infoBox__table">
  <tbody>
  <tr class="s3d-infoBox__row">
    <td class="s3d-infoBox__name">${i18n.t('area')}</td>
    <td class="s3d-infoBox__value">
      <span data-s3d-event="update" data-s3d-update="area">${area}</span>м<sup>2</sup>
    </td>
  </tr>
  <tr class="s3d-infoBox__row">
    <td class="s3d-infoBox__name">${i18n.t('type')}:</td>
    <td class="s3d-infoBox__value" data-s3d-event="update" data-s3d-update="rooms">${rooms}к</td>
  </tr>
  <tr class="s3d-infoBox__row">
    <td class="s3d-infoBox__name">${i18n.t('floor')}</td>
    <td class="s3d-infoBox__value" data-s3d-event="update" data-s3d-update="floor">${floor}</td>
  </tr>
  </tbody>
  </table>`;
}

export default Flat;
