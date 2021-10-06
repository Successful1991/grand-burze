class FlatController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    view.on('changeFloorHandler', event => {
      const direction = event.getAttribute('data-floor_direction');
      this._model.changeFloorHandler(direction);
    });

    view.on('clickFlatHandler', elem => {
      // eslint-disable-next-line radix
      const id = parseInt(elem.getAttribute('data-id'));
      if (id) return;
      this._model.update(id);
    });
    view.on('toFloorPlan', () => {
      this._model.toFloorPlan();
    });
    view.on('look3d', () => {
      this._model.look3d();
    });
    view.on('changeRadioType', elem => {
      const type = elem.getAttribute('data-type');
      if (!type) return;
      this._model.radioTypeHandler(type);
    });
    view.on('changeRadioView', elem => {
      const type = elem.getAttribute('data-type');
      if (!type) return;
      this._model.radioViewHandler(type);
    });
    view.on('changeRadioChecked', event => {
      this._model.radioCheckedHandler(event.control.checked);
    });
    // view.on('updateHoverDataFlat', event => {
    //   this._model.updateMiniInfo(event);
    // });

    view.on('clickPdfHandler', elem => {
      // eslint-disable-next-line radix
      const id = parseInt(elem.getAttribute('data-id'));
      if (id) return;
      this._model.getPdfLink(id);
    });
  }
}

export default FlatController;
