class FloorController {
  constructor(model, view) {
    this._model = model;
    this._view = view;
    // view.on('clickBackHandler', event => {
    //   window.history.back()
    //   // this._model.history.stepBack({ type: 'complex', method: 'general' })
    //   // model.updateFsm('complex', 'general')
    // })
    view.on('changeFloorHandler', event => {
      const direction = event.target.dataset.floor_direction;
      this._model.changeFloorHandler(direction);
    });

    view.on('clickFloorHandler', event => {
      event.preventDefault();
      // debugger
      this._model.history.update({
        type: 'floor',
        method: 'general',
        ...this._model.configProject.search,
      });
      this._model.getNewFlat(event.currentTarget.dataset.id);
    });
    // view.on('floorReturnHandler', () => {
    // // debugger;
    //   this._model.history.update({
    //     type: 'flyby',
    //     method: 'search',
    //     search: this._model.configProject.search,
    //   });
    //   this._model.updateFsm({
    //     type: 'flyby',
    //     method: 'search',
    //     search: this._model.configProject.search,
    //   });
    // });

    view.on('updateHoverDataFloor', event => {
      this._model.updateMiniInfo(event);
    });
  }
}

export default FloorController;
