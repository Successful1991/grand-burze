import $ from 'jquery';
import { gsap, Power4, TimelineMax } from 'gsap';
import EventEmitter from '../eventEmitter/EventEmitter';

import {
  addBlur, unActive, preloader, updateFlatFavourite, compass, debounce,
} from '../general/General';

class FavouritesModel extends EventEmitter {
  constructor(config) {
    super();
    this.getFlat = config.getFlat;
    this.setFlat = config.setFlat;
    this.subject = config.subject;
    this.currentFilterFlatsId$ = config.currentFilterFlatsId$;
    this.updateFsm = config.updateFsm;
    this.fsm = config.fsm;
    this.activeFlat = config.activeFlat;
    this.animationSpeed = 750;
    this.history = config.history;
    this.preloader = preloader();
  }

  init() {
    $.ajax('/wp-content/themes/template/assets/s3d/template/card.php').then(response => {
      this.templateCard = JSON.parse(response);
    });

    this.currentFilterFlatsId$.subscribe(value => {
      // update favourite
    });
    // sessionStorage.clear()
    this.showSelectFlats();
    this.addPulseCssEffect();

    const favourites = this.getFavourites();
    this.emit('updateFavouriteAmount', favourites.length);
    this.emit('updateViewAmount', favourites.length);
    favourites.forEach(el => {
      const val = this.getFlat(el);
      this.setFlat(val);
    });
  }

  selectElementHandler(id) {
    this.activeFlat = id;
    this.history.update({ type: 'flat', method: 'general', id });
    this.updateFsm({ type: 'flat', method: 'general' }, id);
  }

  showSelectFlats() {
    const favourites = this.getFavourites();
    if (checkValue(favourites)) return;
    favourites.forEach(id => {
      this.checkedFlat(id, true);
    });
  }

  checkedFlat(id, value) {
    const flat = this.getFlat(id);
    let check = !flat['favourite'];
    if (value !== 'undefined') { check = value; }
    flat['favourite'] = check;
    this.setFlat(flat);
    return flat;
  }

  addStorage(id) {
    let favourites = this.getFavourites();
    if (checkValue(favourites)) {
      favourites = [+id];
    } else if (favourites.indexOf(+id) === -1) {
      favourites.push(+id);
    } else {
      return;
    }
    sessionStorage.setItem('favourites', JSON.stringify(favourites));
    this.emit('updateFavouriteAmount', favourites.length);
    this.emit('updateViewAmount', favourites.length);
  }

  removeElemStorage(id) {
    const favourites = this.getFavourites();
    const index = favourites.indexOf(id);

    if (index === -1 || !favourites) return;
    favourites.splice(index, 1);
    sessionStorage.setItem('favourites', JSON.stringify(favourites));
    this.emit('updateFavouriteAmount', favourites.length);
    this.emit('updateViewAmount', favourites.length);
    this.checkedFlat(id, false);

    if (favourites.length === 0 && this.fsm.state === 'favourites') {
      window.history.back();
      // this.emit('hide');
      // this.history.update({ type: this.history.history.type, method: this.history.history.method });
      // this.updateFsm({ type: this.history.history.type, method: this.history.history.method }, this.history.history.id);
      // this.history.stepBack();
    }
  }

  // clearStorage() {
  // нужно дописать цикл который будет проходить по элементам избраного и переводить их в false
  //   sessionStorage.removeItem('favourites')
  //   this.updateAmount(0)
  //   // $('.js-s3d__pl__list input').prop('checked', false)
  //   // $('.js-s3d-filter input').prop('checked', false)
  //   $('.js-s3d-favorite__wrap').addClass('s3d-hidden')
  // }

  getFavourites() {
    const storage = JSON.parse(sessionStorage.getItem('favourites'));
    const result = (storage || [])
      .filter(el => (!checkValue(el)))
      .reduce((previous, el) => {
        if (previous.indexOf(+el) < 0) {
          previous.push(+el);
        }
        return previous;
      }, []);
    return result;
  }

  openFavouritesHandler() {
    this.emit('clearAllHtmlTag', '.js-s3d-fv__list .js-s3d-card');
    const favourites = this.getFavourites();
    this.emit('updateFavouriteAmount', favourites.length);
    const html = favourites.map(el => this.createElemHtml(this.getFlat(el)));
    this.emit('setInPageHtml', html);
    this.history.update({ type: 'favourites', method: 'general' });
    this.updateFsm({ type: 'favourites', method: 'general' }, this);
  }

  addFavouritesHandler(event, id) {
    const { target } = event;
    if (checkValue(id)) return;
    let nameFunc = 'removeElemStorage';
    let favouriteEffectTo = true;
    if (target.checked) {
      nameFunc = 'addStorage';
      favouriteEffectTo = false;
    }
    setTimeout(() => {
      this[nameFunc](id);
    }, this.animationSpeed);
    if (target.closest('label') !== null) {
      this.moveToFavouriteEffectHandler(event.target.closest('label'), favouriteEffectTo);
    }
  }

  createElemHtml(el) {
    const div = $.parseHTML(this.templateCard)[0];
    div.dataset.id = el.id;
    div.querySelector('[data-key="type"]').innerHTML = el.type;
    div.querySelector('[data-key="number"]').innerHTML = el.number;
    div.querySelector('[data-key="floor"]').innerHTML = el.floor;
    div.querySelector('[data-key="rooms"]').innerHTML = el.rooms;
    div.querySelector('[data-key="area"]').innerHTML = el['all_room'];
    div.querySelector('[data-key="src"]').src = el['img_small'];

    return div;
  }

