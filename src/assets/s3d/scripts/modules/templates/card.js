function Card(i18n, flat, favouritesIds$) {
  const {
    rooms,
    area,
    floor,
    type,
    number,
    img_small: src,
    id,
  } = flat;
  const isFavourite = favouritesIds$.value.includes(id);
  return `<div class="s3d-card js-s3d-card" data-id="${id}" data-key="id">
      <button class="s3d__close js-s3d-card__close"></button>
      <div class="s3d-card__image"><img src="${src}" data-key="src"></div>
      <div class="s3d-card__title">
          <span data-key="rooms">${rooms}</span>
          ${i18n.t('count--rooms')} —
          <span data-key="area">${area}</span>м<sup>2</sup>
      </div>
      <table class="s3d-card__table">
         <tbody>
            <tr class="s3d-card__row">
              <td class="s3d-card__name">${i18n.t('floor')}:</td>
              <td class="s3d-card__value" data-key="floor">${floor}</td>
            </tr>
            <tr class="s3d-card__row">
              <td class="s3d-card__name">${i18n.t('type')}:</td>
              <td class="s3d-card__value" data-key="type">${type}</td>
            </tr>
            <tr class="s3d-card__row">
              <td class="s3d-card__name">${i18n.t('apartment--number')}:</td>
              <td class="s3d-card__value" data-key="number">${number}</td>
            </tr>
         </tbody>
      </table>
      <div class="s3d-card__buttons">
          <label aria-label="button" aria-role="button" data-id="${id}" data-key="id" class="s3d__favourite js-s3d-add__favourite">
             <input type="checkbox" data-key="checked" ${isFavourite ? 'checked' : ''}/>
             <svg><use xlink:href="#icon-favourites"></use></svg>
          </label>
          <button type="button" class="s3d-card__link js-s3d-card__link">
            <span class="s3d-card__link-text">${i18n.t('card--link')}</span>
            <div class="s3d-card__arrow">
              <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 1L7 7.5L0.5 14"/></svg>
            </div>
          </button>
      </div>
   </div>`;
}

export default Card;
