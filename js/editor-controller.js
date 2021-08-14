'use strict';

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

let gElCanvas;
let gCtx;
let gStartPos;
let gIsNewMeme;
let gMemeId = -1;

function renderEditor(id, isNew) {
    document.querySelector('main').innerHTML =
        `<section class="editor-container">
            <div class="save-msg">
                <span>Your meme has been successfully saved,</span>
                <span class="open-user-memes" onclick="renderUserMemesGallery()">check it out!</span>
            </div>
            <section class="main-container">
            <section class="canvas-container">
                <canvas height="450" width="450"></canvas>
             </section>
            <section class="control-box">
                <input type="text" class="edit-txt-input" oninput="onEditTxt(this)" placeholder="Enter text here">
                 <div class="line-features-btns">
                    <button class="next-txt" onclick="onNextLine()"><img src="img/arrows.png"></button>
                    <button class="add-txt" onclick="onAddLine()"><img src="img/plus.png"></button>
                    <button class="delete-txt" onclick="onRemoveLine()"><img src="img/delete.png"></button>
                </div>
                <div class="txt-features">
                    <button class="inc-size-btn" onclick="onChangeFontSize(2)"><img src="img/features/A+.png"></button>
                    <button class="dec-size-btn" onclick="onChangeFontSize(-2)"><img src="img/features/A-.png"></button>
                    <button class="align-left-btn" onclick="onSetAilment('end')"><img src="img/features/align-left.png"></button>
                    <button class="align-center-btn" onclick="onSetAilment('center')"><img src="img/features/align-center.png"></button>
                    <button class="align-right-btn" onclick="onSetAilment('start')"><img src="img/features/align-right.png"></button>
                    <select name="fonts-list" class="fonts-input" onchange="onSetFont(this)">
                        <option value="Impact">Impact</option>
                        <option value="Arial">Arial</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="Gisha">Gisha</option>
                    </select>
                    <div class="change-color-input">
                        <input type="color" class="stroke-color-input" oninput="onSetStrokeColor(this)">
                        <div class="color-img-container">
                            <img src="img/features/stroke.png">
                        </div>
                    </div>
                    <div class="change-color-input">
                        <input type="color" class="text-color-input" oninput="onSetTextColor(this)">
                        <div class="color-img-container">
                            <img src="img/features/canvas.png">
                         </div>
                    </div>
                </div>
                <div class="stickers">
                    <img src="svg/prev-stickers.svg" onclick="onNextPage(-1)">
                    <div class="stickers-container"></div>
                    <img src="svg/next-stickers.svg" onclick="onNextPage(1)">
                </div>
                <div class="meme-features">
                    <button class="share-btn" onclick="onShareMeme()"><img src="img/share.png"><span>Share</span></button>
                    <button class="save-btn" onclick="onSaveMeme()"><i class="fa fa-floppy-o" aria-hidden="true"></i><span>Save</span></button>
                </div>
                </section>
             </section>
        </section>`
    gMemeId = -1;
    gIsNewMeme = isNew;
    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    clearMeme();
    setCurrImgId(id);
    if (!isNew) {
        gMemeId = id;
        setMeme(JSON.parse(JSON.stringify(getMemeById(id).memeData)));
    }
    renderEditorStickers();
    renderCanvas();
}


function onNextPage(diff) {
    setNextPage(diff);
    renderEditorStickers();
}

function onSaveMeme() {
    renderCanvas(false);
    setTimeout(() => {
        document.querySelector('.save-msg').style.display = 'flex';
        const imgDataUrl = gElCanvas.toDataURL("image/jpeg");
        addUserMeme(imgDataUrl, gMemeId);
        renderCanvas();
    }, 1000);
    setTimeout(() => {
        const elMsg = document.querySelector('.save-msg');
        if (elMsg) {
            elMsg.style.display = 'none';
        }
    }, 7000)
}

function onShareMeme() {
    renderCanvas(false);
    setTimeout(() => {
        uploadImg();
    }, 1000);
}

function onAddSticker(elSticker) {
    addSticker(elSticker.src, gElCanvas.width / 2, gElCanvas.height / 2, elSticker.width, elSticker.height);
    renderCanvas();
}

