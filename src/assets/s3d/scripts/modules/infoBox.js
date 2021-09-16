import $ from 'jquery';
import placeElemInWrapperNearMouse from './placeElemInWrapperNearMouse';

class InfoBox {
  constructor(data) {
    this.infoBox = '';
    this.hoverData$ = data.hoverData$;
    this.selectData = data.selectData;
    this.updateFsm = data.updateFsm;
    this.getFlat = data.getFlat;
    this.getFloor = data.getFloor;
    this.state = {
      type: data.typeSelectedFlyby$.value,
    };
    this.stateUI = {
      status: 'static',
    };
    this.stateConfig = ['static', 'hover', 'active'];
    this.isInfoBoxMoving = true; // translate or static position

    this.changeState = this.changeState.bind(this);
    this.disable = this.disable.bind(this);
    this.init();
  }

  init() {
    this.createInfo();
    this.infoBox.on('click', '[data-s3d-event=closed]', () => {
      this.updateState('static');
      this.removeSvgFlatActive();
    });

    if (this.isInfoBoxMoving) {
      this.infoBox.addClass('s3d-infoBox__moving');
    }
  }

  removeSvgFlatActive() {
    $('.js-s3d__svgWrap .active-flat').removeClass('active-flat');
  }

  // updateState use only from this class. change state without check exceptions
  updateState(state, flat) {
    if (this.stateConfig.includes(state)) {
      this.stateUI.status = state;
    }
    this.dispatch(flat);
  }

  changeState(value, data = null) {
    const prevState = this.stateUI.status;
    const nextState = value;
    if (prevState === 'active') return;
    let flat = null;
    if (data) {
      this.state.type = data.type;
      switch (data.type) {
      // switch (this.typeSelectedFlyby$.value) {
          case 'flat':
            flat = this.getFlat(+data.id);
            break;
          case 'floor':
            flat = this.getFloor(data);
            break;
          default:
            flat = data;
            break;
      }
    }

    if (!flat) {
      this.updateState('static', null);
      return;
    }

    if (_.isEqual(data, this.hoverData$.value)) return;
    if (value === 'hover' && value === this.stateUI.status) {
      this.hoverData$.next(data);
      this.updateInfo(flat);
      return;
    }
    this.updateState(value, flat);
  }

  dispatch(flat) {
    switch (this.stateUI.status) {
        case 'static':
          this.hoverData$.next({});
          this.infoBox.removeClass('s3d-infoBox-hover');
          break;
        case 'hover':
          this.hoverData$.next(+flat);
          this.infoBox.addClass('s3d-infoBox-hover');
          this.updateInfo(flat);
          break;
        case 'active':
          this.hoverData$.next(flat);
          this.infoBox.removeClass('s3d-infoBox-hover');
          this.infoBox.find('[data-s3d-update=id]').data('id', flat.id);
          this.updateInfo(flat);
          break;
        default:
          this.hoverData$.next({});
          this.infoBox.removeClass('s3d-infoBox-hover');
          break;
    }
  }

  update(flat, state) {
    // this.updateInfo(flat);
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
    this.infoBox = $('[data-s3d-type="infoBox"]');
  }

  updatePosition(e) {
    if (!this.isInfoBoxMoving) {
      return;
    }
    // передвигаем блок за мышкой
    const { x, y } = placeElemInWrapperNearMouse(this.infoBox, $(window), e, 30);
    this.infoBox.css({
      top: y,
      left: x,
    });
  }

  updateInfo(flat) {
    if (_.isUndefined(flat)) {
      return;
    }

    switch (this.state.type) {
        case 'floor':
          this.renderInfoFloor(flat);
          break;
        case 'flat':
          this.renderInfoFlat(flat);
          break;
        case 'section':
          this.renderInfoHouse(flat);
          break;
        case 'flyby':
          this.renderInfoHouse(flat);
          break;
        default:
          throw new Error('Unknown type polygon');
    }
  }

  renderInfoFloor(flat) {
    this.infoBox.html(`
                <div class="s3d-infoBox__title">
          <span data-s3d-event="update" data-s3d-update="floor">12</span>
          поверх
        </div>
        <table class="s3d-infoBox__table">
          <tbody>
            <tr class="s3d-infoBox__row">
              <td class="s3d-infoBox__name">Квартир:</td>
              <td class="s3d-infoBox__value" data-s3d-event="update" data-s3d-update="rooms">${flat.count}</td>
            </tr>
            <tr class="s3d-infoBox__row">
              <td class="s3d-infoBox__name">Вільних:</td>
              <td class="s3d-infoBox__value" data-s3d-event="update" data-s3d-update="free">${flat.free}</td>
            </tr>
          </tbody>
        </table>
       `);
  }

  renderInfoFlat(flat) {
    this.infoBox.html(`
        <div class="s3d-infoBox__title">
          <span data-s3d-event="update" data-s3d-update="rooms">3</span>
          кімнатна
        </div>
        <table class="s3d-infoBox__table">
          <tbody>
            <tr class="s3d-infoBox__row">
              <td class="s3d-infoBox__name">№ квартиры</td>
              <td class="s3d-infoBox__value" data-s3d-event="update" data-s3d-update="number">${flat.number}</td>
            </tr>
            <tr class="s3d-infoBox__row">
              <td class="s3d-infoBox__name">Этаж</td>
              <td class="s3d-infoBox__value" data-s3d-event="update" data-s3d-update="floor">${flat.floor}</td>
            </tr>
            <tr class="s3d-infoBox__row">
              <td class="s3d-infoBox__name">Площадь м<sup>2</sup></td>
              <td class="s3d-infoBox__value" data-s3d-event="update" data-s3d-update="area">${flat.area}</td>
            </tr>
          </tbody>
        </table>
    `);
  }

  renderInfoHouse(flat) {
    this.infoBox.html(`
    <div class="s3d-card__bottom" >
      house number: ${flat.house}
    </div>`);
  }
}
export default InfoBox;
