function Plannings(i18n) {
  return `<div class="js-s3d__wrapper__plannings s3d__wrap s3d__wrapper__plannings" id="js-s3d__plannings">
    <div class="s3d-pl">
      <div class="s3d-pl__container">
        <div class="s3d-pl__title">${i18n.t('plannings--title')}</div>
        <div class="s3d-pl__amount-flat">${i18n.t('found')}<span class="s3d-pl__amount-flat__num js-s3d__amount-flat__num">25</span>из<span class="s3d-pl__amount-flat__num js-s3d__amount-flat__num-all">456</span></div>
        <div class="s3d-pl__not-found js-s3d-pl__not-found">${i18n.t('notFound')}</div>
        <div class="s3d-pl__list js-s3d-pl__list"></div>
      </div>
    </div>
  </div>`;
}

export default Plannings;
