'use strict';

function renderUserMemesGallery() {
    document.querySelector('main').innerHTML =
        `<section class="user-gallery-container">
            <h1>Your Memes</h1>
            <section class="user-memes-container"></section>
        </section>`
    document.querySelector('nav button.active').classList.remove('active');
    document.querySelector('.memes-btn').classList.add('active');
    document.body.classList.remove('menu-open');
    renderUserMemes();
}

function renderUserMemes() {
    var strHTML = '';
    let memes = getUserMemesUrls();
    memes.forEach(meme => {
        strHTML += `<img src=${meme.url} onclick="renderEditor(${meme.id}, false)">`
    });
    document.querySelector('.user-memes-container').innerHTML = strHTML;
}