import { BehaviorSubject } from 'rxjs';
import $ from 'jquery';
import _ from 'lodash';
import { fsm, fsmConfig } from '../fsm';
import addAnimateBtnTabs from '../animation';
import {
  preloader, debounce, preloaderWithoutPercent,
} from '../general/General';
import asyncRequest from '../async/async';
import EventEmitter from '../eventEmitter/EventEmitter';
import History from '../history';
import { HelperGif as Helper } from '../helper';
import InfoBox from '../infoBox';
import FilterModel from '../filter/filterModel';
import FilterView from '../filter/filterView';
import FilterController from '../filter/filterController';
import FlatsList from '../flatsList';
import PopupChangeFlyby from '../popupChangeFlyby';
import FavouritesModel from '../favourites/favouritesModel';
import FavouritesController from '../favourites/favouritesController';
import FavouritesView from '../favourites/favouritesView';

class AppModel extends EventEmitter {
  constructor(data, i18n) {
    super();
    this.config = data;
    this.i18n = i18n;
    this.preloader = preloader();
    this.preloaderWithoutPercent = preloaderWithoutPercent();
    this.defaultFlybySettings = {};
    this.getFlat = this.getFlat.bind(this);
    this.setFlat = this.setFlat.bind(this);
    this.getFloor = this.getFloor.bind(this);
    this.setFloor = this.setFloor.bind(this);
    this.updateFsm = this.updateFsm.bind(this);
    this.checkNextFlyby = this.checkNextFlyby.bind(this);
    this.changePopupFlyby = this.changePopupFlyby.bind(this);

    this.browser = data.browser;
    this.typeSelectedFlyby$ = new BehaviorSubject('flat'); // flat, floor
    this.compass = this.compass.bind(this);
    this.updateCurrentFilterFlatsId = this.updateCurrentFilterFlatsId.bind(this);
    this.currentFilterFlatsId$ = new BehaviorSubject([]);
    this.hoverData$ = new BehaviorSubject({});
    this.flatList = {};
    this.floorList$ = new BehaviorSubject({});
    this.favouritesIds$ = new BehaviorSubject([]);
    this.fsmConfig = fsmConfig();
    this.fsm = fsm();

    // this.preloaderState = 'hide';
    // this.preloaderActive = 'curtain'; // curtain, withoutPercent, percent
  }

  set activeFlat(value) {
    this._activeFlat = _.toNumber(value);
  }

  get activeFlat() {
    return this._activeFlat;
  }

  convertType(value) {
    try {
      return (new Function(`return ${value} ;`))();
    } catch(e) {
      return value;
    }
  }

  selectSlideHandler(event) {
    const { type, flyby, side } = event.currentTarget.dataset;
    if (type && (type !== this.fsm.state || flyby !== this.fsm.settings.flyby || side !== this.fsm.settings.side)) {
      this.updateFsm({
        type, flyby, side, method: 'general',
      });
    }
  }

  getFlat(val) {
    return val ? this.flatList[val] : this.flatList;
  }

  setFlat(val) {
    this.flatList[val.id] = val;
    // this.subject.next(val);
  }

  getFloor(data) {
    const values = this.floorList$.value;
    const { floor, build } = data;

    if (floor && build) {
      return values.find(value => (value.floor === +floor && value.build === +build));
    }
    return values;
  }

  setFloor(val) {
    // this.floorList$[val.id] = val;
    this.floorList$.next({ ...this.floorList$.value, [val.id]: val });
  }

  init() {
    this.history = new History({ updateFsm: this.updateFsm });
    this.history.init();
    this.preloader.show();
    // this.preloader.turnOn();
    // this.preloaderWithoutPercent.show();
    let requestUrl = `${defaultStaticPath}templateFlats.json`;
    if (status === 'prod' || status === 'dev') {
      requestUrl = '/wp-admin/admin-ajax.php';
    }
    this.requestGetFlats(requestUrl, this.flatJsonIsLoaded.bind(this));

    this.infoBox = new InfoBox({
      activeFlat: this.activeFlat,
      updateFsm: this.updateFsm,
      getFlat: this.getFlat,
      getFloor: this.getFloor,
      hoverData$: this.hoverData$,
      typeSelectedFlyby$: this.typeSelectedFlyby$,
    });
    this.setDefaultConfigFlyby(this.config.flyby);
    this.helper = new Helper();
    // window.localStorage.removeItem('info')

    this.deb = debounce(this.resize.bind(this), 200);
  }

  setDefaultConfigFlyby(config) {
    const type = 'flyby';
    const flyby = Object.keys(config)[0];
    const side = Object.keys(config[flyby])[0];
    this.defaultFlybySettings = { type, flyby, side };
  }

  parseUrl() {
    const { searchParams } = new URL(decodeURIComponent(window.location));
    const parseSearchParam = Object.fromEntries(searchParams.entries());
    return parseSearchParam;
  }

