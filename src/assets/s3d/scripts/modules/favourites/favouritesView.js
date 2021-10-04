import $ from 'jquery';
import EventEmitter from '../eventEmitter/EventEmitter';

class FavouritesView extends EventEmitter {
  constructor(model, elements, i18n) {
    super();
    this._model = model;
    this._elements = elements;
    this.i18n = i18n;

    document.querySelector('.js-s3d__favourite-open').addEventListener('click', elem => {
      this.emit('clickFavouriteOpen');
    });

    $('.js-s3d__slideModule').on('change', '.js-s3d-add__favourite', event => {
      this.emit('clickFavouriteAdd', event);
    });
    $('.js-s3d-fv').on('click', '.js-s3d-card__close', event => {
      this.emit('removeElement', event);
    });
    $('.js-s3d-fv').on('click', '.js-s3d-card', event => {
      this.emit('clickElementHandler', event);
    });

    model.on('clearAllHtmlTag', tag => { this.clearHtml(tag); });
    model.on('updateFvCount', value => { this.updateCountFavouritesContainer(value); });
    model.on('updateFavouriteAmount', value => { this.updateAmount(value); });
    model.on('updateViewAmount', value => { this.viewAmountFavourites(value); });
    model.on('setInPageHtml', tag => { this.addElementInPage(tag); });
    model.on('removeElemInPageHtml', elem => { this.removeCardInPage(elem); });
    model.on('animateFavouriteElement', data => { this.animateFavouriteElement(data); });
  }

  removeCardInPage(id) {
    document.querySelector(`.js-s3d-card[data-id="${id}"]`).remove();
  }

  clearHtml(tag) {
    $(tag).remove();
  }

  addElementInPage(favourites) {
    $('.js-s3d-fv__list').append(...favourites);
  }

  updateAmount(value) {
    const counts = document.querySelectorAll('.js-s3d__favourite-count');
    counts.forEach(count => {
      // eslint-disable-next-line no-param-reassign
      count.innerHTML = value;
      // eslint-disable-next-line no-param-reassign
      count.dataset.count = value;
    });
    // $('.js-s3d__favourite-count').html(value);
    // $('.js-s3d-favourites').attr('count', value);
    $('.js-s3d__amount-flat__selected').html(value);
  }

  updateCountFavouritesContainer(count) {
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
