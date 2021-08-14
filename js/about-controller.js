'use strict';

function renderAbout() {
    document.querySelector('main').innerHTML =
        `<section class="about-container">
            <img class="my-img" src="img/ziv.jpg">
            <h2>Ziv Shuvy</h2>
            <h4>Full Stack Web Developer (hopefully one day soon) </h4>
            <div class="social">
                <a href="https://instagram.com/zivshuvy?utm_medium=copy_link"><i class="fa fa-instagram"></i></a>
                <a href="https://www.facebook.com/Zivshuvy/"><i class="fa fa-facebook"></i></a>
                <a href="#"><i class="fa fa-linkedin"></i></a>
            </div>

        </section>`
    document.querySelector('nav button.active').classList.remove('active');
    document.querySelector('.about-btn').classList.add('active');
    document.body.classList.remove('menu-open');
}