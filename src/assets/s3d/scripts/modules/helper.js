import $ from 'jquery';

class Helper {
  constructor(data) {
    this.conf = [
      ['.s3d__button-right', 'Будинок', 'Натисайте на стрілки<br/> щоб обертати модель'],
      ['.js-s3d__slideModule', 'Фільтр', 'Також Ви можете обертати <br/>модель своєю мишкою'],
      ['.js-s3d__slideModule', 'Меню 3D', 'Також Ви можете обертати <br/>модель своєю мишкою'],
      ['.js-s3d__slideModule', 'Навігація', 'Також Ви можете обертати <br/>модель своєю мишкою'],
      ['.js-s3d__slideModule', 'Фільтрація', 'Також Ви можете обертати <br/>модель своєю мишкою'],
    ];
    this.currentWindow = 0;
  }

  // ['.js-s3d-controller__showFilter', 'circle', 'Ви можете підсвітити<br/> інфраструктуру натиснув<br/> на кнопку', 1.2, 'big']

  init() {
    if (window.localStorage.getItem('info')) return;
    this.createHelper();
    // $('.js-s3d__helper__figure').addClass(`s3d__helper-${this.conf[0][1]}`)
    $('.js-s3d__helper__button').on('click', () => {
      $('.js-s3d__helper__content').removeClass('s3d-active');
      this.currentWindow++;
      if (this.conf.length <= this.currentWindow) {
        this.hiddenHelper();
        return;
      }
      this.update(this.conf[this.currentWindow]);
    });
    this.update(this.conf[0]);

    window.addEventListener('resize', () => {
      if (this.currentWindow >= this.conf.length) return;
      this.update(this.conf[this.currentWindow]);
    });
  }

  createHelper() {
    $('.js-s3d__slideModule').append(createMarkup('div', {
      class: 's3d__helper__wrap js-s3d__helper-wrap',
      content: `<div class="s3d__helper-active js-s3d__helper-active"></div><div class="s3d__helper js-s3d__helper">
        <div class="s3d__helper__close" data-type="close"></div>
        <div class="s3d__helper__title">Кв.<span data-type="title">2А</span></div>
    <div class="s3d__helper__line"></div>
      <div class="s3d__helper__text" data-type="text">Планування знаходиться на іншому будинку. Для перегляду його на 3D моделі вам треба перемкнутися на інший будинок.</div>
    <div class="s3d__helper__link"><span data-type="next">Змінити ракурс</span>
    <div class="s3d__helper__arrow">
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
      </div>`,
    }));
    $('.js-s3d__helper-wrap').addClass('s3d-active');
  }

  update(conf) {
    console.log(conf);
    const target = $(conf[0]);
    console.log(target);
    const height = target.outerHeight();
    const width = target.outerWidth();
    const position = target.offset();
    console.log(position);
    const centerX = position.left + (width / 2);
    const centerY = position.top + (height / 2);
    // const list = $('.js-s3d__helper__figure')[0].classList
    //
    // for (const cl of list) {
    //   if (cl !== 'js-s3d__helper__figure') {
    //     $('.js-s3d__helper__figure').removeClass(cl)
    //   }
    // }
    const size = (width < height) ? width : height;
    // if (conf[4] === 'big') {
    //   size = (width > height) ? width : height
    // } else if (conf[4] === 'small') {
    //   size = (width < height) ? width : height
    // }

    const pos = this.updateContent(target[0]);

    // $('.js-s3d__helper__figure').addClass(`s3d__helper-${conf[1]}`)
    // $('.js-s3d__helper__content').addClass('s3d-active')
    // $('.js-s3d__helper__figure').css({
    //   height: `${size}px`, width: `${size}px`, left: `${centerX}px`, top: `${centerY}px`,
    // })
    // $('.js-s3d__helper__text').html(conf[2])

    const x = this.checkPosContent(centerX, size, pos.width, $('.js-s3d__helper').width() / 2, 1, 20);
    let y = this.checkPosContent(centerY, size, pos.height, $('.js-s3d__helper').height() / 2, 1, 20);

    // else position in center screen translate on top
    if (x === centerX && y === centerY) y = centerY - (size / 2) - 20 - ($('.js-s3d__helper').height() / 2);

    $('.js-s3d__helper').css({ left: `${x}px`, top: `${y}px` });

    // $('.js-s3d__helper__figure')[0].classList.map(cl => {console.log(cl)})
  }

  // вычислить позицию контента,
  checkPosContent(pos, size, sizeWrap, centerScreen, padding) {
    if ((pos < centerScreen) + (centerScreen / 2) && pos > centerScreen - (centerScreen / 2)) return pos;
    if (pos >= centerScreen) {
      return pos - (size / 2) - padding - (sizeWrap / 2);
    }
    return pos + (size / 2) + padding + (sizeWrap / 2);
  }

  hiddenHelper() {
    $('.js-s3d__helper-wrap').removeClass('s3d-active');
    window.localStorage.setItem('info', true);
  }

  updateContent(flat) {
    const wrap = $('.js-s3d__helper-active');
    const cor = flat.getBoundingClientRect();
    wrap.css({
      top: cor.y,
      left: cor.x,
      height: flat.offsetHeight,
      width: flat.offsetWidth,
    });

    wrap.html('');
    wrap.append(flat.cloneNode(true));

    const height = flat.offsetHeight;
    const width = flat.offsetWidth;
    // const top = cor.y + (height / 2)
    return {
      height,
      width,
    };
  }
}

export default Helper;
