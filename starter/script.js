'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////////////////////////////////
//Page navigation

// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//     e.preventDefault()
//     const id = this.getAttribute('href')
//     document.querySelector(id).scrollIntoView({behavior:'smooth.'})

//   })
// })

// 1.Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  const id = e.target.getAttribute('href');

  //Matching startegy
  if (e.target.classList.contains('nav__link')) {
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.scrollX, window.scrollY);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  section1.scrollIntoView({ behavior: 'smooth' });
});

//Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const target = e.target.closest('.operations__tab');

  //Guard clause
  if (!target) return;
  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Active tab
  target.classList.add('operations__tab--active');

  //Activate content area
  document
    .querySelector(`.operations__content--${target.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
//Passing
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

//Sticky navigation
// const initialCoords = section1.getBoundingClientRect()
//  window.addEventListener('scroll',function(){
//   if(window.scrollY > initialCoords.top)nav.classList.add('sticky')
//   else nav.classList.remove('sticky')
//  })

//Sticky navigation: Intersection Observer API
// const obsCallback=function(entries,observer){
//   entries.forEach(entry=>{
//     console.log(entry);
//   })
// }

//  const obsOptions = {
//   root:null,
//   threshold:0.1}

// const observer = new IntersectionObserver(obsCallback,obsOptions)

// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden')
});

//Lazy loading images
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const slider1 = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;
  // slider1.style.transform = 'scale(0.4) translateX(-1200px)';
  // slider1.style.overflow = 'visible';
  //Next slide

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot dots__dot--active" data-slide="${i}"></button>`
      );
    });
  };
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const init = function () {
    goToSlide(currentSlide);
    createDots();
    activateDot(currentSlide);
  };
  init();
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      currentSlide = slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
//Scrolling
// window.scrollTo(
//   s1coords.left + window.pageXOffset,
//   s1coords.top + window.pageYOffset
// );

// window.scrollTo({
//  left: s1coords.left + window.scrollX,
//  top: s1coords.top + window.scrollY,
//  behavior:'smooth'
// })

// const h1 = document.querySelector('h1');

// //Going downworads child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'orange';
// h1.lastElementChild.style.color = 'orange';

// //Going upwords: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// // h1.closest('h1').style.background = 'var(--gradient-secondary)'

// // Going sideways

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });
//Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);
// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// //Creating and inserting elements
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for imroved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class ="btn btn--close--cookie">Got it!<button>';
// // header.prepend(message)
// // header.append(message)
// // header.append(message.cloneNode(true))

// header.before(message);
// // header.after(message)

// // delete Elements
// document
//   .querySelector('.btn--close--cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color);
// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 10 + 'px';

// // document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Atributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';

// //Non-Standard
// console.log(logo.designer);
// console.log(logo.getAttribute('desinger'));
// logo.setAttribute('company', 'Bankist');
// console.log(logo.src); // Absolute Link
// console.log(logo.getAttribute('src')); //realtive Link

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// //Data attributes
// console.log(logo.dataset.versionNumber);

// //Classes

// logo.classList.add('c', 'j');
// logo.classList.remove('c', 'j');
// logo.classList.toggle('c');
// logo.classList.contains('c');
// //Don't use
// logo.className = 'Jonas';

//   console.log('Current scroll (X/Y)', window.scrollX, window.scrollY);

//   console.log(
//     'height/width viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );

//   //Scrolling
//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );

//   // window.scrollTo({
//   //  left: s1coords.left + window.scrollX,
//   //  top: s1coords.top + window.scrollY,
//   //  behavior:'smooth'
//   // })

//   section1.scrollIntoView({ behavior: 'smooth' });
// ;

// //  const alertH1 = function (e) {
// //   alert('Addeventlistener: Great! You are hovering the heading');
// //   h1.removeEventListener('mouseenter',alertH1)
// // }

// const h1 = document.querySelector('h1');

// // h1.addEventListener('mouseenter', alertH1);

// // setTimeout(()=>h1.removeEventListener('mouseenter',alertH1),5000)
// // h1.onmouseenter = function (e) {
// //   alert('onmouseenter: Great! You are hovering the heading');
// // };
// const randomInt = (min,max)=>Math.floor(Math.random()*(max-min+1)+min)
// const randomColor =()=>`rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`
// console.log(randomColor());
// document.querySelector('.nav__link').addEventListener('click',function(e){
//   this.style.backgroundColor = randomColor()
//   console.log(`link`,e.target,e.currentTarget);
// })
// document.querySelector('.nav__links').addEventListener('click',function(e){
//   this.style.backgroundColor = randomColor()
//   console.log(`Container`,e.target,e.currentTarget);
// })
// document.querySelector('.nav').addEventListener('click',function(e){
//   this.style.backgroundColor = randomColor()
//   console.log(`NAV`,e.target,e.currentTarget);

// })

// let income = 400;
// let machines = 0;
// let balance = 0;
// const wealth = function (years) {
//   for (let i = 0; i <= years * 12; i++) {
//     balance += income;
//     if(machines<20){
//     if (balance >= 5000) {
//       machines++
//       balance-=5000
//       income+=300
//     }}
//     else{
//       balance+=income
//     }
//   }
//   console.log(machines,income,balance);
// };
// wealth(5)
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree build');
});
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});
// window.addEventListener('beforeunload',function(e){
//   e.preventDefault()
//   console.log(e)
//   e.returnValue = '';
// })
