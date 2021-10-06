import $ from 'jquery';

function addBlur(wrap, time) {
  $(wrap).addClass('s3d-blur');
  setTimeout(() => {
    $(wrap).removeClass('s3d-blur');
  }, time || 700);
}

function unActive() {
  $('.js-s3d__slideModule').removeClass('s3d-unActive');
}

function preloader() {
  const state = {
    showing: false,
    mini: false,
  };
  return {
    show() {
      state.showing = true;
      $('.fs-preloader').addClass('preloader-active');
      $('.fs-preloader-bg').css({ filter: 'blur(10px)' });
    },
    hide() {
      state.showing = false;
      setTimeout(() => {
        $('.fs-preloader').removeClass('preloader-active');
        $('.fs-preloader-bg').css({ filter: 'none' });
        this.miniOff();
      }, 200);
    },
    turnOn(el) {
      if (el && el.length > 0) {
        el.addClass('s3d-unActive').prop('disabled', true);
        return;
      }
      const arr = ['.s3d__button', '.js-s3d-select[data-type="plannings"]', '.js-s3d-controller__openFilter'];
      arr.forEach(name => {
        $(name).addClass('s3d-unActive').prop('disabled', true);
      });
    },
    turnOff(el) {
      if (el && el.length > 0) {
        el.removeClass('s3d-unActive').prop('disabled', false);
        return;
      }
      const arr = ['.s3d__button', '.js-s3d-select[data-type="plannings"]', '.js-s3d-controller__openFilter'];
      arr.forEach(name => {
        $(name).removeClass('s3d-unActive').prop('disabled', false);
      });
    },
    miniOn() {
      state.mini = true;
      $('.js-fs-preloader-before').addClass('preloader-active');
    },
    miniOff() {
      state.mini = false;
      $('.js-fs-preloader-before').removeClass('preloader-active');
    },
    checkState() {
      return { ...state };
    },
  };
}

function preloaderWithoutPercent() {
  return {
    isAnimating: false,
    show() {
      this.isAnimating = true;
      $('.js-s3d-preloader').addClass('preloader-active');
      setTimeout(() => { this.isAnimating = false; });
    },
    hide() {
      if (!this.isAnimating) {
        $('.js-s3d-preloader').removeClass('preloader-active');
        return;
      }
      setTimeout(() => {
        this.hide();
      }, 500);
    },
  };
}

function updateFlatFavourite(wrap, flat) {
  const input = $(`${wrap} [data-id="${flat.id}"]`).find('input');
  input.prop('checked', flat.favourite);
}

const compass = {
  setDeg(deg) {
    $('.s3d-ctr__compass svg').css('transform', `rotate(${deg}deg)`);
  },

  setSlide(activeSlide) {
    let deg;
    if (activeSlide >= 0) {
      this.compass.current = activeSlide + 1;
      deg = (360 / 120 * (activeSlide + 1)) + (360 / 120 * this.compass.default);
    } else {
      deg = this.compass.defaultDeg;
    }
    $('.s3d-ctr__compass svg').css('transform', `rotate(${deg}deg)`);
  },
};

function debounce(f, t) {
  return function (args) {
    const previousCall = this.lastCall;
    this.lastCall = Date.now();
    if (previousCall && ((this.lastCall - previousCall) <= t)) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => f(args), t);
  };
}

function delegateHandler(tag, event) {
  return event.target.closest(tag);
}

export {
  addBlur,
  unActive,
  preloader,
  updateFlatFavourite,
  preloaderWithoutPercent,
  compass,
  debounce,
  delegateHandler,
};
