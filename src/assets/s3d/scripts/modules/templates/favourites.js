function Favourites(i18n, count) {
  return `<div class="js-s3d__wrapper__favourites s3d__wrap" id="js-s3d__favourites">
    <div class="s3d-fv js-s3d-fv">
      <div class="s3d-fv__bg">
        <img class="s3d-fv__img" src="/wp-content/themes/${nameProject}/assets/s3d/images/favourite-bg.jpg">
      </div>
      <div class="s3d-fv__container">
        <div class="s3d-fv__title">${i18n.t('favourite--title')}</div>
        <div class="s3d-fv__amount-flat js-s3d__fv-count">${count} ${i18n.t('favourite--added', { apartments: count })}</div>
        <div class="s3d-fv__list js-s3d-fv__list"></div>
      </div>
    </div>
  </div>`;
}

export default Favourites;
//  = ${i18n.t('favourite--added', { apartments: count })}
