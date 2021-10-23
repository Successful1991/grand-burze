import $ from 'jquery';
import EventEmitter from '../eventEmitter/EventEmitter';
import { delegateHandler } from '../general/General';

class FavouritesView extends EventEmitter {
  constructor(model, elements, i18n) {
    super();
    this._model = model;
    this._elements = elements;
    this.i18n = i18n;

    document.querySelector('.js-s3d__favourite-open').addEventListener('click', elem => {
      this.emit('clickFavouriteOpen');
    });

    document.querySelector('.js-s3d__slideModule').addEventListener('click', event => {
      const favouriteAdd = delegateHandler('.js-s3d-add__favourite', event);
      if (!_.isObject(favouriteAdd) || !favouriteAdd || event.target.tagName === 'INPUT') return;
      event.preventDefault();
      this.emit('clickFavouriteHandler', favouriteAdd);
    });

    document.querySelector('#js-s3d__favourites')
      .addEventListener('click', event => {
        const close = delegateHandler('.js-s3d-card__close', event);
        const card = delegateHandler('.js-s3d-card', event);
        // const favouriteAdd = delegateHandler('.js-s3d-add__favourite', event);

        switch (true) {
            case _.isObject(close):
              this.emit('removeElement', close);
              break;
            case _.isObject(card):
              this.emit('clickElementHandler', card);
              break;
            default:
              break;
        }
      });

    model.on('clearAllHtmlTag', tag => { this.clearHtml(tag); });
    model.on('setInPageHtml', tag => { this.addElementInPage(tag); });
    model.on('removeElemInPageHtml', id => { this.removeCardInPage(id); });
    model.on('animateFavouriteElement', data => { this.animateFavouriteElement(data); });

    model.on('updateFavouritesInput', favourites => { this.updateFavouritesInput(favourites); });
    model.on('updateCountFavourites', value => this.updateCountFavourites(value));
    model.on('updateViewAmount', value => { this.viewAmountFavourites(value); });
  }

  removeCardInPage(id) {
    document.querySelector(`.js-s3d-fv .js-s3d-card[data-id="${id}"]`).remove();
  }

  clearHtml(tag) {
    $(tag).remove();
  }

  addElementInPage(favourites) {
    $('.js-s3d-fv__list').append(...favourites);
  }

  updateFavouritesInput(favourites) {
    const prevSelector = '.js-s3d-add__favourite input:checked';
    const selector = '.js-s3d-add__favourite';
    const prevElements = document.querySelectorAll(prevSelector);
    prevElements.forEach(elem => {
      const label = elem.closest('[data-id]');
      // eslint-disable-next-line radix
      const id = parseInt(label.getAttribute('data-id'));
      if (favourites.includes(id)) return;
      elem.checked = false;
    });
    favourites.forEach(id => {
      const elements = [...document.querySelectorAll(`${selector}[data-id='${id}']`)];
      elements.forEach(elem => {
        const input = elem.querySelector('input');
        input.checked = true;
      });
    });
  }

  updateCountFavourites(count) {
    this.updateCount(count);
    this.updateCountWithText(count);
  }

  updateCount(count) {
    const elements = document.querySelectorAll('.js-s3d__favourite-count');
    elements.forEach(elem => {
      // eslint-disable-next-line no-param-reassign
      elem.innerHTML = count;
      // eslint-disable-next-line no-param-reassign
      elem.setAttribute('data-count', count);
    });
  }

  updateCountWithText(count) {
    const countContainer = document.querySelector('.js-s3d__fv-count');
    countContainer.innerHTML = this.i18n.t('favourite--added', { apartments: count });
  }

  viewAmountFavourites(flag) {
    if (flag) {
      $('.js-s3d-favorite__wrap').removeClass('s3d-hidden');
      $('.js-s3d-ctr__favourites-bg').addClass('s3d-show');
    } else {
      $('.js-s3d-favorite__wrap').addClass('s3d-hidden');
      $('.js-s3d-ctr__favourites-bg').removeClass('s3d-show');
    }
  }
}

export default FavouritesView;
