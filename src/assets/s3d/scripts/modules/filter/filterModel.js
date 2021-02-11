import ionRangeSlider from 'ion-rangeslider';
import $ from 'jquery';
import _ from 'lodash';
import EventEmitter from '../eventEmitter/EventEmitter';
import {
  addBlur, unActive, preloader, updateFlatFavourite, compass, debounce,
} from '../general/General';

class FilterModel extends EventEmitter {
  constructor(config) {
    super();
    this.filterName = { range: ['area', 'floor'], checkbox: ['rooms'] };
    this.filter = {};
    this.nameFilterFlat = {
      area: 'all_room',
      // living: 'life_room',
      // house: 'build_name',
      floor: 'floor',
      rooms: 'rooms',
      // price: 'price',
      // priceM2: 'price_m2',
    };
    // name key js and name key in flat
    this.configProject = {};
    this.subject = config.subject;
    this.updateCurrentFilterFlatsId = config.updateCurrentFilterFlatsId;

    // this.hoverFlatId$ = config.hoverFlatId$
    this.currentFilterFlatsId$ = config.currentFilterFlatsId$;
    this.getFlat = config.getFlat;
    this.allAmountFlats = Object.keys(this.getFlat()).length;
    this.updateFsm = config.updateFsm;
  }

  init() {
    this.filterName.checkbox.forEach(name => {
      $('.js-s3d-filter [data-type=name]').each((i, el) => el.data(name, i + 1));
    });
    this.getMinMaxParam(this.getFlat());
    this.filterName.range.forEach(name => {
      const classes = this.getAttrInput(name);
      if (classes) {
        const flat = this.configProject[name];
        for (const key in flat) {
          classes[key] = (key === 'min') ? Math.floor(+flat[key]) : Math.ceil(+flat[key]);
        }
        this.createRange(classes);
      }
    });

    this.emit('setAmountAllFlat', this.allAmountFlats);
    this.emit('setAmountSelectFlat', this.allAmountFlats);

    this.checkFilter();
    this.getFilterParam();
    this.updateAllParamFilter();

    this.deb = debounce(this.resize.bind(this), 500);
  }

  getNameFilterFlat() { return this.nameFilterFlat; }

  // запускает фильтр квартир
  filterFlatStart() {
    addBlur('.js-s3d-filter__table');
    addBlur('.s3d-pl__right');
    const flats = this.applyFilter(this.getFlat());
    this.emit('showSelectElements', flats);
  }

  changeFilterParam() {
    const flats = this.applyFilter(this.getFlat());
    this.emit('showSelectElement', flats);
  }

  // возвращает data-attribute input-а
  getAttrInput(name) {
    return $(`.js-s3d-filter__${name}--input`).length > 0 ? $(`.js-s3d-filter__${name}--input`).data() : false;
  }

  getAttrSelect(name) {
    const input = $(`.js-s3d-filter__${name}--input:checked`).length
      ? $(`.js-s3d-filter__${name}--input:checked`)
      : $(`.js-s3d-filter__${name}--input`);

    const arr = { type: input.data('type'), value: [] };
    input.each((i, el) => arr.value.push($(el).data(name)));
    return arr;
  }

  // нужно переписать #change
  getMinMaxParam(flats) {
    const data = Object.keys(flats);
    data.forEach(key => {
      const el = flats[key];
      for (const nameKey in this.nameFilterFlat) {
        const name = this.nameFilterFlat[nameKey];
        if (_.has(el, this.nameFilterFlat[nameKey])) {
          const num = typeof el[name] === 'string' ? el[name].replace(/\s+/g, '') : el[name];
          if (!this.configProject[nameKey]) this.configProject[nameKey] = { min: num, max: num };
          if (num < +this.configProject[nameKey].min) this.configProject[nameKey].min = num;
          if (num > +this.configProject[nameKey].max) this.configProject[nameKey].max = num;
        }
      }
    });
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
        min: config.min || 0,
        max: config.max || 0,
        from: config.min || 0,
        to: config.max || 0,
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

  // добавить range в список созданых фильтров
  setRange(config) {
    if (config.type !== undefined) {
      this.filter[config.type] = {};
      this.filter[config.type].type = 'range';
      this.filter[config.type].elem = $(`.js-s3d-filter__${config.type}--input`).data('ionRangeSlider');
    }
  }

  // добавить checkbox в список созданых фильтров
  setCheckbox(config) {
    if (config.type !== undefined) {
      if (!_.has(this.filter[config.type], 'elem')) {
        this.filter[config.type] = {
          elem: [],
          value: [],
          type: 'select',
        };
      }
      this.filter[config.type].elem = $(`.js-s3d-filter__${config.type} [data-type = ${config.type}]`);
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

  // запустить фильтрацию
  applyFilter(data) {
    this.clearFilterParam();
    this.checkFilter();
    this.getFilterParam();
    this.updateAllParamFilter();
    return this.filterFlat(data, this.filter, this.filterName, this.nameFilterFlat);
  }

  updateAllParamFilter() {
    for (const key in this.filter) {
      const select = this.filter[key];
      if (select.type === 'select') {
        let { value } = select;
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

  // обновить выбраные данные фильтра
  checkFilter() {
    this.filterName.range.forEach(name => {
      const classes = this.getAttrInput(name);
      if (classes) this.setRange(classes);
    });
    this.filterName.checkbox.forEach(name => this.setCheckbox(this.getAttrSelect(name)));
  }

  // поиск квартир по параметрам фильтра
  filterFlat(data, filter, filterName, nameFilterFlat) {
    // прерывает фильт если не выбран дом или комнаты
    // if (filter.house.value.length === 0 || filter.rooms.value.length === 0) {
    // 	return {}
    // }
    const keysFlat = Object.keys(data);
    let amountFlat = 0;
    const select = keysFlat.filter(id => {
      const flat = data[+id];
      for (const param in filter) {
        if (+flat.sale !== 1) return false;
        if (
          filterName.checkbox.includes(param)
          && filter[param].value.length > 0
          && !filter[param].value.some(key => +flat[nameFilterFlat[param]] === +key)
        ) {
          return false;
        }
        if (filterName.range.includes(param)) {
          if (+flat[nameFilterFlat[param]] < +filter[param].min
            || +flat[nameFilterFlat[param]] > +filter[param].max) {
            return false;
          }
        }
      }
      if (flat[nameFilterFlat.house] !== undefined
        && !flat[nameFilterFlat.house]
      ) {
        // eslint-disable-next-line no-param-reassign
        flat[nameFilterFlat.house].match(/^(\d+)/)[1] = [];
      }

      if (flat[nameFilterFlat.floor] !== undefined
        && flat[nameFilterFlat.house]
        && !flat[nameFilterFlat.house].includes(flat[nameFilterFlat.floor])
        && flat[nameFilterFlat.floor] > 0
      ) {
        flat[nameFilterFlat.house].push(flat[nameFilterFlat.floor]);
      }
      amountFlat += 1;
      return true;
    });
    this.emit('setAmountSelectFlat', select.length);
    this.updateCurrentFilterFlatsId(select);
    return select;
  }

  // добавить возможные варианты и/или границы (min, max) в список созданых фильтров
  getFilterParam() {
    for (const key in this.filter) {
      switch (this.filter[key].type) {
          case 'select':
            $(`.js-s3d-filter__${key}--input:checked`).each((i, el) => this.filter[key].value.push($(el).data(key)));
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
    // if (document.documentElement.offsetWidth < 568) {
    this.emit('hideFilter');
    // }
    // $('.s3d-filter__top').css('height', $('.s3d-filter__top').clientHeight)
  }
}

export default FilterModel;
