import { gsap, Power1, TimelineMax } from 'gsap';
import Card from '../templates/card';
import EventEmitter from '../eventEmitter/EventEmitter';

class FavouritesModel extends EventEmitter {
  constructor(config, i18n) {
    super();
    this.getFlat = config.getFlat;
    this.setFlat = config.setFlat;
    this.updateFsm = config.updateFsm;
    this.fsm = config.fsm;
    this.animationSpeed = 800;
    this.i18n = i18n;
    this.favouritesIds$ = config.favouritesIds$;
    this.updateFavouritesBlock = this.updateFavouritesBlock.bind(this);
  }

  init() {
    this.favouritesIds$.subscribe(favourites => {
      this.emit('updateCountFavourites', favourites.length);
      this.emit('updateFavouritesInput', favourites);
    });

    this.favouritesIds$.next(this.getFavourites());
  }

  update() {
    this.updateFavouritesBlock();
    this.emit('updateFvCount', this.favouritesIds$.value.length);
  }

  selectElementHandler(id) {
    this.updateFsm({ type: 'flat', id });
  }

  checkedFlat(id) {
    const flat = this.getFlat(id);
    const favourites = this.favouritesIds$.value;
    const method = _.isObjectLike(flat) ? 'xor' : 'difference';
    const updatedFavourites = _[method](favourites, [id]);

    this.favouritesIds$.next(updatedFavourites);
  }

  removeElement(id) {
    this.emit('removeElemInPageHtml', id);
  }

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
    this.updateFsm({ type: 'favourites' });
  }

  updateFavouritesBlock() {
    this.emit('clearAllHtmlTag', '.js-s3d-fv__list .js-s3d-card');
    const html = this.favouritesIds$.value.map(id => Card(this.i18n, this.getFlat(id), this.favouritesIds$));
    this.emit('setInPageHtml', html);
  }

  changeFavouritesHandler(element, isAnimate) {
    // eslint-disable-next-line radix
    const id = parseInt(element.getAttribute('data-id'));
    if (!id) return;

    const favourites = this.favouritesIds$.value;
    const updatedFavourites = _.xor(favourites, [id]);
    sessionStorage.setItem('favourites', JSON.stringify(updatedFavourites));

    if (isAnimate) {
      this.moveToFavouriteEffectHandler(element, !updatedFavourites.includes(id));
    }
    setTimeout(() => {
      this.favouritesIds$.next(updatedFavourites);
      if (updatedFavourites.length === 0 && this.fsm.state === 'favourites') {
        window.history.back();
      }
    }, this.animationSpeed);
  }

  // animation transition heart from/to for click
  moveToFavouriteEffectHandler(target, reverse) {
    const animatingIcon = target.querySelector('svg');
    const endPositionElement = document.querySelector('.js-s3d__favourite-icon');
    const distance = this.getBetweenDistance(animatingIcon, endPositionElement);
    this.animateFavouriteElement(endPositionElement, animatingIcon, distance, reverse);
  }

  getBetweenDistance(animatingIcon, endPositionElement) {
    const animate = animatingIcon.getBoundingClientRect();
    const endAnimate = endPositionElement.getBoundingClientRect();
    const animateX = animate.left + (animate.width / 2);
    const animateY = animate.top + (animate.height / 2);
    const endAnimateX = endAnimate.left + (endAnimate.width / 2);
    const endAnimateY = endAnimate.top + (endAnimate.height / 2);
    return {
      x: endAnimateX - animateX,
      y: endAnimateY - animateY,
    };
  }

  getSpeedAnimateHeart(offsetObj) {
    return Math.abs(offsetObj.x) + Math.abs(offsetObj.y);
  }

  animateFavouriteElement(destination, element, distance, reverse) {
    if (gsap === undefined) return;
    const curElem = element.cloneNode(true);
    curElem.classList.add('s3d-favourite__pulse');
    const animatingElParams = element.getBoundingClientRect();
    document.querySelector('.js-s3d__slideModule').insertAdjacentElement('beforeend', curElem);
    curElem.style.cssText += `
			width:${animatingElParams.width}px;
			height:${animatingElParams.height}px;
			left:${animatingElParams.left}px;
			top:${animatingElParams.top}px;
			`;

    const speed = this.animationSpeed / 1000 * (this.getSpeedAnimateHeart(distance) / 850);
    const tl = new TimelineMax({
      delay: 0,
      repeat: 0,
      paused: true,
      onComplete: () => {
        curElem.remove();
      },
    });
    if (reverse === true) {
      tl.from(curElem, { y: distance.y, duration: speed, ease: Power1.easeInOut });
      tl.from(curElem, { x: distance.x, duration: speed, ease: Power1.easeInOut }, `-=${speed}`);
    } else {
      tl.to(curElem, { y: distance.y, duration: speed, ease: Power1.easeInOut });
      tl.to(curElem, { x: distance.x, duration: speed, ease: Power1.easeInOut }, `-=${speed}`);
    }
    tl.set(curElem, { x: 0, y: 0 });
    tl.set(curElem, { clearProps: 'all' });
    tl.play();
  }
}

export default FavouritesModel;
