function modal() {
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


}

module.exports = modal;