  checkFirstLoadState() {
    $.ajax(`${defaultStaticPath}/structureFlats.json`).then(resp => {
      this.structureFlats = resp;
      const searchParams = this.parseUrl();
      this.updateFsm(searchParams);
    });
  }

  parseParam(params, key) {
    return _.has(params, key) ? { [key]: JSON.parse(params[key]) } : {};
  }

  getParamDefault(searchParams) {
    return this.defaultFlybySettings;
    // return this.getParamFlyby(searchParams, flat);
  }

  getParamFlyby(searchParams) {
    const conf = {
      ...this.parseParam(searchParams, 'favourites'),
      type: searchParams.type || this.defaultFlybySettings.type,
      flyby: +searchParams.flyby || this.defaultFlybySettings.flyby,
      side: searchParams.side || this.defaultFlybySettings.side,
      // change: false,
    };

    const updated = this.checkNextFlyby(conf, searchParams.id);
    const id = searchParams.id || {};
    return { ...conf, ...updated, id };
  }

  getParamFloor(searchParams) {
    const config = this.floorList$.value;
    const build = this.convertType(searchParams.build) || config[0].build;
    const floor = this.convertType(searchParams.floor) || config[0].floor;

    return {
      ...this.parseParam(searchParams, 'favourites'),
      type: 'floor',
      build,
      floor,
    };
  }

  getParamFlat(searchParams) {
    if (!searchParams.id) {
      return this.getParamDefault(searchParams);
    }
    return {
      ...this.parseParam(searchParams, 'favourites'),
      type: 'flat',
      id: searchParams.id,
    };
  }

  getParamFavourites(searchParams) {
    return {
      ...this.parseParam(searchParams, 'favourites'),
      type: 'favourites',
    };
  }

  getParamPlannings(searchParams) {
    return {
      ...this.parseParam(searchParams, 'favourites'),
      type: 'plannings',
    };
    // return searchParams;
  }

  getParams(searchParams) {
    switch (searchParams['type']) {
        case 'flyby':
          return this.getParamFlyby(searchParams);
        case 'plannings':
          return this.getParamPlannings(searchParams);
        case 'floor':
          return this.getParamFloor(searchParams);
        case 'flat':
          return this.getParamFlat(searchParams);
        case 'favourites':
          return this.getParamFavourites(searchParams);
        default:
          return this.getParamDefault(searchParams);
    }
  }

  checkFlatInSVG(id) { // получает id квартиры, отдает объект с ключами где есть квартиры
    const flyby = this.structureFlats;
    const result = {};
    for (const num in flyby) {
      for (const side in flyby[num]) {
        const type = flyby[num][side];
        for (const slide in type) {
          const hasId = type[slide].includes(+id);
          if (hasId && !_.has(result, [num])) {
            result[num] = {};
          }
          if (hasId && !_.has(result, [side])) {
            result[num][side] = [];
          }
          if (hasId) {
            result[num][side].push(+slide);
          }
        }
      }
    }
    return result;
  }

  prepareFlats(flats) {
    // filter only flats  id = 1
    const currentFilterFlatsId = flats.reduce((previous, current) => {
      // if (current['type_object'] === '1') {
      const flat = _.transform(current, (acc, value, key) => {
        const newValue = _.toNumber(value);
        const params = acc;
        if (!_.isNaN(newValue)) {
          params[key] = newValue;
        } else {
          params[key] = value;
        }
        return params;
      });
      flat['favourite'] = false;
      const key = flat.id;
      return { ...previous, [key]: flat };
    }, {});
    return currentFilterFlatsId;
  }

  flatJsonIsLoaded(data) {
    this.flatList = this.prepareFlats(data);
    this.floorList$.next(this.createFloorsData(data));

    const currentFilterFlatsId = Object.keys(this.flatList);
    this.currentFilterFlatsId$.next(currentFilterFlatsId);

    const generalConfig = {
      getFlat: this.getFlat,
      setFlat: this.setFlat,
      updateFsm: this.updateFsm,
      fsm: this.fsm,
      typeSelectedFlyby$: this.typeSelectedFlyby$,
      currentFilterFlatsId$: this.currentFilterFlatsId$,
      updateCurrentFilterFlatsId: this.updateCurrentFilterFlatsId,
      activeFlat: this.activeFlat,
      favouritesIds$: this.favouritesIds$,
    };
    const filterModel = new FilterModel({ flats: this.getFlat(), updateCurrentFilterFlatsId: this.updateCurrentFilterFlatsId }, this.i18n);
    const filterView = new FilterView(filterModel, {});
    const filterController = new FilterController(filterModel, filterView);
    filterModel.init();

    const listFlat = new FlatsList(this);

    this.popupChangeFlyby = new PopupChangeFlyby(this, this.i18n);

    const fvModel = new FavouritesModel(generalConfig, this.i18n);
    const fvView = new FavouritesView(fvModel, {}, this.i18n);
    const fvController = new FavouritesController(fvModel, fvView);
    fvModel.init();
    this.checkFirstLoadState();

    addAnimateBtnTabs('[data-choose-type]', '.js-s3d__choose--flat--button-svg');
    // this.createStructureSvg();
  }

