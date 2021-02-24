import $ from 'jquery';

class InfoBox {
  constructor(data) {
    this.infoBox = '';
    this.infoBoxStateActive = false;
    this.infoBoxShow = true;
    this.hoverFlatId = null;
    this.activeFlat = data.activeFlat;
    this.updateFsm = data.updateFsm;
    this.state = 'static';
    this.stateConfig = ['static', 'hover', 'active'];
    this.history = data.history;
    this.changeState = this.changeState.bind(this);
    this.disable = this.disable.bind(this);
    this.init();
  }

  init() {
    this.createInfo();
    this.infoBox.on('click', '.js-s3d-infoBox__close', () => {
      this.updateState('static');
    });

    this.infoBox.on('click', '.s3d-infoBox__link', event => {
      event.preventDefault();
      if (_.has(event.currentTarget.dataset, 'id')) {
        this.activeFlat = +event.currentTarget.dataset.id;
      } else {
        return;
      }

      this.history.update({ type: 'flat', method: 'general', id: this.activeFlat });
      this.updateState('static');

      this.updateFsm({
        type: 'flat', method: 'general',
      }, this.activeFlat);
    });
  }

  // updateState use only from this class. change state without check exceptions
  updateState(state, flat) {
    if (this.stateConfig.includes(state)) {
      this.state = state;
    }
    this.dispatch(flat);
  }

  changeState(value, flat = null) {
    const id = _.has(flat, 'id') ? _.toNumber(flat.id) : undefined;
    if (this.state === 'active') {
      if (this.state !== value) {
        return;
      }
      this.hoverFlatId = id;
      this.updateInfo(flat);
      return;
    }

    if (checkValue(flat)) {
      this.updateState('static', null);
      return;
    }
    if (value === 'hover') {
      if (id === this.hoverFlatId) {
        // return;
      } else if (value === this.state) {
        this.hoverFlatId = id;
        this.updateInfo(flat);
      } else {
        this.updateState(value, flat);
      }
    } else if (value !== this.state) {
      this.updateState(value, flat);
    }
  }

  dispatch(flat) {
    switch (this.state) {
        case 'static':
          this.hoverFlatId = null;
          this.infoBox.removeClass('s3d-infoBox-active');
          this.infoBox.removeClass('s3d-infoBox-hover');
          break;
        case 'hover':
          this.hoverFlatId = +flat.id;
          this.infoBox.removeClass('s3d-infoBox-active');
          this.infoBox.addClass('s3d-infoBox-hover');
          this.updateInfo(flat, true);
          break;
        case 'active':
          this.hoverFlatId = +flat.id;
          this.infoBox.addClass('s3d-infoBox-active');
          this.infoBox.removeClass('s3d-infoBox-hover');
          this.infoBox.find('.s3d-infoBox__link')[0].dataset.id = flat.id;
          this.infoBox.find('.s3d-infoBox__add-favourites')[0].dataset.id = flat.id;
          this.updateInfo(flat, true);
          break;
        default:
          this.hoverFlatId = null;
          this.infoBox.removeClass('s3d-infoBox-active');
          this.infoBox.removeClass('s3d-infoBox-hover');
          break;
    }
  }

  update(flat, state) {
    this.updateInfo(flat);
    if (state !== undefined) {
      this.updateState(state);
    }
  }

  disable(value) {
    if (this.infoBox === '') {
      return;
    }
    if (value) {
      this.infoBox.addClass('s3d-infoBox__disable');
    } else {
      this.infoBox.removeClass('s3d-infoBox__disable');
    }
  }

  createInfo() {
    this.infoBox = $('.js-s3d-infoBox');
  }

  updateInfo(e, ignore) {
    if (_.isUndefined(e)) {
      return;
    }
    this.infoBox.find('.js-s3d-infoBox__table-number')[0].textContent = `${e.number || ''}`;
    this.infoBox.find('.js-s3d-infoBox__table-floor')[0].textContent = `${e.floor || ''}`;
    this.infoBox.find('.js-s3d-infoBox__table-room')[0].textContent = `${e.rooms || ''}`;
    this.infoBox.find('.js-s3d-infoBox__type span')[0].textContent = `${e.type || ''}`;
    this.infoBox.find('.js-s3d-infoBox__table-area')[0].textContent = `${e.all_room || ''}`;
    this.infoBox.find('.js-s3d-infoBox__image')[0].src = (e.img_small || `${defaultProjectPath}/s3d/images/examples/no-image.png}`);
    this.infoBox.find('.js-s3d-add__favourites input')[0].checked = e.favourite || false;
  }
}
export default InfoBox;
