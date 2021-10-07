import $ from 'jquery';

class FavouritesController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    view.on('clickFavouriteOpen', () => {
      model.openFavouritesHandler();
    });

    view.on('clickFavouriteAdd', element => {
      model.changeFavouritesHandler(element);
    });

    view.on('removeElement', event => {
      const element = $(event.target).closest('.js-s3d-card');
      const id = +element.dataset.id;
      if (!id) return;
      model.removeElemStorage(id);
    });

    view.on('clickElementHandler', event => {
      if (event.target.classList.contains('js-s3d-card__close') || event.target.classList.contains('js-s3d-add__favourite')) return;
      model.selectElementHandler(+event.currentTarget.dataset.id);
    });
  }
}

export default FavouritesController;
