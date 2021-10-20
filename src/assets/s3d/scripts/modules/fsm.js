import $ from 'jquery';
import {
  has,
} from 'lodash';
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
        isFilterShow: true,
        isFilterTransition: true,
        controllerFilter: true,
        controllerTitle: true,
        controllerPhone: true,
        controllerCompass: true,
        controllerTabs: true,
        controllerHelper: true,
        controllerInfoBox: true,
        controllerFavourite: true,
        controllerInfrastructure: true,
        controllerBack: false,
        controllerChoose: true,
      },
      mobile: {
        isFilterShow: true,
        isFilterTransition: true,
        controllerFilter: true,
        controllerTitle: true,
        controllerPhone: true,
        controllerCompass: true,
        controllerTabs: true,
        controllerHelper: true,
        controllerInfoBox: true,
        controllerFavourite: true,
        controllerInfrastructure: true,
        controllerBack: false,
        controllerChoose: true,
      },
    },
    plannings: {
      desktop: {
        wrap: 'plannings',
        isFilterShow: true,
        isFilterTransition: false,
        controllerFilter: false,
        controllerTitle: false,
        controllerPhone: true,
        controllerCompass: false,
        controllerTabs: true,
        controllerHelper: false,
        controllerInfoBox: false,
        controllerFavourite: true,
        controllerInfrastructure: false,
        controllerBack: true,
        controllerChoose: false,
      },
      mobile: {
        wrap: 'plannings',
        isFilterShow: true,
        isFilterTransition: true,
        controllerFilter: true,
        controllerTitle: false,
        controllerPhone: true,
        controllerCompass: false,
        controllerTabs: true,
        controllerHelper: false,
        controllerInfoBox: false,
        controllerFavourite: true,
        controllerInfrastructure: false,
        controllerBack: true,
        controllerChoose: false,
      },
    },
    floor: {
      desktop: {
        wrap: 'floor',
        isFilterShow: false,
        controllerFilter: false,
        controllerTitle: false,
        controllerPhone: true,
        controllerCompass: false,
        controllerTabs: true,
        controllerHelper: false,
        controllerInfoBox: false,
        controllerFavourite: false,
        controllerInfrastructure: false,
        controllerBack: true,
        controllerChoose: false,
      },
      mobile: {
        wrap: 'floor',
        isFilterShow: false,
        controllerFilter: false,
        controllerTitle: false,
        controllerPhone: true,
        controllerCompass: false,
        controllerTabs: true,
        controllerHelper: false,
        controllerInfoBox: false,
        controllerFavourite: false,
        controllerInfrastructure: false,
        controllerBack: true,
        controllerChoose: false,
      },
    },
    flat: {
      desktop: {
        wrap: 'flat',
        isFilterShow: false,
        controllerFilter: false,
        controllerTitle: false,
        controllerPhone: true,
        controllerCompass: false,
        controllerTabs: true,
        controllerHelper: false,
        controllerInfoBox: false,
        controllerFavourite: false,
        controllerInfrastructure: false,
        controllerBack: true,
        controllerChoose: false,
      },
      mobile: {
        wrap: 'flat',
        isFilterShow: false,
        controllerFilter: false,
        controllerTitle: false,
        controllerPhone: true,
        controllerCompass: false,
        controllerTabs: true,
        controllerHelper: false,
        controllerInfoBox: false,
        controllerFavourite: false,
        controllerInfrastructure: false,
        controllerBack: true,
        controllerChoose: false,
      },
    },
    favourites: {
      desktop: {
        wrap: 'favourites',
        isFilterShow: false,
        controllerFilter: false,
        controllerTitle: false,
        controllerPhone: true,
        controllerCompass: false,
        controllerTabs: true,
        controllerHelper: false,
        controllerInfoBox: false,
        controllerFavourite: false,
        controllerInfrastructure: false,
        controllerBack: true,
        controllerChoose: false,
      },
      mobile: {
        wrap: 'favourites',
        isFilterShow: false,
        controllerFilter: false,
        controllerTitle: false,
        controllerPhone: true,
        controllerCompass: false,
        controllerTabs: true,
        controllerHelper: false,
        controllerInfoBox: false,
        controllerFavourite: false,
        controllerInfrastructure: false,
        controllerBack: true,
        controllerChoose: false,
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
          if (has(this, 'helper')) {
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
          this.floor.update();
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
        }
        this.favourites.update();
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
