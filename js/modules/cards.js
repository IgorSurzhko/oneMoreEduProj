function cards() {
    
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

}

module.exports = cards;