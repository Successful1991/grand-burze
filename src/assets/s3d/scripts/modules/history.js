class History {
  constructor(data) {
    this.history = [];
    this.updateFsm = data.updateFsm;
    this.update = this.update.bind(this);
    this.replaceUrl = this.replaceUrl.bind(this);
    this.stepBack = this.stepBack.bind(this);
    this.init();
  }

  init() {
    window.onpopstate = e => {
      this.stepBack(e.state);
      return true;
    };
  }

  stepBack(data) {
    const config = data ?? this.history;
    this.updateFsm(config, false);
  }

  update(name) {
    window.history.pushState(
      name, '3dModule', this.createUrl(name),
    );
    this.history = name;
  }

  replaceUrl(name) {
    window.history.replaceState(
      name, '3dModule', this.createUrl(name),
    );
  }

  createUrl(data) {
    const entries = Object.entries(data);
    const href = entries.reduce((acc, [key, value]) => `${acc}&${key}=${value}`, '');
    return `?${encodeURIComponent(href)}`;
  }
}

export default History;
