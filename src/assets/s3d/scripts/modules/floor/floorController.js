class FloorController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    view.on('changeFloorHandler', event => {
      const direction = event.getAttribute('data-floor_direction');
      this._model.changeFloorHandler(direction);
    });

    view.on('clickFloorHandler', event => {
      const id = event.getAttribute('data-id');
      if (!id) return;
      this._model.selectFlat(id);
    });

    view.on('updateHoverDataFlat', event => {
      this._model.updateHoverDataFlat(event);
    });
  }
}

export default FloorController;
