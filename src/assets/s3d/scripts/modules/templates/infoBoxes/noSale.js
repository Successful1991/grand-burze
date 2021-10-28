function noSale(i18n) {
  return `<div class="s3d-infoBox__noSale">
<span>
  ${i18n.t('noSale')}
</span>
<button class="s3d__close s3d-infoBox__close" data-s3d-event="closed"></button>
</div>`;
}

export default noSale;
