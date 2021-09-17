import $ from 'jquery';
import i18next from 'i18next';
import language from '../../../static/language/index';
import loader from './modules/loaderTime';
import { isBrowser, isDevice } from './modules/checkDevice';
import {
  preloader,
} from './modules/general/General';
import CreateMarkup from './modules/markup';
import AppController from './modules/app/app.controller';
import AppModel from './modules/app/app.model';
import AppView from './modules/app/app.view';
import Controller from './modules/templates/controller';
import Plannings from './modules/templates/plannings';
import Favourites from './modules/templates/favourites';
import Filter from './modules/templates/filter';

document.addEventListener('DOMContentLoaded', global => {
  preloader().show();
  init();
});

// window.nameProject = 'montreal';
window.nameProject = 'template';
window.defaultProjectPath = `/wp-content/themes/${window.nameProject}/`;
window.defaultModulePath = `/wp-content/themes/${window.nameProject}/assets/s3d/`;
window.defaultStaticPath = `/wp-content/themes/${window.nameProject}/static/`;
window.status = 'local';
// window.status = 'dev';
// window.status = 'prod';

async function loadLangFile(lang) {
  const result = await $.ajax(`${defaultStaticPath}language/${lang}.json`);
  return result;
}

const createHtml = i18n => {
  const controllerNode = Controller(i18n);
  const planningsNode = Plannings(i18n);
  const favouritesNode = Favourites(i18n);
  const filterNode = Filter(i18n);
  const moduleContainer = document.querySelector('.js-s3d__slideModule');
  moduleContainer.insertAdjacentHTML('afterbegin', [
    controllerNode,
    planningsNode,
    favouritesNode,
    filterNode,
  ].join(''));
};

async function init() {
  window.createMarkup = CreateMarkup;
  let config;
  await $.ajax(`${defaultStaticPath}settings.json`).then(resolve => {
    config = resolve;
  });
  const languageContainer = document.querySelector('.screen__lang');
  if (languageContainer) {
    document.querySelector('.header__call').insertAdjacentElement('beforeBegin', languageContainer);
  }

  const lang = document.querySelector('html').lang || 'ua';
  const i18Instance = i18next.createInstance();

  i18Instance.init({
    lng: lang,
    debug: true,
    resources: language,
  });
  const checkSpeed = new Promise(resolve => {
    loader(resolve, config.flyby[1].outside, nameProject);
  });

  const promises = Promise.all([
    i18Instance,
    checkSpeed,
  ]);

  promises.then(([i18n, value]) => {
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
    createHtml(i18Instance);
    config.flyby[1].outside['browser'] = Object.assign(isBrowser(), value);
    const app = new AppModel(config, i18Instance);
    const appView = new AppView(app, {
      switch: $('.js-s3d__nav__btn'),
      choose: $('[data-selected-type]'),
      wrapper: $('.js-s3d__slideModule'),
    });
    const appController = new AppController(app, appView);
    app.init();
    $(window).resize(() => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
  }).catch(error => {
    console.error(error);
    window.location.href = '/';
  });
}

window.checkValue = val => !val || val === null || val === undefined || (typeof val === 'number' && isNaN(val));
