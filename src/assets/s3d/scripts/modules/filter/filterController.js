class FilterController {
  constructor(model, view) {
    this._model = model;
    this._view = view;

    view.on('resizeHandler', () => {
      model.resize();
    });
    view.on('resetFilter', () => {
      model.resetFilter();
    });
    view.on('changeFilterHandler', () => {
      model.filterFlatStart();
    });
    view.on('reduceFilterHandler', () => {
      model.changeListScrollBlocked(true);
      model.reduceFilter();
    });
    view.on('changeListScrollBlocked', value => {
      model.changeListScrollBlocked(value);
    });
  }
}

export default FilterController;
