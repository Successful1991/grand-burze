import $ from 'jquery';
import _ from 'lodash';
import SliderModel from './slider/sliderModel';
import SliderView from './slider/sliderView';
import SliderController from './slider/sliderController';
import Plannings from './plannings';
import FlatModel from './flat/flatModel';
import FlatController from './flat/flatController';
import FlatView from './flat/flatView';
import FloorModel from './floor/floorModel';
import FloorController from './floor/floorController';
import FloorView from './floor/floorView';

function fsmConfig() {
  return {
    flyby: {
      desktop: {
        filter: true,
        filterTransition: true,
        controller: {
          filter: true,
          title: true,
          phone: true,
          compass: true,
          tabs: true,
          helper: true,
          infoBox: true,
          favourite: true,
          infrastructure: true,
          back: false,
          choose: true,
        },
      },
      mobile: {
        filter: true,
        filterTransition: true,
        controller: {
          filter: true,
          title: true,
          phone: true,
          compass: true,
          tabs: true,
          helper: true,
          infoBox: true,
          favourite: true,
          infrastructure: true,
          back: false,
          choose: true,
        },
      },
    },
    plannings: {
      desktop: {
        filter: true,
        filterTransition: false,
        wrap: 'plannings',
        controller: {
          filter: false,
          title: false,
          phone: true,
          compass: false,
          tabs: true,
          helper: false,
          infoBox: false,
          favourite: true,
          infrastructure: false,
          back: true,
          choose: false,
        },
      },
      mobile: {
        filter: true,
        filterTransition: true,
        wrap: 'plannings',
        controller: {
          filter: true,
          title: false,
          phone: true,
          compass: false,
          tabs: true,
          helper: false,
          infoBox: false,
          favourite: true,
          infrastructure: false,
          back: true,
          choose: false,
        },
      },
    },
    floor: {
      desktop: {
        filter: false,
        wrap: 'floor',
        controller: {
          filter: false,
          title: false,
          phone: true,
          compass: false,
          tabs: true,
          helper: false,
          infoBox: false,
          favourite: false,
          infrastructure: false,
          back: true,
          choose: false,
        },
      },
      mobile: {
        filter: false,
        wrap: 'floor',
        controller: {
          filter: false,
          title: false,
          phone: true,
          compass: false,
          tabs: true,
          helper: false,
          infoBox: false,
          favourite: false,
          infrastructure: false,
          back: true,
          choose: false,
        },
      },
    },
    flat: {
      desktop: {
        filter: false,
        wrap: 'flat',
        controller: {
          filter: false,
          title: false,
          phone: true,
          compass: false,
          tabs: true,
          helper: false,
          infoBox: false,
          favourite: false,
          infrastructure: false,
          back: true,
          choose: false,
        },
      },
      mobile: {
        filter: false,
        wrap: 'flat',
        controller: {
          filter: false,
          title: false,
          phone: true,
          compass: false,
          tabs: true,
          helper: false,
          infoBox: false,
          favourite: false,
          infrastructure: false,
          back: true,
          choose: false,
        },
      },
    },
    favourites: {
      desktop: {
        filter: false,
        wrap: 'favourites',
        controller: {
          filter: false,
          title: false,
          phone: true,
          compass: false,
          tabs: true,
          helper: false,
          infoBox: false,
          favourite: false,
          infrastructure: false,
          back: true,
          choose: false,
        },
      },
      mobile: {
        filter: false,
        wrap: 'favourites',
        controller: {
          filter: false,
          title: false,
          phone: true,
          compass: false,
          tabs: true,
          helper: false,
          infoBox: false,
          favourite: false,
          infrastructure: false,
          back: true,
          choose: false,
        },
      },
    },
  };
}