  // createSvgStructureFlats
  createStructureSvg() {
    const flyby = {}
    const conf = this.config.flyby
    for (const num in conf) {
      flyby[num] = {}
      for (const side in conf[num]) {
        const type = conf[num][side]
        flyby[num][side] = {}
        type.controlPoint.forEach(slide => {
          flyby[num][side][slide] = []
          $.ajax(`/wp-content/themes/${nameProject}/assets/s3d/images/svg/${this.typeSelectedFlyby$.value}/flyby/${num}/${side}/${slide}.svg`).then(responsive => {
            const list = [...responsive.querySelectorAll('polygon')];
            flyby[num][side][slide] = list.map(el => +el.dataset.id);
          });
        });
      }
    }
    setTimeout(() => {
      console.log(JSON.stringify(flyby));
    }, 10000);
  }

  changePopupFlyby(config, id) {
    this.popupChangeFlyby.updateContent(id);
    this.popupChangeFlyby.openPopup(config);
  }

  compass(deg) {
    this.emit('updateCompassRotate', deg);
  }

  updateHistory(name) {
    if (this['history'] && this['history'].update) {
      this.history.update(name);
      return true;
    }
    return false;
  }

  changeViewBlock(name, delay = 400) {
    const self = this;
    setTimeout(() => {
      self.emit('changeBlockActive', name);
    }, delay);
  }

  requestGetFlats(url, myCallback) {
    let method = 'POST';
    if (status === 'prod' || status === 'dev') {
      method = 'POST';
    } else {
      method = 'GET';
    }
    asyncRequest({
      url,
      data: {
        method,
        data: 'action=getFlats',
      },
      callbacks: myCallback,
      errors: error => {
        console.log('error', error);
      },
    });
  }

  createFloorsData(flats) {
    const data = flats.reduce((acc, flat) => {
      const isIndexFloor = _.findIndex(acc, cur => (+cur.floor === +flat.floor
        && +cur.build === +flat.build
        && +cur.sec === +flat.sec));

      if (isIndexFloor >= 0) {
        const { free } = acc[isIndexFloor];
        const currentFloor = _.cloneDeep(acc[isIndexFloor]);
        currentFloor.count += 1;
        currentFloor.free = (flat.sale === '1' ? free + 1 : free);
        acc[isIndexFloor] = currentFloor;
        return acc;
      }

      return [
        ...acc,
        {
          floor: +flat.floor,
          build: +flat.build,
          sec: +flat.sec,
          count: 1,
          free: +(flat.sale === '1'),
        },
      ];
    }, []);
    return data;
  }

  updateCurrentFilterFlatsId(value) {
    this.currentFilterFlatsId$.next(value);
  }

  changeChooseActive(type) {
    this.typeSelectedFlyby$.next(type);
  }

  // updateFavourites() {
  //   this.favourites.updateFavourites();
  // }

  updateFsm(data) {
    const settings = this.getParams(data);
    const {
      type,
      flyby,
      side,
    } = settings;
    const config = _.has(this.config, [type, flyby, side]) ? this.config[type][flyby][side] : this.config[type];

    if (settings.id) {
      this.activeFlat = +settings.id;
      config.flatId = +settings.id;
    }

    // prepare settings params before use
    this.updateHistory(settings);

    config.type = data.type;
    config.activeFlat = this.activeFlat;
    config.hoverData$ = this.hoverData$;
    config.compass = this.compass;
    config.updateFsm = this.updateFsm;
    config.getFlat = this.getFlat;
    config.setFlat = this.setFlat;
    config.currentFilterFlatsId$ = this.currentFilterFlatsId$;
    config.updateCurrentFilterFlatsId = this.updateCurrentFilterFlatsId;
    config.infoBox = this.infoBox;
    config.typeSelectedFlyby$ = this.typeSelectedFlyby$;
    config.floorList$ = this.floorList$;
    config.browser = this.browser;
    config.favouritesIds$ = this.favouritesIds$;

    this.fsm.dispatch(settings, this, config, this.i18n);
  }

