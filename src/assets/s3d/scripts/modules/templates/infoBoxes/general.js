function general(i18n, data) {
  const {
    type,
    flyby,
    side,
  } = data;
  if (!type) {
    return '';
  }
  return `<button class="s3d__close s3d-infoBox__close" data-s3d-event="closed"></button>
<div class="s3d-infoBox__general">
<div class="s3d-infoBox__row">
  ${i18n.t('number--flyby')}: ${data.build}
</div>
<button class="s3d-infoBox__link" data-s3d-event="transform" ${type && `data-type="${type}"`} ${flyby ? `data-flyby="${flyby}"` : ''} ${side ? `data-side="${side}"` : ''}>
  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L6 6L1 11"/>
  </svg>
</button>
</div>`;
}

export default general;
