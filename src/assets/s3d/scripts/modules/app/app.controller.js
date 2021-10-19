class AppController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    view.on('chooseSlider', event => this._model.selectSlideHandler(event));
    view.on('resize', () => model.deb(model));
    view.on('clickBackHandler', () => {
      window.history.back();
    });
    view.on('chooseHandler', type => {
      this._model.changeChooseActive(type);
    });
    view.on('clickToHomeHandler', () => {
      this._model.history.update(model.defaultFlybySettings);
      model.updateFsm(model.defaultFlybySettings);
    });
  }
}

export default AppController;
