class FilterController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    view.on('resetFilter', () => {
      model.resetFilter();
    });
    view.on('changeFilterHandler', () => {
      model.changeFilterParam();
    });
    view.on('resizeHandler', () => {
      model.deb(model);
    });
  }
}

export default FilterController;
