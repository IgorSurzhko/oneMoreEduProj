'use strict';

// const { off } = require("node:process");

window.addEventListener('DOMContentLoaded', () => {
	// Tabs 4life
	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
		tabsContent.forEach(item => {
			item.style.display = 'none';
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');

		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].style.display = 'block';
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', (event) => {
		const target = event.target;

		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});

	//Timer is ALIVE!!!!

	const deadLine = '2023-03-10';

	function getTimeRemaining(endtime) {
		const t = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor(t / (1000 * 60 * 60 * 24)),
			hours = Math.floor((t / (1000 * 60 * 60) % 24)),
			minutes = Math.floor((t / 1000 / 60) % 60),
			seconds = Math.floor((t / 1000) % 60);
		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};

	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock() {
			const t = getTimeRemaining(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}

		}

	}
	setClock('.timer', deadLine);


	// modal window pop-up

	const modalTrigger = document.querySelectorAll('[data-modal]'), //обращение к элементу чере дата атрибут
		modal = document.querySelector('.modal');

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', openModal);
	});

	function openModal() {
		modal.classList.add('show'); // добавляем стиль из ЦСС, там он прописан, меняет display block/none
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden'; //убрать прокрутку страницы за модальным окном
		// clearInterval(modalTimerId);  !!!!!!!!!!!!!!!!!!!!
		// пользователь сам открыл модальное окно-должны вырубить таймер и не показывать еще раз окно через modalTimerId
	}

	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = ''; // вернуть прокрутку страницы после закрытия модального окна

	}

	// если кликаем во всю область modal и если НЕ КОНКРЕТНО в modal dialog тогда закрываем весь попап
	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});

	// закрыть модальное окно при нажатии esc 
	document.addEventListener('keydown', (e) => {
		if (e.code === "Escape" && modal.classList.contains('show')) {
			closeModal();
		}
	});
	const modalTimerId = setTimeout(openModal, 50000); // через 5 секунд показать пользователю модальное окно

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll);
		}
	}
	window.addEventListener('scroll', showModalByScroll);
	// показывать один раз модальное окно при прокрутке до конца страницы

	// использование классов для карточек

	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.classes = classes;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 27;
			this.changeToUAH();
		}

		changeToUAH() {
			this.price = +this.price * this.transfer;
		}

		render() {
			const element = document.createElement('div');
			//если не было передано ни одного класса, то формируем их самостоятельно
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				//если передан хотя бы один класс то добавляем его этому элементу
				this.classes.forEach(className => element.classList.add(className));
			}

			this.classes.forEach(className => element.classList.add(className));
			element.innerHTML = `
				<img src=${this.src} alt=${this.alt}>
				<h3 class="menu__item-subtitle">${this.title}</h3>
				<div class="menu__item-descr">${this.descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
				</div>
			`;
			this.parent.append(element);
		}
	}


	const getResource = async (url) => { 
		const res = await fetch(url);

		if (!res.ok) { //.ok - это свойство промиса вернувшегося и fetch
			throw new Error(`Could not fetch ${url}, status: ${res.status}`); 
			//throw дословно выбрасывает объект ошибки
 		}

		return await res.json(); 
	};

	getResource('http://localhost:3000/menu')
		.then(data => {
			data.forEach(({img, altimg, title, descr, price}) => {
				new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
			});
		});



	// FORMS, here Am working with OPEN_SERVER (localhost)

	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо, скоро мы к вам вернемся',
		failure: 'Шо-та ваще умерло'
	};

	forms.forEach(item => {
		bindPostData(item);
	});
	// тут фетч апишка, запрос на сервер через урлу (fetch возвращает ПРОМИС)
	const postData = async (url, data) => { //асинк - говорим что тут асинхронный код
		const res = await fetch(url, { // операторы асинк и аваит всегда в паре, аваит говорит чего ждет асинк
			method: "POST",
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});

		return await res.json(); //тоже ждать пока все преобразуется в жисон
	};





	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault(); // отмена ребута страницы

			const statusMessage = document.createElement('img'); //
			statusMessage.src = message.loading; // вывод спиннера загрузки из массива message
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`; // доабвили ЦСС стили для спинера, инлайн стили
			form.insertAdjacentElement('afterend', statusMessage); // аналог form.append(statusMessage);

			const formData = new FormData(form); //легко конструировать наборы пар ключ-значение

			const json = JSON.stringify(Object.fromEntries(formData.entries())); 
			//entries преобразует объект в массив массивов [[...],[.....]]
			//Object.fromEntries то что внутри преобразует в классический объект
			//JSON.stringify делает формат жисон из того что внтури

			postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data);
					showThanksModal(message.success); // сообщение из массива выше
					statusMessage.remove();
				}).catch(() => {
					showThanksModal(message.failure); // сообщение неудачи
				}).finally(() => {
					form.reset(); // очищаем форму
				});
		});
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.classList.add('hide');
		openModal(); // открываем новую модалку

		const thanksModal = document.createElement('div'); //формирование верстки новой модалки
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `    
			<div class="modal__content">
				<div class="modal__close" data-close>&times;</div>	
				<div class="modal__title">${message}</div>	
			</div>
		`; // выше новая верстка которую вставляем в модалку

		document.querySelector('.modal').append(thanksModal); // добавляем эту верстку к форме

		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}


	//slider 

	const slides = document.querySelectorAll('.offer__slide'),
		  slider = document.querySelector('.offer__slider'),
	      prev = document.querySelector('.offer__slider-prev'), 
		  next = document.querySelector('.offer__slider-next'),
		  total = document.querySelector('#total'),
		  current = document.querySelector('#current'),
		  slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		  slidesField = document.querySelector('.offer__slider-inner'),
		  width = window.getComputedStyle(slidesWrapper).width;
	let slideIndex = 1;
	let offset = 0;

	if (slides.length < 10) {   
		//если количество слайдов больше чем 10 то подставляем нолик в значение текущего слайда для отображения на странице
			total.textContent = `0${slides.length}`;
			current.textContent = `0${slideIndex}`;
		} else {
			total.textContent = slides.length;
			current.textContent = slideIndex;

		}

	slidesField.style.width = 100 * slides.length + '%';
	slidesField.style.display = 'flex';
	slidesField.style.transition = '0.5s all';

	slidesWrapper.style.overflow = 'hidden';

	slides.forEach(slide => {
		slide.style.width = width;
	});

	slider.style.position = 'relative';

	const indicators = document.createElement('ol'),
		  dots = [];

	indicators.classList.add('carousel-indicators');
	indicators.style.cssText = `
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 15;
		display: flex;
		justify-content: center;
		margin-right: 15%;
		margin-left: 15%;
		list-style: none;
	`;
	slider.append(indicators);

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1);
		dot.style.cssText = `
			box-sizing: content-box;
			flex: 0 1 auto;
			width: 30px;
			height: 6px;
			margin-right: 3px;
			margin-left: 3px;
			cursor: pointer;
			background-color: #fff;
			background-clip: padding-box;
			border-top: 10px solid transparent;
			border-bottom: 10px solid transparent;
			opacity: .5;
			transition: opacity .6s ease;
		`;
		if (i == 0) {
			dot.style.opacity = 1;
		}
		indicators.append(dot);
		dots.push(dot);
	}


	next.addEventListener('click', () => {
		if (offset == +width.replace(/\D/g, '') * (slides.length - 1)){
			//replace(/\D/g, '') заменяем все НЕ числа пустой строкой
			offset = 0;
		} else {
			offset += +width.replace(/\D/g, '');
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}

		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;

		}

		dots.forEach(dot => dot.style.opacity = '.5');
		dots[slideIndex - 1].style.opacity = 1;
	});

	prev.addEventListener('click', () => {
		if (offset == 0){
			offset = +width.replace(/\D/g, '') * (slides.length - 1);			
		} else {
			offset -= +width.replace(/\D/g, '');
		}
		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}
	
		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}

		dots.forEach(dot => dot.style.opacity = '.5');
		dots[slideIndex - 1].style.opacity = 1;
	
	});
	// фуекционал что каждая точка по клику меняет слайд
	dots.forEach(dot => {
		dot.addEventListener('click', (e) => {
			const slideTo = e.target.getAttribute('data-slide-to');

			slideIndex = slideTo;
			offset = +width.replace(/\D/g, '') * (slideTo - 1);	
			slidesField.style.transform = `translateX(-${offset}px)`;

			if (slides.length < 10) {
				current.textContent = `0${slideIndex}`;
			} else {
				current.textContent = slideIndex;
	
			}
						
			dots.forEach(dot => dot.style.opacity = '.5');
			dots[slideIndex - 1].style.opacity = 1;



		});
	});

	
});