function Floor(i18n, data) {
  const {
    floor,
    count,
    free,
    build,
    section,
  } = data;

  return `<button class="s3d__close s3d-infoBox__close" data-s3d-event=closed></button>
  <div class="s3d-infoBox__floor">
  <div class="s3d-infoBox__title">
    <span data-s3d-event="update" data-s3d-update="floor">${floor}</span>
    ${i18n.t('floor')}
  </div>
  <table class="s3d-infoBox__table">
    <tbody>
      <tr class="s3d-infoBox__row">
        <td class="s3d-infoBox__name">${i18n.t('apartments', { count: 5 })}:</td>
        <td class="s3d-infoBox__value" data-s3d-event="update" data-s3d-update="rooms">${count}</td>
      </tr>
      <tr class="s3d-infoBox__row">
        <td class="s3d-infoBox__name">${i18n.t('floor__free--flats')}:</td>
        <td class="s3d-infoBox__value" data-s3d-event="update" data-s3d-update="free">${free}</td>
      </tr>
    </tbody>
  </table>
  <button class="s3d-infoBox__link" data-s3d-event="transform" data-type="floor" data-section="${section}" data-build="${build}" data-floor="${floor}">
    <span>Перейти до плана этажа</span>
  </button>
</div>`;
}

export default Floor;
