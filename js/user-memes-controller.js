'use strict';

function renderUserMemesGallery() {
    document.querySelector('main').innerHTML =
        `<section class="user-gallery-container">
            <h1>Your Memes</h1>
            <h4>You haven't any saved memes yet!</h4>
            <section class="user-memes-container"></section>
        </section>`
    document.querySelector('nav button.active').classList.remove('active');
    document.querySelector('.memes-btn').classList.add('active');
    document.body.classList.remove('menu-open');
    renderUserMemes();
}

function onDownloadMeme(elLink, memeId) {
    elLink.href = getMemeById(memeId).url;
}

function onRemoveMeme(memeId) {
    removeMeme(memeId);
    renderUserMemes();
}

function renderUserMemes() {
    var strHTML = '';
    let memes = getUserMemesUrls();
    memes.forEach(meme => {
        if(window.innerWidth < 700) {
            strHTML += `<div class="user-meme-container">
            <img src="${meme.url}">
            <div class="control-bar">  
                <a class="fa fa-pencil-square-o" aria-hidden="true" onclick="renderEditor(${meme.id}, false)"></a>
                <a href="#" download="my-meme" class="fa fa-download" aria-hidden="true" onclick="onDownloadMeme(this, ${meme.id})"></a>
                <a class="fa fa-trash-o" aria-hidden="true" onclick="onRemoveMeme(${meme.id})"></a>
            </div>
        </div>`
        } else {
            strHTML += `<div class="user-meme-container">
            <img src="${meme.url}" onclick="renderEditor(${meme.id})">
            <div class="control-bar">  
                <a class="fa fa-pencil-square-o" aria-hidden="true" onclick="renderEditor(${meme.id}, false)"></a>
                <a href="#" download="my-meme" class="fa fa-download" aria-hidden="true" onclick="onDownloadMeme(this, ${meme.id})"></a>
                <a class="fa fa-trash-o" aria-hidden="true" onclick="onRemoveMeme(${meme.id})"></a>
            </div>
        </div>`
        }
    });
    if(strHTML === '') {
        document.querySelector('.user-gallery-container h4').style.display = 'unset';
    } else {
        document.querySelector('.user-gallery-container h4').style.display = 'none';
    }
    document.querySelector('.user-memes-container').innerHTML = strHTML;
}