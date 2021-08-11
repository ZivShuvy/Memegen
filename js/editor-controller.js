'use strict';

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

let gElCanvas;
let gCtx;

function renderEditor(id) {
    document.querySelector('main').innerHTML =
        `<section class="editor-container">
            <section class="canvas-container">
                <canvas height="450" width="450"></canvas>
             </section>
            <section class="control-box">
                <input type="text" class="edit-txt-input" oninput="onEditTxt(this)">
                 <div class="line-features-btns">
                    <button class="next-txt" onclick="onNextLine()"></button>
                    <button class="add-txt" onclick="onAddLine()"></button>
                    <button class="delete-txt" onclick="onRemoveLine()"></button>
                </div>
                <div class="txt-features">
                <button onclick="onChangeFontSize(2)">A<span>+</span></button>
                <button onclick="onChangeFontSize(-2)">A<span>-</span></button>
                <button class="align-left-btn" onclick="onSetAilment('end')"></button>
                <button class="align-center-btn" onclick="onSetAilment('center')"></button>
                <button class="align-right-btn" onclick="onSetAilment('start')"></button>
                <input list="fonts" name="fonts-list" class="fonts-input" placeholder="Enter font">
                <datalist id="fonts">
                    <option value="Impact"></option>
                    <option value="Arial"></option>
                    <option value="Tahoma"></option>
                    <option value="Gisha"></option>
                </datalist>
                <button class="underline-btn" onclick="onSetUnderLine()">S</button>
                <button class="set-color-btn" onclick="onSetColor()"></button>
            </div>
            </section>
        </section>`

    gElCanvas = document.querySelector('canvas');
    gCtx = gElCanvas.getContext('2d');
    clearLines();
    setCurrImgId(id);
    renderCanvas();
}

function onSetAilment(ailment) {
    setAilment(ailment);
    renderCanvas();
}

function onChangeFontSize(diff) {
    changeFontSize(diff);
    renderCanvas();
}

function onEditTxt(elInput) {
    if (getMeme().lines.length === 0) return;
    setLineTxt(elInput.value);
    renderCanvas();
}

function onRemoveLine() {
    removeLine();
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

function drawText() {
    let lines = getMeme().lines;
    lines.forEach((line, idx) => {
        if (line.x === -1000 && line.y === -1000) {
            setDefualtLocation(idx);
        }
        drawLineTxt(line);
        if (getMeme().selectedLineIdx === idx) {
            drawLineBox(line);
        }
    })
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
    gCtx.lineWidth = 2;
    gCtx.font = `${line.size}px ${line.font}`;
    gCtx.textAlign = line.align;
    gCtx.fillStyle = line.color;
    gCtx.fillText(line.txt, line.x, line.y);
    gCtx.strokeText(line.txt, line.x, line.y);
}


function drawLineBox(line) {
    gCtx.beginPath()
    gCtx.strokeStyle = '#22252c'
    if (line.align == 'start') {
        gCtx.rect(line.x - 10, line.y + 10, gCtx.measureText(line.txt).width + 20, -(line.size + 10));
    } else if (line.align === 'end') {
        gCtx.rect((gElCanvas.width / 2) - gCtx.measureText(line.txt).width - 10 , line.y + 10, gCtx.measureText(line.txt).width + 20, -(line.size + 10));
    } else {
        gCtx.rect((gElCanvas.width / 2) - (gCtx.measureText(line.txt).width / 2) - 10, line.y + 10, gCtx.measureText(line.txt).width + 20, -(line.size + 10));
    }
    gCtx.stroke()
    gCtx.closePath();
}


function renderCanvas() {
    let currImg = getCurrImg();
    let img = new Image();
    img.src = currImg.url;
    img.onload = function () {
        resizeCanvas(img);
        renderImg(img);
        drawText();
        addListeners();
    };
    if (getMeme().lines.length) {
        document.querySelector('.edit-txt-input').value = getMeme().lines[getMeme().selectedLineIdx].txt;
    }
}

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}

function resizeCanvas(img) {
    const elContainer = document.querySelector('.canvas-container');
    elContainer.style.width = img.width + 'px';
    elContainer.style.height = img.height + 'px';
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetHeight;
}

function addTouchListeners() {
    // gElCanvas.addEventListener('touchstart', startDraw)
    // gElCanvas.addEventListener('touchend', stopDraw)
    // gElCanvas.addEventListener('touchmove', draw)
}

function addMouseListeners() {
    // gElCanvas.addEventListener('mousedown', startDraw);
    // gElCanvas.addEventListener('mouseup', stopDraw);
    // gElCanvas.addEventListener('mousemove', draw);
}

function addListeners() {
    addMouseListeners();
    addTouchListeners();
    //For testing:
    // window.addEventListener('resize', () => {
    //     resizeCanvas();
    // });
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