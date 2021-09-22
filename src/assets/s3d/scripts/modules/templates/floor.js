function Floor(i18n) {
  return `
  <div class="s3d-floor js-s3d-floor">
    <div class="s3d-floor__info">
      <div class="s3d-flat__info">
        <p class="s3d-info__title">10 Поверх</p>
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
          </tbody>
        </table>
      </div>
    </div>
    <svg viewBox="0 0 3843 1680" xmlns="http://www.w3.org/2000/svg" class="s3d-floor__svg">
      <image src="/wp-content/themes/template/assets/s3d/images/examples/floor.png" xlink:href="/wp-content/themes/template/assets/s3d/images/examples/floor.png" x="0" y="0" height="100%" width="100%" ></image>
      <a xlink:href="/floor/?floor=456" class="svg__flat" data-sec="1" data-all_room="109.54" data-life_room="57.73" data-rooms="4" data-type="4А-9" data-id="456">
           <polygon fill="#85C44" class=" u-svg-plan--active" points="26,8,25,1647,449,1647,450,990,688,991,682,770,539,770,540,13,537,11" data-id="456" data-sec="1" data-all_room="109.54" data-life_room="57.73" data-rooms="4" data-type="4А-9"></polygon>
      </a>
      <a xlink:href="/floor/?floor=457" class="svg__flat" data-sec="1" data-all_room="67.3" data-life_room="35.18" data-rooms="2" data-type="2Б-9" data-id="457">
           <polygon fill="" class="" points="541,10,537,773,1344,771,1343,4" data-id="457" data-sec="1" data-all_room="67.3" data-life_room="35.18" data-rooms="2" data-type="2Б-9"></polygon>
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
      <button data-floor_btn data-floor_direction="prev" > < </button>
      <p data-current-floor="1">1</p>
      <button data-floor_btn data-floor_direction="next"> > </button>
    </article>
    <div class="s3d-floor__border-horizontal"></div>
    <div class="s3d-floor__border-vertical"></div>
    <div class="s3d-floor__bg"></div>
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
    <div class="s3d-floor__flat">
      <div class="s3d__compass">
        <svg class="icon--Compass" role="presentation">
          <use xlink:href="#icon-Compass"></use>
        </svg>
      </div>
      <div class="s3d-flat__info">
        <p class="s3d-info__title">3-кімнатна</p>
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
          </tbody>
        </table>
      </div>
      <div class="peculiarities">
        <div class="peculiarity">
          <svg><use xlink:href="#icon-peculiarity-terrace"></use></svg>
          <div class="peculiarity__desc">Тераса</div>
        </div>
        <div class="peculiarity">
          <svg><use xlink:href="#icon-peculiarity-terrace"></use></svg>
          <div class="peculiarity__desc">Тераса</div>
        </div>
      </div>
    </div>
  </div>
`;
}

export default Floor;
