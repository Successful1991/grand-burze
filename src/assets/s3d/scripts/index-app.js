import $ from 'jquery';
import i18next from 'i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import language from '../../../static/language/index';
import loader from './modules/loaderTime';
import { isBrowser, isDevice } from './modules/checkDevice';
import CreateMarkup from './modules/markup';
import AppController from './modules/app/app.controller';
import AppModel from './modules/app/app.model';
import AppView from './modules/app/app.view';
import Controller from './modules/templates/controller';
import Plannings from './modules/templates/plannings';
import Favourites from './modules/templates/favourites';
import Filter from './modules/templates/filter';

document.addEventListener('DOMContentLoaded', global => {
  init();
});

window.nameProject = 'grand-byrze';
// window.nameProject = 'template';
window.defaultProjectPath = `/wp-content/themes/${window.nameProject}`;
window.defaultModulePath = `/wp-content/themes/${window.nameProject}/assets/s3d`;
window.defaultStaticPath = `/wp-content/themes/${window.nameProject}/static`;
// window.status = 'local';
window.status = 'dev';
// window.status = 'prod';

async function loadLangFile(lang) {
  const result = await $.ajax(`${defaultStaticPath}/language/${lang}.json`);
  return result;
}

const createHtml = i18n => {
  const controllerNode = Controller(i18n);
  const planningsNode = Plannings(i18n);
  const favouritesNode = Favourites(i18n, 0);
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
  const promise = new Promise((requred, reject) => {
    $.ajax(`${defaultStaticPath}/settings.json`).then(resolve => {
      requred(resolve)
      config = resolve;
    });
  });
  config = await promise;
  const languageContainer = document.querySelector('.screen__lang');
  if (languageContainer) {
    document.querySelector('.header__call').insertAdjacentElement('beforeBegin', languageContainer);
  }

  const lang = document.querySelector('html').lang || 'uk';
  const i18Instance = i18next.createInstance();

  i18Instance
    .use(intervalPlural)
    .init({
      // lng: 'uk',
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
    // if (!value.fastSpeed) {
    //   for (const pr in config) {
    //     if (config[pr].imageUrl || window.status !== 'local') {
    //       config[pr].imageUrl += 'mobile/';
    //     }
    //   }
    // }
    if (isDevice('mobile') || document.documentElement.offsetWidth <= 768) {
      $('.js-s3d__slideModule').addClass('s3d-mobile');
    }

    createHtml(i18Instance);
    config['browser'] = Object.assign(isBrowser(), value);
    const app = new AppModel(config, i18Instance);
    const appView = new AppView(app, {
      switch: $('.js-s3d-nav__btn'),
      choose: $('[data-choose-type]'),
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