  // animation transition heart from/to for click
  addPulseCssEffect() {
    this.animationPulseClass = 'pulse';
    document.body.insertAdjacentHTML('beforeend', `
		<style class="${this.animationPulseClass}">
			.${this.animationPulseClass} {
				border-radius: 50%;
				cursor: pointer;
				box-shadow: 0 0 0 rgba(255,255,255, 0.75);
				animation: pulse 0.5s 1 ease-out;
			}.${this.animationPulseClass}:hover {	animation: none;}@-webkit-keyframes ${this.animationPulseClass} {	0% {-webkit-box-shadow: 0 0 0 0 rgba(255,255,255, 0.4);	}	70% {		-webkit-box-shadow: 0 0 0 10px rgba(255,255,255, 0);	}	100% {		-webkit-box-shadow: 0 0 0 0 rgba(255,255,255, 0);	}}@keyframes pulse {	0% {	  -moz-box-shadow: 0 0 0 0 rgba(255,255,255, 0.4);	  box-shadow: 0 0 0 0 rgba(255,255,255, 0.4);	}	70% {		-moz-box-shadow: 0 0 0 10px rgba(255,255,255, 0);		box-shadow: 0 0 0 10px rgba(255,255,255, 0);	}	100% {		-moz-box-shadow: 0 0 0 0 rgba(255,255,255, 0);		box-shadow: 0 0 0 0 rgba(255,255,255, 0);	}}
		</style>
		`);
  }

  moveToFavouriteEffectHandler(target, reverse) {
    const currentScreen = document.querySelector('.js-s3d-ctr').dataset.type;
    const iconToAnimate = target.querySelector('svg');
    let distance;
    if (document.documentElement.clientWidth < 576) {
      distance = this.getBetweenDistance(document.querySelector('.s3d-mobile-only[data-type="favourites"]'), iconToAnimate);
      this.animateFavouriteElement(document.querySelector('.s3d-mobile-only[data-type="favourites"]'), iconToAnimate, distance, reverse);
    } else {
      switch (currentScreen) {
          case 'flyby':
            distance = this.getBetweenDistance(document.querySelector('.js-s3d__favourites-icon'), iconToAnimate);
            this.animateFavouriteElement(document.querySelector('.js-s3d__favourites-icon'), iconToAnimate, distance, reverse);
            break;
          case 'plannings':
            distance = this.getBetweenDistance(document.querySelector('.s3d-ctr__favourites-icon'), iconToAnimate);
            this.animateFavouriteElement(document.querySelector('.s3d-ctr__favourites-icon'), iconToAnimate, distance, reverse);
            break;
          case 'flat':
            distance = this.getBetweenDistance(document.querySelector('.s3d-ctr__favourites-icon'), iconToAnimate);
            this.animateFavouriteElement(document.querySelector('.s3d-ctr__favourites-icon'), iconToAnimate, distance, reverse);
            break;
          default:
            distance = this.getBetweenDistance(document.querySelector('.js-s3d__favourites-icon'), iconToAnimate);
            this.animateFavouriteElement(document.querySelector('.js-s3d__favourites-icon'), iconToAnimate, distance, reverse);
            break;
      }
    }
  }

  getBetweenDistance(elem1, elem2) {
    // get the bounding rectangles
    const el1 = elem1.getBoundingClientRect();
    const el2 = elem2.getBoundingClientRect();
    // get div1's center point
    const div1x = el1.left + (el1.width / 2);
    const div1y = el1.top + (el1.height / 2);

    // get div2's center point
    const div2x = el2.left + (el2.width / 2);
    const div2y = el2.top + (el2.height / 2);

    // calculate the distance using the Pythagorean Theorem (a^2 + b^2 = c^2)
    const distanceSquared = window.Math.pow(div1x - div2x, 2) + window.Math.pow(div1y - div2y, 2);
    // const distance = Math.sqrt(distanceSquared)
    return {
      x: div1x - div2x,
      y: div1y - div2y,
    };
  }

  animateFavouriteElement(destination, element, distance, reverse) {
    if (gsap === undefined) return;
    const curElem = element
    // console.log(Math.abs(div1x - div2x), 'X');
    // console.log(Math.abs(div1y - div2y), 'Y');
    const animatingElParams = curElem.getBoundingClientRect();
    curElem.style.cssText += `
			width:${animatingElParams.width}px;
			height:${animatingElParams.height}px;
			transform-origin:top left;`;
    curElem.style.cssText += `
			fill: #CFBE97;
			position:relative;
			z-index:2000;
			stroke:none;
			position:fixed;
			left:${animatingElParams.left}px;
			top:${animatingElParams.top}px;`;
    const speed = this.animationSpeed / 1000;
    // element.classList.add(this.animationPulseClass)
    const tl = new TimelineMax({
      delay: 0,
      repeat: 0,
      paused: true,
      onComplete: () => {
        curElem.classList.remove(this.animationPulseClass);
        curElem.style.cssText = '';
      },
    });
    if (reverse === true) {
      tl.from(curElem, { y: distance.y, duration: speed, ease: Power4.easeIn });
      tl.from(curElem, { x: distance.x, duration: speed / 2.5, ease: Power4.easeIn }, `-=${speed / 2.5}`);
    } else {
      tl.set(curElem, { classList: `+=${this.animationPulseClass}` });
      tl.to(curElem, { y: distance.y, duration: speed, ease: Power4.easeIn });
      tl.to(curElem, { x: distance.x, duration: speed / 2.5, ease: Power4.easeIn }, `-=${speed / 2.5}`);
    }
    tl.set(curElem, { x: 0, y: 0 });
    // tl.set(element, {position:'',width:'',height:'',stroke:'', fill:'',top:'',left:'',x:'',y:''});
    tl.set(curElem, { clearProps: 'all' });
    tl.play();
    // console.log(div2x, 'X2');
    return distance;
  }
}

export default FavouritesModel;