'use strict';

let gFilterBy = '';
let gOpenMore = false;


function onInit() {
    renderGallery();
}

function renderGallery() {
    document.querySelector('main').innerHTML =
        `  <section class="gallery-container">
        <section class="gallery-bar">
            <div class="input-container">
            <input list="keywords" name="keywords-list" class="search-bar" placeholder="Search" oninput="onFilterBy(this.value)">
            <datalist id="keywords">
                <option value="Happy"></option>
                <option value="Animal"></option>
                <option value="Men"></option>
                <option value="Women"></option>
                <option value="Comic"></option>
                <option value="Smile"></option>
              </datalist>
              <img class="search" src="img/search.png">
              </div>
            <span class="filter-words"></span>
            <button class="more-btn" onclick="onOpenMore()">More</button>
        </section>
        <section class="images-container"></section>
    </section>`
    document.querySelector('nav button.active').classList.remove('active');
    document.querySelector('.gallery-btn').classList.add('active');
    document.body.classList.remove('menu-open');
    renderImgs();
    renderFilters();
}


function onImgInput(ev) {
    loadImageFromInput(ev, addCustomImg);
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.onload = onImageReady.bind(null, img);
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}

function onOpenMore() {
    gOpenMore = !gOpenMore;
    if (gOpenMore) {
        document.querySelector('.more-btn').innerText = 'Less';
        document.querySelector('.filter-words').style.maxHeight = '600px';
    } else {
        document.querySelector('.more-btn').innerText = 'More';
        document.querySelector('.filter-words').style.maxHeight = '50px';
    }
}

function renderImgs() {
    let strHTML = `<div class="custom-container">
                     <button class="custom-img-btn">custom image</button>
                     <input class="upload-img-input" type="file" onchange="onImgInput(event)" />
                    </div>`;
    let imgs = getImgs();
    imgs.slice().reverse().forEach((img, idx) => {
        if (gFilterBy === '' || gFilterBy === 'all') {
            strHTML += `<img src=${img.url} onclick="renderEditor(${imgs.length-idx-1}, true)">`
        } else if (img.keywords.includes(gFilterBy.toLowerCase())) {
            strHTML += `<img src=${img.url} onclick="renderEditor(${imgs.length-idx-1}, true)">`
        }
    });
    document.querySelector('.images-container').innerHTML = strHTML;
}

function renderFilters() {
    let strHTML = '';
    let keyWords = getKeyWords();
    for (let i in keyWords) {
        strHTML += `<span onclick="onFilterBy('${i}')" style="font-size:${14 + keyWords[i]}px">${i}</span>`
    }
    document.querySelector('.filter-words').innerHTML = strHTML;
}

function onToggleMenu() {
    document.body.classList.toggle('menu-open');
}

function onFilterBy(filter) {
    gFilterBy = filter;
    if (getKeyWords()[filter] && getKeyWords()[filter] < 10) getKeyWords()[filter]++;
    renderFilters();
    renderImgs();
}

function onToggleScreen() {
    document.body.classList.toggle('menu-open');
}
