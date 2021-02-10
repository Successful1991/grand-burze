import $ from 'jquery';
import async from './async/async';

class Helper {
  constructor(data) {
    const steps = [
      '.js-s3d-helper__svg',
      '.js-s3d-ctr__elem',
      ['.js-s3d__button-left', '.js-s3d__button-right'],
    ];
    // this.conf = [
    //   // ['.js-s3d-helper__svg', 'Фільтр', 'Чтобы посмотреть доступные квартиры воспользуйтесь фильтром, что-бы увидеть где есть квартиры по выбранным параметрам '],
    //   ['.js-s3d-ctr__open-filter', 'Фільтр', 'Чтобы посмотреть доступные квартиры воспользуйтесь фильтром, что-бы увидеть где есть квартиры по выбранным параметрам '],
    //   ['.js-s3d-ctr__elem', 'Меню 3D', 'ТВи можете переміщуватися через допоміжне меню модуля для зручності у навігації'],
    //   [['.js-s3d__button-left', '.js-s3d__button-right'], 'Навігація', 'Оберіть зручний ракурс для перегляду генплану, затиснувши ліву кнопку миші та переміщаючи мишу або натискаючи стрілочки '],
    //   // ['.js-s3d-filter', 'Фільтрація', 'Ви можете фільтрувати квартири за такими параметрами як: поверх, площа та кількість кімнат'],
    // ];
    this.currentWindow = 0;
  }

  async init() {
    if (window.localStorage.getItem('info')) return;

    await $.ajax('/wp-content/themes/template/static/configHelper.json')
      .then(responsive => this.setConfig(responsive));

    this.createHelper();
    $('.js-s3d__helper__close').on('click', () => {
      this.hiddenHelper();
    });

    $('.js-s3d__helper__link').on('click', () => {
      $('.js-s3d__helper__content').removeClass('s3d-active');
      this.currentWindow++;
      if (this.conf.length <= this.currentWindow) {
        this.hiddenHelper();
        return;
      }
      this.update(this.conf[this.currentWindow]);
    });
    this.update(this.conf[0]);

    const openHelper = $('.js-s3d-ctr__open-helper')
    if (_.size(openHelper) > 0) {
      openHelper.on('click', () => {
        this.currentWindow = 0;
        this.update(this.conf[0]);
        this.showHelper();
      });
    }


    window.addEventListener('resize', () => {
      if (this.currentWindow >= this.conf.length) return;
      this.update(this.conf[this.currentWindow]);
    });
  }

  setConfig(config) {
    let type = 'desktop';
    if (document.documentElement.offsetWidth < 992) {
      type = 'mobile';
    }
    const lang = $('html')[0].lang || 'uk';
    this.conf = config[type][lang];
  }

  createHelper() {
    this.helper = createMarkup('div', {
      class: 's3d__helper__wrap js-s3d__helper-wrap',
      content: `<div class="s3d__helper__active js-s3d__helper__active"></div>
        <div class="s3d__helper js-s3d__helper" data-step="0">
        <div class="s3d__helper__close js-s3d__helper__close" data-type="close"></div>
        <div class="s3d__helper__title"  data-type="title"></div>
        <div class="s3d__helper__line"></div>
        <div class="s3d__helper__text" data-type="text"></div>
        <div class="s3d__helper__link js-s3d__helper__link"><span data-type="next">Далі</span>
          <div class="s3d__helper__link-arrow">
      <svg width="41" height="14" viewBox="0 0 41 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M41 7H1M1 7L7 1M1 7L7 13" stroke="#CFBE97"></path>
      </svg>
      </div>
        </div>
        <div class="s3d__helper__lines-top">
      <svg viewBox="0 0 236 31" fill="none" preserveAspectRatio="xMinYMax meet" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 1V30H1V1H30Z" stroke="#CFBE97" fill="none" stroke-width="2"></path>
      <path d="M7 25V7H12.6667V24H18.3333V7H24V25" fill="none" stroke="#CFBE97" stroke-width="2"></path>
      <path d="M51 1L236 1" stroke="#CFBE97" fill="none" stroke-width="2"></path>
      </svg>
      </div>
        <div class="s3d__helper__lines-right">
      <svg viewBox="0 0 2 320" fill="none" preserveAspectRatio="xMinYMax slice" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 0L1 320" stroke="#CFBE97" stroke-width="2" fill="none"></path>
      </svg>
      </div>
        <div class="s3d__helper__lines-bottom">
      <svg viewBox="0 0 236 26" fill="none" preserveAspectRatio="xMinYMax meet" xmlns="http://www.w3.org/2000/svg">
      <path d="M236 1L1 1L1 13L235 13L235 25L2.86197e-07 25" stroke="#CFBE97" stroke-width="2" fill="none"></path>
      </svg>
      </div>
        <div class="s3d__helper__arrow">
          <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 17V3L8 10L1 17Z" stroke="#CFBE97" stroke-width="2"/>
            <path d="M14 17V3L21 10L14 17Z" stroke="#CFBE97" stroke-width="2"/>
          </svg>
        </div>  
      </div>`,
    });
    $('.js-s3d__slideModule').append(this.helper);
    $('.js-s3d__helper-wrap').addClass('s3d-active');
  }

  update(conf) {
    const result = [];
    const wrap = $('.js-s3d__helper__active');
    wrap.html('');
    if (_.isString(conf.elem)) {
      result.push(this.updateActiveElement($(conf.elem)[0]));
    } else {
      result.push(conf.elem.map(name => this.updateActiveElement($(name)[0])));
    }

    this.updateContent(conf)
    $('.js-s3d__helper')[0].dataset.step = this.currentWindow;
    wrap.append(...result);
  }

  showHelper() {
    $('.js-s3d__helper-wrap').addClass('s3d-active');
  }

  hiddenHelper() {
    $('.js-s3d__helper-wrap').removeClass('s3d-active');
    window.localStorage.setItem('info', true);
  }

  updateContent(config) {
    const wrap = $('.js-s3d__helper-wrap');
    wrap.find('[data-type="title"]').html(config.title);
    wrap.find('[data-type="text"]').html(config.text);
    wrap.find('[data-type="next"]').html(config.linkName);
  }

  updateActiveElement(flat) {
    const node = flat.cloneNode(true);
    const cor = flat.getBoundingClientRect();
    node.style.position = 'absolute';
    node.style.transform = 'none';
    node.style.top = `${cor.y}px`;
    node.style.left = `${cor.x}px`;
    node.style.height = `${flat.offsetHeight}px`;
    node.style.width = `${flat.offsetWidth}px`;
    return node;
  }
}

export default Helper;
