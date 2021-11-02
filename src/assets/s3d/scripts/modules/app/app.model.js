import { BehaviorSubject } from 'rxjs';
import $ from 'jquery';
import {
  transform,
  isNaN,
  has,
  cloneDeep,
  size,
} from 'lodash';
import { fsm, fsmConfig } from '../fsm';
import addAnimateBtnTabs from '../animation';
import {
  preloader, debounce, preloaderWithoutPercent,
} from '../general/General';
import asyncRequest from '../async/async';
import EventEmitter from '../eventEmitter/EventEmitter';
import History from '../history';
import Helper from '../helper';
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
    this.preloader = preloader;
    this.preloaderWithoutPercent = preloaderWithoutPercent();
    this.defaultFlybySettings = {};
    this.getFlat = this.getFlat.bind(this);
    this.getFloor = this.getFloor.bind(this);
    // this.setFloor = this.setFloor.bind(this);
    this.updateFsm = this.updateFsm.bind(this);
    this.checkNextFlyby = this.checkNextFlyby.bind(this);
    this.changePopupFlyby = this.changePopupFlyby.bind(this);

    this.browser = data.browser;
    this.typeSelectedFlyby$ = new BehaviorSubject('flat'); // flat, floor
    this.compass = this.compass.bind(this);
    // this.updateCurrentFilterFlatsId = this.updateCurrentFilterFlatsId.bind(this);
    this.currentFilteredFlatIds$ = new BehaviorSubject([]);
    this.currentFilteredFloorsData$ = new BehaviorSubject([]);
    this.hoverData$ = new BehaviorSubject({});
    this.flatList = {};
    this.floorList$ = new BehaviorSubject({});
    this.favouritesIds$ = new BehaviorSubject([]);
    this.fsmConfig = fsmConfig();
    this.fsm = fsm();
  }

  // todo replace get/set normal

  set activeFlat(value) {
    this._activeFlat = window.parseInt(value);
  }

  get activeFlat() {
    return this._activeFlat;
  }

  // todo mb remove it function
  convertType(value) {
    try {
      return (new Function(`return ${value} ;`))();
    } catch(e) {
      return value;
    }
  }

  selectSlideHandler(event) {
    const {
      type,
      flyby,
      side,
      id,
    } = event.currentTarget.dataset;
    if (type && (type !== this.fsm.state || flyby !== this.fsm.settings.flyby || side !== this.fsm.settings.side)) {
      this.updateFsm({
        type, flyby, side, id,
      });
    }
  }

  getFlat(val) {
    return val ? this.flatList[val] : this.flatList;
  }

  getFloor(data) {
    const values = this.floorList$.value;
    const { floor, build } = data;

    if (floor && build) {
      return values.find(value => (value.floor === +floor && value.build === +build));
    }
    return values;
  }

  // setFloor(val) {
  //   this.floorList$.next({ ...this.floorList$.value, [val.id]: val });
  // }

  async init() {
    try {
      this.history = new History({ updateFsm: this.updateFsm });
      this.preloader.show();
      let requestUrl = `${defaultStaticPath}/grand-burge-flats.json`;
      // let requestUrl = `${defaultStaticPath}/templateFlats.json`;
      if (status === 'prod' || status === 'dev') {
        requestUrl = '/wp-admin/admin-ajax.php';
      }

      this.infoBox = new InfoBox({
        activeFlat: this.activeFlat,
        updateFsm: this.updateFsm,
        getFlat: this.getFlat,
        getFloor: this.getFloor,
        hoverData$: this.hoverData$,
        typeSelectedFlyby$: this.typeSelectedFlyby$,
        i18n: this.i18n,
      });

      const flats = await this.requestGetFlats(requestUrl);
      this.setDefaultConfigFlyby(this.config);
      this.helper = new Helper(this.i18n);
      await this.flatJsonIsLoaded(flats.data);
    } catch (e) {
      console.log(e);
    }
    // window.localStorage.removeItem('info')

    // window.onbeforeunload = event => {
    //   this.updateHistory(this.fsm.settings);
    //   return false;
    // };
  }

  setDefaultConfigFlyby(config) {
    if (config['genplan']) {
      this.defaultFlybySettings = this.getParamGenplan();
    } else {
      const configFlyby = config.flyby;
      const type = 'flyby';
      const flyby = Object.keys(configFlyby)[0];
      const side = Object.keys(configFlyby[flyby])[0];
      this.defaultFlybySettings = { type, flyby, side };
    }
  }

  parseUrl() {
    const { searchParams } = new URL(decodeURIComponent(window.location));
    const parseSearchParam = Object.fromEntries(searchParams.entries());
    return parseSearchParam;
  }


  getStructureFlats() {
    return asyncRequest({
      url: `${defaultStaticPath}/structureFlats.json`,
    });
  }

  parseParam(params, key) {
    return has(params, key) ? { [key]: JSON.parse(params[key]) } : {};
  }

  getParamDefault() {
    return this.defaultFlybySettings;
  }

  getParamFlyby(searchParams) {
    const conf = {
      ...this.parseParam(searchParams, 'favourites'),
      type: searchParams.type ?? 'flyby',
      flyby: searchParams.flyby ?? '1',
      side: searchParams.side ?? 'outside',
    };
    const updated = this.checkNextFlyby(conf, searchParams.id);
    const flatId = searchParams.id;
    const id = (flatId && this.getFlat(flatId)) ? { id: searchParams.id } : {};
    return { ...conf, ...updated, ...id };
  }

  getParamGenplan() {
    return { type: 'genplan' };
  }

  getParamFloor(searchParams) {
    const config = this.floorList$.value;
    const build = this.convertType(searchParams.build) || config[0].build;
    const floor = this.convertType(searchParams.floor) || config[0].floor;
    const section = this.convertType(searchParams.section) || config[0].section;

    return {
      ...this.parseParam(searchParams, 'favourites'),
      type: 'floor',
      build,
      floor,
      section,
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
    const config = {
      genplan: 'getParamGenplan',
      flyby: 'getParamFlyby',
      plannings: 'getParamPlannings',
      floor: 'getParamFloor',
      flat: 'getParamFlat',
      favourites: 'getParamFavourites',
    };
    const getParam = config[searchParams['type']] ?? 'getParamDefault';
    return this[getParam](searchParams);
  }

  checkFlatInSVG(flyby, id) { // получает id квартиры, отдает объект с ключами где есть квартиры
    const result = {};
    for (const num in flyby) {
      for (const side in flyby[num]) {
        const type = flyby[num][side];
        for (const slide in type) {
          for (const list in type[slide]) {
            const hasId = type[slide][list].includes(+id);
            if (hasId && !has(result, [num])) {
              result[num] = {};
            }
            if (hasId && !has(result, [num, side])) {
              result[num][side] = [];
            }
            if (hasId) {
              result[num][side].push(+slide);
            }
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
      const flat = transform(current, (acc, value, key) => {
        const newValue = window.parseInt(value);
        const params = acc;
        if (!isNaN(newValue) && key !== 'sorts') {
          params[key] = newValue;
        } else {
          params[key] = value;
        }
        return params;
      });
      // flat['favourite'] = false;
      const key = flat.id;
      return { ...previous, [key]: flat };
    }, {});
    return currentFilterFlatsId;
  }

  async flatJsonIsLoaded(data) {
    this.flatList = this.prepareFlats(data);
    this.floorList$.next(this.createFloorsData(data));
    const currentFilterFlatsId = Object.keys(this.flatList);
    this.currentFilteredFlatIds$.next(currentFilterFlatsId);

    const generalConfig = {
      getFlat: this.getFlat,
      updateFsm: this.updateFsm,
      fsm: this.fsm,
      typeSelectedFlyby$: this.typeSelectedFlyby$,
      currentFilteredFlatIds$: this.currentFilteredFlatIds$,
      currentFilteredFloorsData$: this.currentFilteredFloorsData$,
      activeFlat: this.activeFlat,
      favouritesIds$: this.favouritesIds$,
      history: this.history,
    };
    const filterModel = new FilterModel({
      flats: this.getFlat(),
      currentFilteredFlatIds$: this.currentFilteredFlatIds$,
      currentFilteredFloorsData$: this.currentFilteredFloorsData$,
      typeSelectedFlyby$: this.typeSelectedFlyby$,
    }, this.i18n);
    const filterView = new FilterView(filterModel, {});
    const filterController = new FilterController(filterModel, filterView);
    this.filter = filterModel;
    filterModel.init();

    const listFlat = new FlatsList(this, this.filter);

    this.popupChangeFlyby = new PopupChangeFlyby(this, this.i18n);

    const fvModel = new FavouritesModel(generalConfig, this.i18n);
    const fvView = new FavouritesView(fvModel, {}, this.i18n);
    const fvController = new FavouritesController(fvModel, fvView);
    this.favourites = fvModel;
    this.favourites.init();

    // const structure = this.checkFirstLoadState();

    const structure = await this.getStructureFlats();
    this.structureFlats = structure.data;

    const searchParams = this.parseUrl();
    this.updateFsm(searchParams);

    addAnimateBtnTabs('[data-choose-type]', '.js-s3d__choose--flat--button-svg');
    // this.createStructureSvg();
  }

  // createSvgStructureFlats
  createStructureSvg() {
    const types = ['floor', 'flat'];
    const flyby = {}
    const conf = this.config.flyby
    for (const num in conf) {
      flyby[num] = {}
      for (const side in conf[num]) {
        const type = conf[num][side]
        flyby[num][side] = {}
        type.controlPoint.forEach(slide => {
          flyby[num][side][slide] = {};
          types.forEach(typeSvg => {
            flyby[num][side][slide][typeSvg] = []
            $.ajax(`/wp-content/themes/${nameProject}/assets/s3d/images/svg/${typeSvg}/flyby/${num}/${side}/${slide}.svg`).then(responsive => {
              const list = [...responsive.querySelectorAll('polygon')];
              const ids = list.map(el => +el.dataset.id).filter(el => el);
              flyby[num][side][slide][typeSvg] = ids;
            });
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

  requestGetFlats(url) {
    const method = (status === 'prod' || status === 'dev') ? 'post' : 'get';
    return asyncRequest({
      url,
      method,
      data: { action: 'getFlats' },
    });
  }

  createFloorsData(flats) {
    const data = flats.reduce((acc, flat) => {
      const isIndexFloor = acc.findIndex(cur => (+cur.floor === +flat.floor
        && +cur.build === +flat.build
        && +cur.section === +flat.section));

      if (isIndexFloor >= 0) {
        const { free } = acc[isIndexFloor];
        const currentFloor = cloneDeep(acc[isIndexFloor]);
        currentFloor.count += 1;
        currentFloor.free = (flat.sale === '1' ? free + 1 : free);
        currentFloor.flatsIds.push(+flat.id);
        acc[isIndexFloor] = currentFloor;
        return acc;
      }

      return [
        ...acc,
        {
          floor: +flat.floor,
          build: +flat.build,
          section: +flat.section,
          count: 1,
          flatsIds: [+flat.id],
          free: +(flat.sale === '1'),
        },
      ];
    }, []);
    return data;
  }

  // updateCurrentFilterFlatsId(value) {
  //   this.currentFilteredFlatIds$.next(value);
  // }

  changeChooseActive(type) {
    this.typeSelectedFlyby$.next(type);
  }

  updateFsm(data, updateHistory = true) {
    const settings = this.getParams(data);
    const {
      type,
      flyby,
      side,
      id,
    } = settings;
    const config = has(this.config, [type, flyby, side]) ? this.config[type][flyby][side] : this.config[type];
    if (type === this.fsm.state && this.fsm.state !== 'flyby') return;
    if (id) {
      this.activeFlat = +id;
      config.flatId = +id;
    }

    // prepare settings params before use
    if (updateHistory) {
      this.updateHistory(settings);
    }

    config.type = data.type;
    config.activeFlat = this.activeFlat;
    config.hoverData$ = this.hoverData$;
    config.compass = this.compass; // ?
    config.updateFsm = this.updateFsm;
    config.history = this.history;
    config.getFlat = this.getFlat;
    config.typeSelectedFlyby$ = this.typeSelectedFlyby$;
    config.currentFilteredFlatIds$ = this.currentFilteredFlatIds$;
    config.currentFilteredFloorsData$ = this.currentFilteredFloorsData$;
    config.infoBox = this.infoBox;
    config.floorList$ = this.floorList$;
    config.browser = this.browser;
    config.favouritesIds$ = this.favouritesIds$;

    this.fsm.dispatch(settings, this, config, this.i18n);
  }

  mappingConfiguration = {
    isFilterShow: flag => this.emit('changeClass', { target: '.js-s3d-filter', flag, changeClass: 's3d-show' }),
    isFilterTransition: flag => this.emit('changeClass', { target: '.js-s3d-filter', flag, changeClass: 'active-filter' }),
    controllerFilter: flag => this.emit('changeClass', { target: '.js-s3d-ctr__filter', flag, changeClass: 's3d-show' }),
    controllerTitle: flag => this.emit('changeClass', { target: '.js-s3d-ctr__title', flag, changeClass: 's3d-show' }),
    controllerPhone: flag => this.emit('changeClass', { target: '.js-s3d-ctr__call', flag, changeClass: 's3d-show' }),
    controllerCompass: flag => this.emit('changeClass', { target: '.js-s3d-ctr__compass', flag, changeClass: 's3d-show' }),
    controllerTabs: flag => this.emit('changeClass', { target: '.js-s3d-ctr__elem', flag, changeClass: 's3d-show' }),
    controllerHelper: flag => this.emit('changeClass', { target: '.js-s3d-ctr__helper', flag, changeClass: 's3d-show' }),
    controllerInfoBox: flag => this.emit('changeClass', { target: '.js-s3d-infoBox', flag, changeClass: 's3d-show' }),
    controllerFavourite: flag => this.emit('changeClass', { target: '.s3d-ctr__favourites', flag, changeClass: 's3d-show' }),
    controllerInfrastructure: flag => this.emit('changeClass', { target: '.js-s3d-ctr__infra', flag, changeClass: 's3d-show' }),
    controllerBack: flag => this.emit('changeClass', { target: '.js-s3d__back', flag, changeClass: 's3d-show' }),
    controllerChoose: flag => this.emit('changeClass', { target: '.js-s3d__choose--flat', flag, changeClass: 's3d-show' }),
    preloaderMini: flag => this.emit('changeClass', { target: '.js-fs-preloader-before', flag, changeClass: 's3d-show' }),
  };

  iteratingConfig(delay = 400) {
    const width = document.documentElement.offsetWidth;
    const typeDevice = width > 992 ? 'desktop' : 'mobile';
    const state = this.fsmConfig[this.fsm.state][typeDevice];
    const settings = Object.keys(state);
    const updatedSettings = () => settings.forEach(name => {
      if (this.mappingConfiguration[name]) {
        this.mappingConfiguration[name](state[name]);
      }
    });

    setTimeout(updatedSettings, delay);
  }

  checkNextFlyby(data, id) {
    if (id === undefined) {
      return null;
    }

    const includes = this.checkFlatInSVG(this.structureFlats, id);
    const setting = this.fsm.settings;

    if (size(includes) === 0) {
      console.warn('flat are not found in svg  id №:', id)
      return null;
    }

    if (has(includes, [data.flyby, data.side])) {
      return {
        type: 'flyby',
        flyby: data.flyby,
        side: data.side,
        slides: includes[data.flyby][data.side],
        change: false,
      };
    }

    if (_.has(includes, [setting.flyby, setting.side])) {
      return {
        type: 'flyby',
        flyby: setting.flyby,
        side: setting.side,
        method: 'search',
        slide: includes[setting.flyby][setting.side],
        change: false,
      };
    }

    const key1 = Object.keys(includes);
    const key2 = Object.keys(includes[key1[0]]);
    const slides = includes[key1[0]][key2[0]];
    let change = false;
    if (setting.type !== 'flyby' || setting.flyby !== key1 || setting.side !== key2) {
      change = true;
    }

    return {
      type: 'flyby',
      flyby: key1[0],
      side: key2[0],
      slides,
      change,
    };
  }
}

export default AppModel;
