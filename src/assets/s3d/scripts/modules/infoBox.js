import $ from 'jquery';
import placeElemInWrapperNearMouse from './placeElemInWrapperNearMouse';

class InfoBox {
  constructor(data) {
    this.infoBox = '';
    this.hoverFlatId = null;
    this.activeFlat = data.activeFlat;
    this.updateFsm = data.updateFsm;
    this.getFlat = data.getFlat;
    this.getFloor = data.getFloor;
    // this.state = 'static';
    this.state = {
      type: data.$typeSelectedFlyby.value,
    };
    this.stateUI = {
      status: 'static',
    };
    this.stateConfig = ['static', 'hover', 'active'];
    this.$typeSelectedFlyby = data.$typeSelectedFlyby;
    this.history = data.history;
    this.isInfoBoxMoving = false;
    this.changeState = this.changeState.bind(this);
    this.disable = this.disable.bind(this);
    this.init();
  }

  init() {
    this.$typeSelectedFlyby.subscribe(type => {
      this.state.type = type;
    });
    this.createInfo();
    this.infoBox.on('click', '[data-s3d-event=closed]', () => {
      this.updateState('static');
      this.removeSvgFlatActive();
    });
    this.infoBox.on('click', '[data-s3d-event=transition]', event => {
      event.preventDefault();
      if (_.has(event.currentTarget.dataset, 'id')) {
        this.activeFlat = +event.currentTarget.dataset.id;
      } else {
        return;
      }
      
      this.history.update({ type: this.state.type, method: 'general', id: this.activeFlat });
      // this.history.update({ type: 'flat', method: 'general', id: this.activeFlat });
      this.updateState('static');

      this.updateFsm({
        type: this.state.type, method: 'general',
      }, this.activeFlat);
      // this.updateFsm({
      //   type: 'flat', method: 'general',
      // }, this.activeFlat);
    });

    if (this.isInfoBoxMoving) {
      this.infoBox.addClass('s3d-infoBox__moving');
    }
  }

  removeSvgFlatActive() {
    $('.js-s3d__svgWrap .active-flat').removeClass('active-flat');
  }

  // updateHoverFlat(id) {
  //   this.hoverFlatId$.next(id);
  // }

  // updateState use only from this class. change state without check exceptions
  updateState(state, flat) {
    if (this.stateConfig.includes(state)) {
      this.stateUI.status = state;
    }
    this.dispatch(flat);
  }

  changeState(value, id = null) {
    let flat = null;
    switch (this.$typeSelectedFlyby.value) {
        case 'flat':
          flat = this.getFlat(id);
          break;
        case 'floor':
          // debugger
          flat = this.getFloor(id);
          break;
        default:
          flat = this.getFlat(id);
          break;
    }
    if (!id) {
      flat = null;
    }

    // const flat = (flatId) ? this.getFlat(flatId) : flatId;
    // const id = _.has(flat, 'id') ? _.toNumber(flat.id) : undefined;
    if (this.stateUI.status === 'active') {
      if (this.stateUI.status !== value) {
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
      } else if (value === this.stateUI.status) {
        this.hoverFlatId = id;
        this.updateInfo(flat);
      } else {
        this.updateState(value, flat);
      }
    } else if (value !== this.stateUI.status) {
      this.updateState(value, flat);
    }
  }

