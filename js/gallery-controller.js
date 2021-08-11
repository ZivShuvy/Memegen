'use strict';

function onInit() {
    renderGallery();
}

function renderGallery() {
    document.querySelector('main').innerHTML =
        `  <section class="gallery-container">
        <section class="gallery-bar">
            <input list="keywords" name="keywords-list" class="search-bar" placeholder="Search">
            <datalist id="keywords">
                <option value="Happy"></option>
                <option value="Animal"></option>
                <option value="Men"></option>
                <option value="Women"></option>
                <option value="Comic"></option>
                <option value="Smile"></option>
              </datalist>
            <span class="filter-words"><span>Funny </span></span>
            <button class="more-btn">More</button>
        </section>
        <section class="images-container"></section>
    </section>`
    renderImages();
}

function renderImages() {
    var strHTML = '';
    let imgs = getImgs();
    imgs.forEach((img, idx) => {
        strHTML += `<img src=${img.url} onclick="renderEditor(${idx})">`
    });
    document.querySelector('.images-container').innerHTML = strHTML;
}