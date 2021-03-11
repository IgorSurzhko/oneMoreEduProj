'use strict';

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

	const deadLine = '2021-03-10';

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

	new MenuCard(
		"img/tabs/vegy.jpg",
		"vegy",
		'Меню "Фитнес"',
		'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
		9,
		'.menu .container',
		'menu__item',
		'big'
	).render();

	new MenuCard(
		"img/tabs/elite.jpg",
		"elite",
		'Меню “Премиум”',
		'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода	в ресторан!',
		14,
		'.menu .container',
		'menu__item'
	).render();

	new MenuCard(
		"img/tabs/post.jpg",
		"post",
		'Меню "Постное"',
		'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие 		продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
		21,
		'.menu .container',
		'menu__item'
	).render();

	// FORMS, here Am working with OPEN_SERVER (localhost)

	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо, скоро мы к вам вернемся',
		failure: 'Шо-та ваще умерло'
	};

	forms.forEach(item => {
		postData(item);
	});

	function postData(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault(); // отмена ребута страницы

			const statusMessage = document.createElement('img'); //
			statusMessage.src = message.loading; // вывод спиннера загрузки из массива message
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`; // доабвили ЦСС стили для спинера, инлайн стили
			form.append(statusMessage); //

			const request = new XMLHttpRequest();
			request.open('POST', 'server.php');

			// request.setRequestHeader('Content-type', 'multipart/form-data'); не нужно отправлять в данном случае ЗАГОЛОВОК
			const formData = new FormData(form); //легко конструировать наборы пар ключ-значение

			request.send(formData); //отправляем объект formData
			request.addEventListener('load', () => {
				if (request.status === 200) {
					console.log(request.response);
					showThanksModal(message.success); // сообщение из массива выше
					form.reset(); // очищаем форму
						statusMessage.remove();
				} else {
					showThanksModal(message.failure); // сообщение неудачи
				}
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
				<div class="modal__close" date-close>&times;</div>	
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
});