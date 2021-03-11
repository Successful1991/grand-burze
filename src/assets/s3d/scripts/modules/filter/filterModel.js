import ionRangeSlider from 'ion-rangeslider';
import $ from 'jquery';
import _ from 'lodash';
import EventEmitter from '../eventEmitter/EventEmitter';
import {
  addBlur, debounce,
} from '../general/General';

class FilterModel extends EventEmitter {
  constructor(config) {
    super();
    this.filterName = { range: ['area', 'floor'], checkbox: ['rooms'] };
    this.filter = {};
    this.nameFilterFlat = {
      area: 'all_room',
      floor: 'floor',
      rooms: 'rooms',
      // price: 'price',
      // priceM2: 'price_m2',
    };
    // name key js and name key in flat
    this.configProject = {};
    this.subject = config.subject;
    this.updateCurrentFilterFlatsId = config.updateCurrentFilterFlatsId;
    this.currentFilterFlatsId$ = config.currentFilterFlatsId$;
    this.getFlat = config.getFlat;
    this.allAmountFlats = Object.keys(this.getFlat()).length;
    this.updateFsm = config.updateFsm;
  }

  init() {
    this.configProject = this.getMinMaxParam(this.getFlat(), this.nameFilterFlat);
    this.filterName.checkbox.forEach(name => {
      this.setCheckbox(name);
    });

    this.filterName.range.forEach(name => {
      const type = this.configProject[name];
      for (const key in type) {
        type[key] = (key === 'min') ? Math.floor(type[key]) : Math.ceil(type[key]);
      }
      type['type'] = name;
      this.createRange(type);
      this.setRange(name);
    });

    this.emit('setAmountAllFlat', this.allAmountFlats);
    this.emit('setAmountSelectFlat', this.allAmountFlats);

    this.getFilterParam();
    this.updateAllParamFilter();

    this.deb = debounce(this.resize.bind(this), 500);
  }

  // запускает фильтр квартир
  filterFlatStart() {
    addBlur('.js-s3d-filter__table');
    addBlur('.s3d-pl__right');
    this.getFilterParam();
    this.updateAllParamFilter();

    const flats = this.startFilter(this.getFlat(), this.filter, this.nameFilterFlat);
    this.emit('setAmountSelectFlat', flats.length);
    this.updateCurrentFilterFlatsId(flats);

    this.emit('showSelectElements', flats);
  }

  // нужно переписать #change
  getMinMaxParam(flats, translatesNameKeyFlat) {
    const data = Object.keys(flats);

    const configProject = data.reduce((acc, key) => {
      const el = flats[key];
      const keysFilter = Object.entries(translatesNameKeyFlat);

      const config = keysFilter.reduce((accKeys, collKeys) => {
        const [keyName, name] = collKeys;
        if (!_.has(el, name)) {
          return accKeys;
        }
        const setting = accKeys;
        if (!setting[keyName]) {
          setting[keyName] = { min: el[name], max: el[name] };
          return setting;
        }
        if (el[name] < setting[keyName].min) {
          setting[keyName].min = el[name];
        }
        if (el[name] > setting[keyName].max) {
          setting[keyName].max = el[name];
        }
        return setting;
      }, acc);

      return config;
    }, {});
    return configProject;
  }

  // создает range slider (ползунки), подписывает на события
  createRange(config) {
    if (config.type !== undefined) {
      const self = this;
      const { min, max } = config;
      const $min = $(`.js-s3d-filter__${config.type}__min--input`);
      const $max = $(`.js-s3d-filter__${config.type}__max--input`);
      $(`.js-s3d-filter__${config.type}--input`).ionRangeSlider({
        type: 'double',
        grid: false,
        min,
        max,
        from: min || 0,
        to: max || 0,
        step: config.step || 1,
        onStart: updateInputs,
        onChange: updateInputs,
        onFinish(e) {
          updateInputs(e);
          self.filterFlatStart();
        },
        onUpdate: updateInputs,
      });
      const instance = $(`.js-s3d-filter__${config.type}--input`).data('ionRangeSlider');
      instance.update({
        min,
        max,
        from: min,
        to: max,
      });

      function updateInputs(data) {
        $min.prop('value', data.from);
        $max.prop('value', data.to);
      }

      $min.on('change', function () { changeInput.call(this, 'from'); });
      $max.on('change', function () { changeInput.call(this, 'to'); });

      function changeInput(key) {
        let val = $(this).prop('value');
        if (key === 'from') {
          if (val < min) val = min;
          else if (val > instance.result.to) val = instance.result.to;
        } else if (key === 'to') {
          if (val < instance.result.from) val = instance.result.from;
          else if (val > max) val = max;
        }

        instance.update(key === 'from' ? { from: val } : { to: val });
        $(this).prop('value', val);
        self.filterFlatStart();
      }
    }
  }


