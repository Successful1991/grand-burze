function Favourites(i18n) {
  return `<div class="js-s3d__wrapper__favourites s3d__wrap" id="js-s3d__favourites">
    <div class="s3d-fv js-s3d-fv">
      <div class="s3d-fv__bg">
        <img class="s3d-fv__img" src="/wp-content/themes/template/assets/s3d/images/favourite-bg.jpg">
      </div>
      <div class="s3d-fv__container">
        <div class="s3d-fv__title">Избранное</div>
        <div class="s3d-fv__amount-flat">Знайдено<span class="s3d-fv__amount-flat__num js-s3d__amount-flat__selected">25</span></div>
        <div class="s3d-fv__list js-s3d-fv__list"></div>
      </div>
    </div>
  </div>`;
}

export default Favourites;