//MOUSE AND TOUCH EVENTS

function onMove(ev) {
    const pos = getEvPos(ev);
    if (isDrag()) {
        const dx = pos.x - gStartPos.x;
        const dy = pos.y - gStartPos.y;
        if (getSelectedType() === 'text') {
            moveText(dx, dy);
        } else if (getSelectedType() === 'sticker') {
            moveSticker(dx, dy);
        } else {
            if (dx > 0 || dy > 0) {
                changeStickerSize(2);
            } else {
                changeStickerSize(-2);
            }
            renderCanvas();
        }

        gStartPos = pos;
        renderCanvas();
    } else {
        if (getHoveredLineIdx(pos) !== -1 || getHoveredStickerIdx(pos) !== -1 || isCircleClicked(pos)) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = '';
        }
    }
}

function onUp(ev) {
    setTextDrag(false)
    const pos = getEvPos(ev);
    if (getHoveredLineIdx(pos) !== -1 || getHoveredStickerIdx(pos) !== -1 || isCircleClicked(pos)) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = '';
    }
}

function onDown(ev) {
    const pos = getEvPos(ev);
    console.log(pos);
    let currLineIdx = getHoveredLineIdx(pos);
    let currStickerIdx = getHoveredStickerIdx(pos);
    if (currLineIdx !== -1) {
        setSelectedLineIdx(currLineIdx);
        setSelectedType('text');
        setTextDrag(true);
        gStartPos = pos;
        document.body.style.cursor = 'grabbing';
        renderCanvas();
    }
    else if (currStickerIdx !== -1) {
        setSelecetedStickerIdx(currStickerIdx);
        setSelectedType('sticker');
        setTextDrag(true);
        gStartPos = pos;
        document.body.style.cursor = 'grabbing';
        renderCanvas();
    }
    if (getSelectedType() === 'sticker' || getSelectedType() === 'circle') {
        if (isCircleClicked(pos)) {
            document.body.style.cursor = 'grabbing';
            setSelectedType('circle');
            setTextDrag(true);
            gStartPos = pos;
        };
    }
}

//MOUSE AND TOUCH EVENTS


// FEATURES

function onSetTextColor(elInput) {
    if (getSelectedType() === 'sticker') return;
    setTextColor(elInput.value);
    renderCanvas();
}

function onSetStrokeColor(elInput) {
    if (getSelectedType() === 'sticker') return;
    setStrokeColor(elInput.value);
    renderCanvas();
}


function onSetFont(elInput) {
    if (getSelectedType() === 'sticker') return;
    setFont(elInput.value);
    renderCanvas();
}

function onSetAilment(ailment) {
    if (getSelectedType() === 'sticker') return;
    setAilment(ailment);
    renderCanvas();
}

function onChangeFontSize(diff) {
    if (getSelectedType() === 'text') changeFontSize(diff);
    else changeStickerSize(diff);
    renderCanvas();
}

function onEditTxt(elInput) {
    if (getMeme().lines.length === 0) return;
    if (getSelectedType() === 'sticker') return;
    setLineTxt(elInput.value);
    renderCanvas();
}

function onRemoveLine() {
    if (getSelectedType() === 'text') removeLine();
    else removeSticker();
    renderCanvas();
}

function onNextLine() {
    nextLine();
    renderCanvas();
}

function onAddLine() {
    addLine();
    renderCanvas();
}


//FEATURES

//DRAW

function draw(drawBox) {
    let lines = getMeme().lines;
    lines.forEach((line, idx) => {
        if (line.x === -1000 && line.y === -1000) {
            setDefualtLocation(idx);
        }
        drawLineTxt(line);
        if (getMeme().selectedLineIdx === idx && getSelectedType() === 'text' && drawBox) {
            drawLineBox(line);
        }
    });

    let stickers = getStickers();
    stickers.forEach((sticker, idx) => {
        if (getMeme().selectedStickerIdx === idx && (getSelectedType() === 'sticker' || getSelectedType() === 'circle') && drawBox) {
            drawStickerBox(sticker);
        }
        let stickerImg = new Image();
        stickerImg.src = sticker.url;

        if (stickerImg.complete && stickerImg.naturalHeight !== 0) {
            gCtx.drawImage(stickerImg, sticker.x, sticker.y, sticker.width, sticker.height);
        } else {
            stickerImg.onload = function () {
                gCtx.drawImage(stickerImg, sticker.x, sticker.y, sticker.width, sticker.height);
            }
        }
    });
}

