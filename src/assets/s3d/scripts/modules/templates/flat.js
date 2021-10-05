import createFlatInfo from './flatInfo';
import createPeculiarities from './peculiarities';

function Flat(i18n, flat) {
  const infoFlat = createFlatInfo(i18n, flat);
  const peculiarities = createPeculiarities(i18n, flat.option);

  return `
  <div class="s3d-flat js-s3d-flat">
    <div class="s3d-flat__info-container">
      ${infoFlat}
      ${peculiarities}
    </div>
    <button class="s3d-show-in-3d" id="js-s3d__show-3d">
      <div class="s3d-show-in-3d__icon">
        <svg class="icon--3d" role="presentation">
          <use xlink:href="#icon-3d"></use>
        </svg>
      </div>
      <span class="s3d-show-in-3d__text">${i18n.t('showIn3d')}</span>
    </button>
    <label data-id="" data-key="id" class="s3d__favourite js-s3d-add__favourite">
       <input type="checkbox" data-key="checked" />
       <svg><use xlink:href="#icon-favourites"></use></svg>
    </label>
    <div class="s3d-flat__border-horizontal"></div>
    <div class="s3d-flat__border-vertical"></div>
    <div class="s3d-flat__bg"></div>
    <div class="s3d-flat__image-container">
      <div class="s3d-flat__image">
        <img class="js-s3d-flat__image" src="" data-mfp-src="">
      </div>
      <div class="s3d-flat__buttons-wrap">
        <div class="s3d-flat__buttons js-s3d-flat__buttons-type"></div>
        <div class="s3d-flat__buttons-view js-s3d-flat__buttons-view">
          <label data-type="2d" class="s3d-flat__radio js-s3d__radio-view" >
            <input type="radio" name="view" value="2d">
            <span>${i18n.t('Flat.2d')}</span>
          </label>
          <label class="s3d-flat__select js-s3d__radio-view-change">
            <input type="checkbox">
            <i class="s3d-flat__select-circle"></i>
          </label>
          <label data-type="3d" class="s3d-flat__radio js-s3d__radio-view">
            <input type="radio" name="view" value="3d">
            <span>${i18n.t('Flat.3d')}</span>
          </label>
         </div>
      </div>
    </div>
    <button class="s3d__callback">
      <div class="s3d__callback-icon">
        <svg role="presentation">
          <use xlink:href="#icon-callback"></use>
        </svg>
      </div>
      <span>
        ${i18n.t('callback--1')}
      </span>
    </button>
    <a href="#" class="s3d-flat__pdf js-s3d__create-pdf">${i18n.t('pdf')}</a>
    <div class="s3d-flat__floor">
      <div class="s3d__compass">
        <svg class="icon--Compass" role="presentation">
          <use xlink:href="#icon-Compass"></use>
        </svg>
      </div>

      <article class="s3d-floor__nav">
      <p class="s3d-floor__nav-title">${i18n.t('floor')}</p>
      <button data-floor_btn data-floor_direction="prev" >
         <svg class="s3d-floor__nav-prev"><use xlink:href="#icon-arrow"></use></svg>
      </button>
      <p data-current-floor="${flat.floor}">${flat.floor}</p>
      <button data-floor_btn data-floor_direction="next">
         <svg class="s3d-floor__nav-next"><use xlink:href="#icon-arrow"></use></svg>
       </button>
    </article>
      <button class="s3d-flat__to--floor" id="s3d-to-floor">
        <span>${i18n.t('Flat.goToFloor')}</span>
        <div class="s3d-flat__to--floor-icon">
          <svg width="48" height="11" viewBox="0 0 48 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M41.5 0.5L46.5 5.5M46.5 5.5L41.5 10.5M46.5 5.5H0.5"/>
          </svg>
        </div>
      </button>
    </div>
  </div>
`;
}

export default Flat;
