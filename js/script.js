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
		  modal = document.querySelector('.modal'),
		  modalCloseBtn = document.querySelector('[data-close]');

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', openModal); 	
	});	  

	function openModal() {
		modal.classList.add('show');			// добавляем стиль из ЦСС, там он прописан, меняет display block/none
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden'; //убрать прокрутку страницы за модальным окном
		clearInterval(modalTimerId);  
		// пользователь сам открыл модальное окно-должны вырубить таймер и не показывать еще раз окно через modalTimerId
	}

	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = ''; 		 // вернуть прокрутку страницы после закрытия модального окна

	}

	modalCloseBtn.addEventListener('click', closeModal); 


					// если кликаем во всю область modal и если НЕ КОНКРЕТНО в modal dialog тогда закрываем весь попап
	modal.addEventListener('click', (e) => {       
		if (e.target === modal) {
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
});