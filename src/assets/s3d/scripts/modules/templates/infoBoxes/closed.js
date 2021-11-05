function closed(i18n) {
  return `<div class="s3d-infoBox__sale-close">
<span class="s3d-infoBox__title">
  ${i18n.t('flatClosed')}
</span>
<button class="s3d__close s3d-infoBox__close" data-s3d-event="closed"></button>
</div>`;
}

export default closed;
