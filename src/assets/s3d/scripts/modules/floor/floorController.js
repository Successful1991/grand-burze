class FloorController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    view.on('changeFloorHandler', event => {
      const direction = event.getAttribute('data-floor_direction');
      this._model.changeFloorHandler(direction);
    });

    view.on('clickFloorHandler', polygon => {
      const id = polygon.getAttribute('data-id');
      const sold = polygon.getAttribute('data-sold');

      if (!id || sold) return;
      this._model.selectFlat(id);
    });

    view.on('updateHoverDataFlat', event => {
      this._model.updateHoverDataFlat(event);
    });
  }
}

export default FloorController;
