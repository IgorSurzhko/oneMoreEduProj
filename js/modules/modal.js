function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('show'); // добавляем стиль из ЦСС, там он прописан, меняет display block/none
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden'; //убрать прокрутку страницы за модальным окном
   if (modalTimerId) {
    clearInterval(modalTimerId);
    // пользователь сам открыл модальное окно-должны вырубить таймер и не показывать еще раз окно через modalTimerId

   }
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = ''; // вернуть прокрутку страницы после закрытия модального окна

}


function modal(triggerSelector, modalSelector, modalTimerId) {
    // modal window pop-up

    const modalTrigger = document.querySelectorAll(triggerSelector), //обращение к элементу чере дата атрибут
        modal = document.querySelector(modalSelector);

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId));
    });



    // если кликаем во всю область modal и если НЕ КОНКРЕТНО в modal dialog тогда закрываем весь попап
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    });
 
    // закрыть модальное окно при нажатии esc 
    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    });

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);
    // показывать один раз модальное окно при прокрутке до конца страницы


}

export default modal;
export {closeModal};
export {openModal};