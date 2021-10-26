function general(i18n, data) {
  return `<div class="s3d-infoBox__row">
      ${i18n.t('number--flyby')}: ${data.build}
    </div>`;
}

export default general;
