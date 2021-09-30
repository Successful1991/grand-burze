function Flat(i18n) {
  return `
  <div class="s3d-flat js-s3d-flat">
    <div class="s3d-flat__info-container">
      <div class="s3d-flat__info">
        <p class="s3d-info__title">3-кімнатна</p>
        <div class="s3d-info__table">
          <table>
            <tbody>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Всього квартир:</th>
                <th class="s3d-info__value">10</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">З терасою:</th>
                <th class="s3d-info__value">4</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">7</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">7</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">4</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">14</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">7</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">7</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">4</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">14</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">14</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">7</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">7</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">4</th>
              </tr>
              <tr class="s3d-info__row">
                <th class="s3d-info__name">Вільних:</th>
                <th class="s3d-info__value">14</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="peculiarities">
        <div class="peculiarity" data-tippy-content="Тераса">
          <svg class="peculiarity__icon"><use xlink:href="#icon-peculiarity-terrace"></use></svg>
<!--          <div class="peculiarity__desc">Тераса</div>-->
        </div>
        <div class="peculiarity" data-tippy-content="Ремонт">
          <svg class="peculiarity__icon"><use xlink:href="#icon-peculiarity-repair"></use></svg>
<!--          <div class="peculiarity__desc">Ремонт</div>-->
        </div>
      </div>
    </div>
    <button class="s3d-show-in-3d" id="js-s3d__show-3d">
      <div class="s3d-show-in-3d__icon">
        <svg class="icon--3d" role="presentation">
          <use xlink:href="#icon-3d"></use>
        </svg>
      </div>
      <span class="s3d-show-in-3d__text">Переглянути на 3D моделі</span>
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
        <img class="js-s3d-flat__image" src="assets/s3d/images/examples/KV.png" data-mfp-src="assets/s3d/images/examples/KV.png">
      </div>
      <div class="s3d-flat__buttons-wrap">
        <div class="s3d-flat__buttons js-s3d-flat__buttons-type"></div>
        <div class="s3d-flat__buttons-view js-s3d-flat__buttons-view">
          <label data-type="2d" class="s3d-flat__radio js-s3d__radio-view" >
            <input type="radio" name="view" value="2d">
            <span>план схема</span>
          </label>
          <label class="s3d-flat__select js-s3d__radio-view-change">
            <input type="checkbox">
            <i class="s3d-flat__select-circle"></i>
          </label>
          <label data-type="3d" class="s3d-flat__radio js-s3d__radio-view">
            <input type="radio" name="view" value="3d">
            <span>3D планування</span>
          </label>
          
         </div>
      </div>
<!--      <div class="s3d-flat__buttons-wrap">-->

<!--        <svg role="presentation" class="s3d-flat__buttons-bg js-s3d__btn-tab-svg" preserveAspectRatio="xMinYMin meet">-->
<!--          <use xlink:href="#icon-btn-bg-svg"></use>-->
<!--        </svg>-->
   
      </div>
<!--    </div>-->
    <button class="s3d__callback">
      <div class="s3d__callback-icon">
        <svg role="presentation">
          <use xlink:href="#icon-callback"></use>
        </svg>
      </div>
      <span>
        Зв’язатись з менеджером
      </span>
    </button>
    <a href="#" class="s3d-flat__pdf js-s3d__create-pdf">PDF</a>
    <div class="s3d-flat__floor">
      <div class="s3d__compass">
        <svg class="icon--Compass" role="presentation">
          <use xlink:href="#icon-Compass"></use>
        </svg>
      </div>
      <svg viewBox="0 0 3843 1680" xmlns="http://www.w3.org/2000/svg" class="s3d-floor__svg">
        <symbol id="closed" viewBox="0 0 30 30">
            <path d="M30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30C23.2843 30 30 23.2843 30 15Z" fill="#A0A6AE"/>
            <path d="M11.8877 13.5517H12.3562V12.1666C12.3562 10.7513 13.5421 9.59961 14.9996 9.59961C16.4578 9.59961 17.6434 10.7511 17.6434 12.1666V13.5517H18.1118C18.3813 13.5517 18.5997 13.7638 18.5997 14.0254V18.7259C18.5997 18.9875 18.3813 19.1996 18.1118 19.1996H11.8876C11.6187 19.1996 11.3997 18.9875 11.3997 18.7259V14.0254C11.3997 13.7638 11.6187 13.5517 11.8877 13.5517ZM16.6677 12.1666C16.6677 11.2734 15.9195 10.5471 14.9997 10.5471C14.08 10.5471 13.3319 11.2734 13.3319 12.1666V13.5517H16.6677V12.1666Z" fill="#2A3341"/>
        </symbol>
        <image src="/wp-content/themes/template/assets/s3d/images/examples/floor.png" xlink:href="/wp-content/themes/template/assets/s3d/images/examples/floor.png" x="0" y="0" height="100%" width="100%" ></image>
        <a xlink:href="/floor/?floor=456" class="svg__flat" data-sec="1" data-all_room="109.54" data-life_room="57.73" data-rooms="4" data-type="4А-9" data-id="456">
           <polygon fill="#85C44" class=" u-svg-plan--active" points="26,8,25,1647,449,1647,450,990,688,991,682,770,539,770,540,13,537,11" data-id="456" data-sec="1" data-all_room="109.54" data-life_room="57.73" data-rooms="4" data-type="4А-9"></polygon>
           <use x="150" y="500" width="150" height="150" xlink:href="#closed"></use>
        </a>
        <a xlink:href="/floor/?floor=457" class="svg__flat" data-sec="1" data-all_room="67.3" data-life_room="35.18" data-rooms="2" data-type="2Б-9" data-id="457">
          <polygon fill="" class="" points="541,10,537,773,1344,771,1343,4" data-id="457" data-sec="1" data-all_room="67.3" data-life_room="35.18" data-rooms="2" data-type="2Б-9"></polygon>
          <use x="750" y="70" width="150" height="150" xlink:href="#closed"></use>
        </a>
        <a xlink:href="/floor/?floor=458" class="svg__flat" data-sec="1" data-all_room="73.12" data-life_room="37.09" data-rooms="2" data-type="2В-9" data-id="458">
             <polygon fill="" class="" points="1343,8,1348,781,2214,778,2211,11" data-id="458" data-sec="1" data-all_room="73.12" data-life_room="37.09" data-rooms="2" data-type="2В-9"></polygon>
        </a>
        <a xlink:href="/floor/?floor=459" class="svg__flat" data-sec="1" data-all_room="71.03" data-life_room="36.47" data-rooms="2" data-type="2Г-9" data-id="459">
             <polygon fill="" class="" points="2212,8,2214,779,3058,777,3057,10" data-id="459" data-sec="1" data-all_room="71.03" data-life_room="36.47" data-rooms="2" data-type="2Г-9"></polygon>
        </a>
        <a xlink:href="/floor/?floor=460" class="svg__flat" data-sec="1" data-all_room="109.84" data-life_room="66.11" data-rooms="5" data-type="5А-9" data-id="460">
             <polygon fill="" class="" points="3058,12,3058,778,3256,778,3256,974,3423,975,3420,1649,3822,1648,3820,9" data-id="460" data-sec="1" data-all_room="109.84" data-life_room="66.11" data-rooms="5" data-type="5А-9"></polygon>
        </a>
        <a xlink:href="/floor/?floor=461" class="svg__flat" data-sec="1" data-all_room="84.14" data-life_room="38.65" data-rooms="2" data-type="2Д-9" data-id="461">
             <polygon fill="" class="" points="2375,977,3255,975,3422,977,3419,1651,2403,1650,2404,1680,2108,1679,2108,1448,2263,1449,2264,1330,2375,1322" data-id="461" data-sec="1" data-all_room="84.14" data-life_room="38.65" data-rooms="2" data-type="2Д-9"></polygon>
        </a>
        <a xlink:href="/floor/?floor=462" class="svg__flat" data-sec="1" data-all_room="82.02" data-life_room="39.12" data-rooms="2" data-type="2А-9" data-id="462">
             <polygon fill="" class="" points="451,990,451,1649,1361,1649,1360,1681,1749,1681,1751,975,688,976,688,994" data-id="462" data-sec="1" data-all_room="82.02" data-life_room="39.12" data-rooms="2" data-type="2А-9"></polygon>
        </a>
    </svg>
      <article class="s3d-floor__nav">
      <p class="s3d-floor__nav-title">План поверху</p>
      <button data-floor_btn data-floor_direction="prev" >
         <svg class="s3d-floor__nav-prev"><use xlink:href="#icon-arrow"></use></svg>
      </button>
      <p data-current-floor="1">1</p>
      <button data-floor_btn data-floor_direction="next">
         <svg class="s3d-floor__nav-next"><use xlink:href="#icon-arrow"></use></svg>
       </button>
    </article>
      <button class="s3d-flat__to--floor" id="s3d-to-floor">
        <span>Перейти до плану поверху</span>
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