  iteratingConfig(delay = 400) {
    const width = document.documentElement.offsetWidth;
    const typeDevice = width > 992 ? 'desktop' : 'mobile';
    const state = this.fsmConfig[this.fsm.state][typeDevice];

    setTimeout(() => {
      for (const key in state) {
        if (state[key] instanceof Object && !(state[key] instanceof Function)) {
          for (const i in state[key]) {
            switch (i) {
                // не проверяет ключ вызывает функцию передает boolean
                case state[key][i] !== 'boolean':
                  break;
                case 'filter':
                  this.controllerFilterShow(state[key][i]);
                  break;
                case 'title':
                  this.controllerTitleShow(state[key][i]);
                  break;
                case 'phone':
                  this.controllerPhoneShow(state[key][i]);
                  break;
                case 'compass':
                  this.controllerCompassShow(state[key][i]);
                  break;
                case 'tabs':
                  this.controllerTabsShow(state[key][i]);
                  break;
                case 'helper':
                  this.controllerHelperShow(state[key][i]);
                  break;
                case 'infoBox':
                  this.controllerInfoBoxShow(state[key][i]);
                  break;
                case 'infrastructure':
                  this.controllerInfraShow(state[key][i]);
                  break;
                case 'favourite':
                  this.controllerFavouriteShow(state[key][i]);
                  break;
                case 'back':
                  this.controllerBackShow(state[key][i]);
                  break;
                case 'choose':
                  this.controllerChooseShow(state[key][i]);
                  break;
                default:
                  break;
            }
          }
        } else {
          switch (key) {
              // не проверяет ключ вызывает функцию передает boolean
              case state[key] !== 'boolean':
                break;
              case 'filter':
                this.filterShow(state[key]);
                break;
              case 'filterTransition':
                this.filterTransition(state[key]);
                break;
              default:
                break;
          }
        }
      }
    }, delay);
  }

  filterShow(flag) {
    this.emit('changeClass', { target: '.js-s3d-filter', flag, changeClass: 's3d-show' });
  }

  filterTransition(flag) {
    this.emit('changeClass', { target: '.js-s3d-filter', flag, changeClass: 'active-filter' });
  }

  controllerFilterShow(flag) {
    this.emit('changeClass', { target: '.js-s3d-ctr__filter', flag, changeClass: 's3d-show' });
  }

  controllerCompassShow(flag) {
    this.emit('changeClass', { target: '.js-s3d-ctr__compass', flag, changeClass: 's3d-show' });
  }

  controllerInfraShow(flag) {
    this.emit('changeClass', { target: '.js-s3d-ctr__infra', flag, changeClass: 's3d-show' });
  }

  controllerHelperShow(flag) {
    this.emit('changeClass', { target: '.js-s3d-ctr__helper', flag, changeClass: 's3d-show' });
  }

  controllerTitleShow(flag) {
    this.emit('changeClass', { target: '.js-s3d-ctr__title', flag, changeClass: 's3d-show' });
  }

  controllerPhoneShow(flag) {
    this.emit('changeClass', { target: '.js-s3d-ctr__call', flag, changeClass: 's3d-show' });
  }

  controllerFavouriteShow(flag) {
    this.emit('changeClass', { target: '.s3d-ctr__favourites', flag, changeClass: 's3d-show' });
  }

  controllerTabsShow(flag) {
    this.emit('changeClass', { target: '.js-s3d-ctr__elem', flag, changeClass: 's3d-show' });
  }

  controllerInfoBoxShow(flag) {
    this.emit('changeClass', { target: '.js-s3d-infoBox', flag, changeClass: 's3d-show' });
  }

  controllerBackShow(flag) {
    this.emit('changeClass', { target: '.js-s3d-ctr__return', flag, changeClass: 's3d-show' });
  }

  controllerChooseShow(flag) {
    this.emit('changeClass', { target: '.js-s3d__choose--flat', flag, changeClass: 's3d-show' });
  }

  resize() {
    this.iteratingConfig();
  }

  checkNextFlyby(data, id) {
    if (_.isUndefined(id)) {
      return {};
    }

    const includes = this.checkFlatInSVG(id);
    // const setting = this.fsm.settings;
    // debugger;
    if (_.size(includes) === 0) {
      return {};
    }
    if (_.has(includes, [data.flyby, data.side])) {
      return {
        type: 'flyby',
        flyby: data.flyby,
        side: data.side,
        slides: includes[data.flyby][data.side],
        change: false,
      };
    }
    // if (_.has(includes, [setting.flyby, setting.side])) {
    //   return {
    //     type: 'flyby',
    //     flyby: setting.flyby,
    //     side: setting.side,
    //     slide: includes[setting.flyby][setting.side],
    //     change: false,
    //   };
    // }

    const key1 = Object.keys(includes);
    const key2 = Object.keys(includes[key1[0]]);
    const slides = includes[key1[0]][key2[0]];
    // let change = false;
    // if (setting.type !== 'flyby' || setting.flyby !== key1 || setting.side !== key2) {
    //   change = true;
    // }

    return {
      type: 'flyby',
      flyby: key1[0],
      side: key2[0],
      slides,
      change: true,
    };
  }
}

export default AppModel;