  dispatch(flat) {
    switch (this.stateUI.status) {
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
          this.infoBox.find('[data-s3d-update=id]').data('id', flat.id);
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
    this.infoBox = $('[data-s3d-type=infoBox]');
  }

  updatePosition(e) {
    if (!this.isInfoBoxMoving) {
      return;
    }
    // передвигаем блок за мышкой
    // const pos = $('.s3d__wrap').offset();
    // const x = e.pageX - pos.left;
    // const y = e.pageY - pos.top;
    const { x, y } = placeElemInWrapperNearMouse(this.infoBox, $(window), e);
    this.infoBox.css({
      top: y,
      opacity: '1',
      left: x,
    });
  }

  updateInfo(flat, ignore) {
    if (_.isUndefined(flat)) {
      return;
    }
    console.log(this.state.type, flat);
    switch (this.state.type) {
        case 'floor':
          this.renderInfoFloor(flat);
          break;
        case 'flat':
          this.renderInfoFlat(flat);
          break;
        default:
          break;
    }
    // const keys = ['rooms', 'floor', 'number', 'type'];
    // keys.map(key => {
    //   this.infoBox.find(`[data-s3d-update=${key}]`)[0].textContent = `${e[key] || ''}`;
    //   return key;
    // });
    // this.infoBox.find('.js-s3d-add__favourites')[0].dataset.id = e.id;
    // const elemUpdateId = this.infoBox[0].querySelectorAll('[data-s3d-update=id]');
    // elemUpdateId.forEach(element => {
    //   const el = element;
    //   el.dataset.id = e.id;
    // });
    // this.infoBox.find('[data-s3d-update=area]')[0].textContent = `${e.area || ''}`;
    // this.infoBox.find('[data-s3d-update="image"]')[0].src = e['img_small'] ? e['img_small'] : `${defaultProjectPath}/s3d/images/examples/no-image.png`;
    // this.infoBox.find('[data-s3d-update=checked]')[0].checked = e.favourite || false;
  }

  renderInfoFloor(flat) {
    this.infoBox.html(`
      <div class="s3d-card__bottom s3d-fon-monreal__bottom">
        <div class="s3d-card__table">
          <table class="s3d-card__table">
            <tbody>
              <tr class="s3d-card__row">
                <td class="s3d-card__name">Этаж</td>
                <td class="s3d-card__value" data-s3d-event="update" data-s3d-update="floor">${flat.floor}</td>
              </tr>
              
              <tr class="s3d-card__row">
                <td class="s3d-card__name">Квартир:</td>
                <td class="s3d-card__value" data-s3d-event="update" data-s3d-update="rooms">${flat.count}</td>
              </tr>
              <tr class="s3d-card__row">
                <td class="s3d-card__name">Вільних:</td>
                <td class="s3d-card__value" data-s3d-event="update" data-s3d-update="free">${flat.free}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="s3d-card__buttons">
          <button class="s3d-card__link" type="button" data-id="${flat.id}" data-s3d-update="id" data-s3d-event="transition"><span>Детальніше</span>
            <div class="s3d-card__link-arrow">
              <svg width="67" height="18" viewBox="0 0 67 18" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.99382e-07 9L65 9.00001M65 9.00001L57.3333 17M65 9.00001L57.3333 1.00001" stroke="#CFBE97" stroke-width="2"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>`);
  }

  renderInfoFlat(flat) {
    this.infoBox.html(`<div class="s3d-card__top s3d-fon-monreal__top">
      <label class="s3d-card__add-favourites s3d-infoBox__add-favourites js-s3d-add__favourites" data-s3d-update="id" data-id="${flat.id}">
        <input type="checkbox" data-s3d-update="checked">
        <svg role="presentation">
          <use xlink:href="#icon-favourites"></use>
        </svg>
      </label>
      <div class="s3d-card__close" data-s3d-event="closed"></div>
      <div class="s3d-card__image">
      <img data-s3d-event="update" src="${flat['img_small']}" data-s3d-update="image" /></div>
      <div class="s3d-card__type" data-s3d-event="update" data-s3d-update="type"><span></span></div>
    </div>
    <div class="s3d-card__middle s3d-fon-monreal__middle"></div>
    <div class="s3d-card__bottom s3d-fon-monreal__bottom">
      <div class="s3d-card__table">
        <table class="s3d-card__table">
          <tbody>
            <tr class="s3d-card__row">
              <td class="s3d-card__name">№ квартиры</td>
              <td class="s3d-card__value" data-s3d-event="update" data-s3d-update="number">${flat.number}</td>
            </tr>
            <tr class="s3d-card__row">
              <td class="s3d-card__name">Этаж</td>
              <td class="s3d-card__value" data-s3d-event="update" data-s3d-update="floor">${flat.floor}</td>
            </tr>
            <tr class="s3d-card__row">
              <td class="s3d-card__name">Комнаты</td>
              <td class="s3d-card__value" data-s3d-event="update" data-s3d-update="rooms">${flat.rooms}</td>
            </tr>
            <tr class="s3d-card__row">
              <td class="s3d-card__name">Площадь м<sup>2</sup></td>
              <td class="s3d-card__value" data-s3d-event="update" data-s3d-update="area">${flat.area}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="s3d-card__buttons">
        <button class="s3d-card__link" type="button" data-id="${flat.id}" data-s3d-update="id" data-s3d-event="transition"><span>Детальніше</span>
          <div class="s3d-card__link-arrow">
            <svg width="67" height="18" viewBox="0 0 67 18" fill="none" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.99382e-07 9L65 9.00001M65 9.00001L57.3333 17M65 9.00001L57.3333 1.00001" stroke="#CFBE97" stroke-width="2"></path>
            </svg>
          </div>
        </button>
      </div>
    </div>`);
  }
}
export default InfoBox;