function fsm() {
  return {
    firstLoad: true,
    state: '',
    settings: {},
    transitions: {
      flyby(config, i18n, change) {
        if (!this[config.id]) {
          this.preloader.show();
          config['typeCreateBlock'] = 'canvas';
          this.emit('createWrapper', config);
          config['wrapper'] = $(`.js-s3d__wrapper__${config.id}`);
          const courtyardModel = new SliderModel(config, i18n);
          const courtyardView = new SliderView(courtyardModel, {
            wrapper: config['wrapper'],
            wrapperEvent: '.js-s3d__svgWrap',
          });
          const complexController = new SliderController(courtyardModel, courtyardView);
          this[config.id] = courtyardModel;
          courtyardModel.init();
          if (_.has(this, 'helper')) {
            this.helper.init();
          }
        } else if (change) {
          this[config.id].toSlideNum(+config.flatId, config.settings.slides);
        } else {
          this.preloaderWithoutPercent.show();
          this.preloaderWithoutPercent.hide();
          this[config.id].showDifferentPointWithoutRotate(config.settings.slides, config.flatId);
        }

        this.changeViewBlock(config.id);
        this.compass(this[config.id].currentCompassDeg);
        this.iteratingConfig();
      },
      plannings(config, i18n) {
        if (!this.plannings) {
          this.preloaderWithoutPercent.show();
          this.plannings = new Plannings(config, i18n);
          this.plannings.init();
        } else {
          this.preloaderWithoutPercent.show();
          this.preloaderWithoutPercent.hide();
        }
        this.changeViewBlock(this.fsm.state);
        this.iteratingConfig();
      },
      flat(config, i18n) {
        if (!this.flat) {
          this.preloader.show();
          config['typeCreateBlock'] = 'div';
          const flatModel = new FlatModel(config, i18n);
          const flatView = new FlatView(flatModel, {}, i18n);
          const flatController = new FlatController(flatModel, flatView);
          this.flat = flatModel;
          flatModel.init(config);
        } else {
          this.preloaderWithoutPercent.show();
          this.preloaderWithoutPercent.hide();
        }

        this.changeViewBlock(this.fsm.state);
        this.compass(this.flat.currentCompassDeg);
        this.iteratingConfig();
        this.flat.update(config.flatId);
      },
      floor(config, i18n) {
        if (!this.floor) {
          this.preloaderWithoutPercent.show();
          config['typeCreateBlock'] = 'div';
          const floorModel = new FloorModel(config, i18n);
          const floorView = new FloorView(floorModel, {});
          const flatController = new FloorController(floorModel, floorView);
          this.floor = floorModel;
          floorModel.init(config);
        } else {
          this.preloaderWithoutPercent.show();
          this.preloaderWithoutPercent.hide();
          this.floor.update(config);
        }
        this.changeViewBlock(this.fsm.state);
        this.compass(this.floor.currentCompassDeg);
        this.iteratingConfig();
      },
      favourites() {
        if (this.fsm.firstLoad) {
          this.fsm.firstLoad = false;
        } else {
          this.preloaderWithoutPercent.show();
          // this.emit('animateChangeBlock');
        }
        // this.preloader.hide();
        // if (this.favourites.templateCard) {
        this.favourites.update();
        // this.favourites.updateFavouritesBlock();
        // }
        this.iteratingConfig();
        this.changeViewBlock(this.fsm.state);
        const statePreloader = this.preloader.checkState();

        if (statePreloader.showing) {
          this.preloader.hide();
          return;
        }
        this.preloaderWithoutPercent.hide();
      },
    },
    dispatch(settings, self, payload, i18n) {
      if (settings.type !== this.state || +settings.flyby !== this.settings.flyby || settings.side !== this.settings.side) {
        this.state = settings.type;
        this.settings = settings;
      }

      const action = this.transitions[this.state];
      if (!action) return;

      const config = { ...payload };

      config['settings'] = settings;
      config['type'] = this.state;

      action.call(self, config, i18n, settings.change);
    },
  };
}

export { fsm, fsmConfig };