function setDefualtLocation(idx) {
    if (idx === 0) {
        setLineCoords(gElCanvas.width / 2, gElCanvas.height - 30);
    } else if (idx === 1) {
        setLineCoords(gElCanvas.width / 2, 50);
    } else {
        setLineCoords(gElCanvas.width / 2, gElCanvas.height / 2);
    }
}

function drawLineTxt(line) {
    if (line.size > 25) {
        gCtx.lineWidth = 2;
    } else {
        gCtx.lineWidth = 1;
    }
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.textAlign = line.align;
    gCtx.fillStyle = line.textColor;
    gCtx.strokeStyle = line.strokeColor;
    gCtx.fillText(line.txt, line.x, line.y);
    gCtx.strokeText(line.txt, line.x, line.y);
}


function drawLineBox(line) {
    gCtx.beginPath()
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = '#00000099'
    gCtx.fillStyle = '#ffffff42'
    const { x, y, width, height } = calcTextBox(line);
    gCtx.rect(x, y, width, height);
    gCtx.fill();
    gCtx.stroke();
    gCtx.closePath();
}

function drawStickerBox(sticker) {
    gCtx.beginPath()
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = '#00000099'
    gCtx.fillStyle = '#ffffff42'
    const { x, y, width, height } = calcStickerBox(sticker);
    gCtx.rect(x, y, width, height);
    gCtx.fill();
    gCtx.stroke();
    gCtx.closePath();
    drawCircle(x + width, y + height);
}

function drawCircle(x, y) {
    gCtx.beginPath();
    gCtx.lineWidth = 1;
    gCtx.arc(x, y, 10, 0, 2 * Math.PI);
    gCtx.fillStyle = '#fe6e20';
    gCtx.fill();
    gCtx.strokeStyle = '#fff';
    gCtx.stroke();
    gCtx.closePath();

}

//DRAW


// RENDERS

function renderEditorStickers() {
    let strHTML = '';
    let size = getPageSize();
    for (let i = gPageIdx * PAGE_SIZE; i < size* (gPageIdx+1); i++) {
        strHTML += `<img class="sticker" onclick="onAddSticker(this)" src="img/stickers/sticker${i + 1}.png">`
    }
    document.querySelector('.stickers-container').innerHTML = strHTML;
}


function renderCanvas(drawBox = true) {
    let currImg = getCurrImg();
    let img = new Image();
    img.src = currImg.url;
    img.onload = function () {
        resizeCanvas(img);
        renderBgImg(img);
        draw(drawBox);
        addListeners();
    };
    if (getMeme().lines.length) {
        const currLine = getMeme().lines[getMeme().selectedLineIdx];
        if (currLine.txt !== 'Enter text here' && getMeme().selectedType === 'text') {
            document.querySelector('.edit-txt-input').value = currLine.txt;

        } else {
            document.querySelector('.edit-txt-input').value = '';
        }
        document.querySelector('.stroke-color-input').value = currLine.strokeColor;
        document.querySelector('.text-color-input').value = currLine.textColor;
        document.querySelector('.fonts-input').value = currLine.font;
    }
}

function renderBgImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}

function resizeCanvas(img) {
    let currWidth = img.width;
    if (window.innerWidth < 700) {
        img.width = window.innerWidth - 100;
        img.height = img.height * (img.width / currWidth)
    } else {
        img.width = 500;
        img.height = img.height * (500 / currWidth)
    }
    const elContainer = document.querySelector('.canvas-container');
    elContainer.style.width = img.width + 'px';
    elContainer.style.height = img.height + 'px';
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

// RENDERS


function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
}

function getCtx() {
    return gCtx;
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}