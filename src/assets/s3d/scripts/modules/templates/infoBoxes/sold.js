function sold(i18n, data) {
  const build = data.build ? `<span class="s3d-infoBox__title" style="white-space: nowrap">${i18n.t('build')} №: ${data.build}</span>` : '';
  return `<div class="s3d-infoBox__sold">
<span class="s3d-infoBox__title">
  ${i18n.t('sold')}
</span>
${build}
<button class="s3d__close s3d-infoBox__close" data-s3d-event="closed"></button>
</div>`;
}

export default sold;