  // сбросить значения фильтра
  resetFilter() {
    this.emit('hideSelectElements');
    for (const key in this.filter) {
      if (this.filter[key].type === 'range') {
        this.filter[key].elem.update({ from: this.filter[key].elem.result.min, to: this.filter[key].elem.result.max });
      } else {
        this.filter[key].elem.each((i, el) => { el.checked ? el.checked = false : ''; });
      }
    }
    this.updateCurrentFilterFlatsId(Object.keys(this.getFlat()));
  }

  updateAllParamFilter() {
    for (const key in this.filter) {
      const select = this.filter[key];
      if (select.type === 'select') {
        let { value } = _.cloneDeep(select);
        if (_.isArray(value) && value.length === 0) {
          for (let i = +this.configProject.rooms.min; i <= +this.configProject.rooms.max; i++) {
            value.push(i);
          }
        }
        value = value.join(', ');
        this.emit('updateMiniInfo', {
          type: key,
          value,
          key: 'amount',
        });
      } else if (select.type === 'range') {
        this.emit('updateMiniInfo', {
          type: key,
          value: select.min,
          key: 'min',
        });

        this.emit('updateMiniInfo', {
          type: key,
          value: select.max,
          key: 'max',
        });
      }
    }
  }

  // добавить range в список созданых фильтров
  setRange(type) {
    if (type !== undefined) {
      this.filter[type] = {};
      this.filter[type].type = 'range';
      this.filter[type].elem = $(`.js-s3d-filter__${type}--input`).data('ionRangeSlider');
    }
  }

  // добавить checkbox в список созданых фильтров
  setCheckbox(type) {
    if (type !== undefined) {
      if (!_.has(this.filter[type], 'elem')) {
        this.filter[type] = {
          elem: [],
          value: [],
          type: 'select',
        };
      }
      this.filter[type].elem = $(`.js-s3d-filter__${type} [data-type = ${type}]`);
    }
  }

  // поиск квартир по параметрам фильтра
  startFilter(flats, settings, flatNameTranslate) {
    const flatsId = Object.keys(flats);
    return flatsId.filter(id => {
      const settingColl = Object.entries(settings);
      const isLeave = settingColl.every(setting => {
        const [name, value] = setting;
        const nameKeyFlat = flatNameTranslate[name];
        if (_.has(flats, [id, nameKeyFlat])) {
          if (value.type === 'range') {
            return this.checkRangeParam(flats[id], nameKeyFlat, value);
          } else if (value.type === 'select') {
            return this.checkSelectParam(flats[id], nameKeyFlat, value);
          }
        }
        return false;
      });
      return isLeave;
    });
  }

  checkRangeParam(flat, key, value) {
    return (_.has(flat, key)
      && flat[key] >= value.min
      && flat[key] <= value.max);
  }

  checkSelectParam(flat, key, value) {
    return (_.includes(value.value, flat[key]) || _.size(value.value) === 0);
  }

  // добавить возможные варианты и/или границы (min, max) в список созданых фильтров
  getFilterParam() {
    for (const key in this.filter) {
      switch (this.filter[key].type) {
          case 'select':
            $(`.js-s3d-filter__${key}--input:checked`).each((i, el) => {
              this.filter[key].value.push($(el).data(key));
            });
            break;
          case 'range':
            this.filter[key].min = this.filter[key].elem.result.from;
            this.filter[key].max = this.filter[key].elem.result.to;
            break;
          default:
            break;
      }
    }
  }

  // сбросить данные о фильтрах и выбранные квартиры
  clearFilterParam() {
    this.filter = {};
    this.emit('hideSelectElements');
    this.emit('setAmountSelectFlat', this.allAmountFlats);
  }

  resize() {
    this.emit('hideFilter');
  }
}

export default FilterModel;
