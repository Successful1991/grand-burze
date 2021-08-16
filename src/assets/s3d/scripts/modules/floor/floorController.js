class FloorController {
  constructor(model, view) {
    this._model = model;
    this._view = view;
    // view.on('clickBackHandler', event => {
    //   window.history.back()
    //   // this._model.history.stepBack({ type: 'complex', method: 'general' })
    //   // model.updateFsm('complex', 'general')
    // })
    view.on('clickFloorHandler', event => {
      event.preventDefault();
      this._model.history.update({ type: 'floor', method: 'general', id: event.currentTarget.dataset.id });
      this._model.getNewFlat(event.currentTarget.dataset.id);
    });
    view.on('floorReturnHandler', () => {
      this._model.history.update({
        type: 'flyby',
        method: 'search',
        house: this._model.configProject.house,
        floor: this._model.configProject.floor,
      });
      this._model.updateFsm({
        type: 'flyby',
        method: 'search',
        house: this._model.configProject.house,
        floor: this._model.configProject.floor,
      }, this._model.activeFlat);
    });

    view.on('updateHoverDataFloor', event => {
      this._model.updateMiniInfo(event);
    });
  }
}

export default FloorController;
