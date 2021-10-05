class FlatController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    view.on('changeFloorHandler', event => {
      const direction = event.currentTarget.dataset.floor_direction;
      this._model.changeFloorHandler(direction);
    });

    view.on('clickFlatHandler', event => {
      event.preventDefault();
      this._model.update(+event.currentTarget.dataset.id);
    });
    view.on('toFloorPlan', () => {
      this._model.toFloorPlan();
    });
    view.on('look3d', () => {
      this._model.look3d();
    });
    view.on('changeRadioType', event => {
      this._model.radioTypeHandler(event.currentTarget.dataset.type);
    });
    view.on('changeRadioView', event => {
      this._model.radioViewHandler(event.currentTarget.dataset.type);
    });
    view.on('changeRadioChecked', event => {
      this._model.radioCheckedHandler(event.currentTarget.control.checked);
    });
    // view.on('updateHoverDataFlat', event => {
    //   this._model.updateMiniInfo(event);
    // });

    view.on('clickPdfHandler', event => {
      this._model.getPdfLink(event.currentTarget.dataset.id);
    });
  }
}

export default FlatController;
