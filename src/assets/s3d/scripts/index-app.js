import BehaviorSubject from 'rxjs';
import $ from 'jquery';
import Input from './modules/input';
import loader from './modules/loaderTime';
import { isBrowser, isDevice } from './modules/checkDevice';
import {
  addBlur, unActive, preloader, updateFlatFavourite, compass, debounce,
} from './modules/general/General';
import CreateMarkup from './modules/markup';
import AppController from './modules/app/app.controller';
import AppModel from './modules/app/app.model';
import AppView from './modules/app/app.view';

document.addEventListener('DOMContentLoaded', global => {
  init();
});

window.nameProject = 'template';
window.status = 'local';
// const status = 'dev'
// const status = 'prod'

async function init() {
  window.createMarkup = CreateMarkup;
  let config
  await $.ajax('/wp-content/themes/template/static/settings.json').then(resolve => {
    config = resolve;
  })
  // const config = {
  //   flyby: {
  //     1: {
  //       outside: {
  //         id: 'flyby_1_outside',
  //         generalWrapId: '#js-s3d__wrapper',
  //         imageUrl: `/wp-content/themes/${nameProject}/assets/s3d/images/${nameProject}/flyby/1/outside/`,
  //         class: 'js-s3d__wrapper',
  //         numberSlide: {
  //           min: 0,
  //           max: 119,
  //         },
  //         controlPoint: [29, 60, 88, 117],
  //         activeSlide: 29,
  //         mouseSpeed: 1,
  //         startDegCompass: 28,
  //       },
  //       inside: {
  //         id: 'flyby_1_inside',
  //         generalWrapId: '#js-s3d__wrapper',
  //         imageUrl: `/wp-content/themes/${nameProject}/assets/s3d/images/${nameProject}/flyby/1/inside/`,
  //         class: 'js-s3d__wrapper',
  //         numberSlide: {
  //           min: 0,
  //           max: 119,
  //         },
  //         controlPoint: [12, 42, 72, 108],
  //         activeSlide: 12,
  //         mouseSpeed: 1,
  //         startDegCompass: 28,
  //       },
  //     },
  //   },
  //   favourites: {
  //     id: 'favourites',
  //     generalWrapId: '.js-s3d__slideModule',
  //   },
  //   flat: {
  //     id: 'flat',
  //     generalWrapId: '.js-s3d__slideModule',
  //   },
  //   plannings: {
  //     id: 'plannings',
  //     generalWrapId: '.js-s3d__slideModule',
  //   },
  // };
  console.log(config)

  new Promise(resolve => {
    loader(resolve, config.flyby[1].outside.activeSlide, nameProject);
  }).then(value => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    if (!value.fastSpeed) {
      // else speed slowly update link with light image
      for (const pr in config) {
        if (config[pr].imageUrl || window.status !== 'local') {
          config[pr].imageUrl += 'mobile/';
        }
      }
    }
    if (isDevice('mobile') || document.documentElement.offsetWidth <= 768) {
      $('.js-s3d__slideModule').addClass('s3d-mobile');
    }

    config.flyby[1].outside['browser'] = Object.assign(isBrowser(), value);
    const app = new AppModel(config);
    const appView = new AppView(app, {
      switch: $('.js-s3d__select'),
      wrapper: $('.js-s3d__slideModule'),
    });
    const appController = new AppController(app, appView);
    app.init();

    $(window).resize(() => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
  });
}

window.checkValue = val => !val || val === null || val === undefined || (typeof val === 'number' && isNaN(val));
