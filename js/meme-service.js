'use strict'
let gKeywords = { 'happy': 12, 'funny puk': 1 }
let gImgsIdx = 0;
let gLineId = 0;
let gImgs = _createImgs();
let gIsDrag = false;


let gMeme = {
    selectedImgId: 0,
    selectedType: 'text',
    selectedLineIdx: 0,
    lines: [],
    selectedStickerIdx: -1,
    stickers: []
}


function getHoveredStickerIdx(clickedPos) {
    let stickerIdx = -1;
    gMeme.stickers.forEach((sticker, idx) => {
        const { x, y, width, height } = calcStickerBox(sticker);
        if (clickedPos.x >= x && clickedPos.x <= x + width && clickedPos.y >= y && clickedPos.y <= y + height) {
            stickerIdx = idx;
        }
    })
    return stickerIdx;
}

function changeStickerSize(diff) {
    getCurrSticker().height += diff;
    getCurrSticker().width += diff;
}

function moveSticker(dx, dy) {
    getCurrSticker().x += dx;
    getCurrSticker().y += dy;
}

function removeSticker() {
    if (gMeme.stickers.length === 0) return;
    gMeme.stickers.splice(gMeme.selectedStickerIdx, 1);
    if (gMeme.stickers.length === 1) gMeme.selectedStickerIdx = 0;
    else gMeme.selectedStickerIdx--;
}

function addSticker(url, x, y, width, height) {
    gMeme.stickers.push({
        url,
        x,
        y,
        width,
        height
    });
    gMeme.selectedStickerIdx++;
    gMeme.selectedType = 'sticker';
}

function calcStickerBox(sticker) {
    return {
        x: sticker.x - 10,
        y: sticker.y - 10,
        width: sticker.width + 20,
        height: sticker.height + 10
    }
}

function setSelecetedStickerIdx(idx) {
    gMeme.selectedStickerIdx = idx;
}

function setSelectedType(type) {
    gMeme.selectedType = type;
}

function getSelectedType() {
    return gMeme.selectedType;
}

function getCurrSticker() {
    return gMeme.stickers[gMeme.selectedStickerIdx];
}

function getStickers() {
    return gMeme.stickers;
}

function isDrag() {
    return gIsDrag;
}

function moveText(dx, dy) {
    getCurrLine().x += dx;
    getCurrLine().y += dy;
}

function setTextDrag(isDrag) {
    gIsDrag = isDrag;
}

function getHoveredLineIdx(clickedPos) {
    let lineIdx = -1;
    gMeme.lines.forEach((line, idx) => {
        const { x, y, width, height } = calcTextBox(line);
        if (clickedPos.x >= x && clickedPos.x <= x + width && clickedPos.y <= y && clickedPos.y >= y + height) {
            lineIdx = idx;
        }
    })
    return lineIdx;
}

function setTextColor(color) {
    getCurrLine().textColor = color;
}

function setStrokeColor(color) {
    getCurrLine().strokeColor = color;
}

function setFont(font) {
    getCurrLine().font = font;
}

function setAilment(ailment) {
    getCurrLine().align = ailment;
}

function changeFontSize(diff) {
    getCurrLine().size += diff;
}

function setLineTxt(txt) {
    getCurrLine().txt = txt;
}

function removeLine() {
    if (gMeme.lines.length === 0) return;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    if (gMeme.lines.length === 1) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx--;
}

function nextLine() {
    gMeme.selectedType = 'text';
    gMeme.selectedLineIdx++;
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0;
}

function addLine() {
    gMeme.lines.push(
        {
            txt: 'Enter text here',
            size: 40,
            align: 'center',
            textColor: '#ffffff',
            strokeColor: '#000000',
            font: 'Impact',
            x: -1000,
            y: -1000
        }
    )
    gMeme.selectedLineIdx++;
    gMeme.selectedType = 'text';
}

function calcTextBox(line) {
    if (line.align == 'start') {
        return {
            x: line.x - 10,
            y: line.y + 10,
            width: getCtx().measureText(line.txt).width + 20,
            height: -(line.size + 10)
        }
    } else if (line.align === 'end') {
        return {
            x: line.x - getCtx().measureText(line.txt).width - 10,
            y: line.y + 10,
            width: getCtx().measureText(line.txt).width + 20,
            height: -(line.size + 10)
        }
    } else {
        return {
            x: line.x - (getCtx().measureText(line.txt).width / 2) - 10,
            y: line.y + 10,
            width: getCtx().measureText(line.txt).width + 20,
            height: -(line.size + 10)
        }
    }
}

function setLineCoords(x, y) {
    getCurrLine().x = x;
    getCurrLine().y = y;
}

function setSelectedLineIdx(idx) {
    gMeme.selectedLineIdx = idx;
}

function getCurrLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function clearMeme() {
    gMeme.selectedLineIdx = 0;
    gMeme.lines = [{
        txt: 'Enter text here',
        size: 40,
        align: 'center',
        textColor: '#ffffff',
        strokeColor: '#000000',
        font: 'Impact',
        x: -1000,
        y: -1000
    }]
    gMeme.selectedStickerIdx = -1;
    gMeme.stickers = [];
}

function getMeme() {
    return gMeme;
}

function setMeme(meme) {
    gMeme = meme;
}

function getCurrImg() {
    return gImgs[gMeme.selectedImgId];
}

function setCurrImgId(id) {
    gMeme.selectedImgId = id;
}

function getImgs() {
    return gImgs;
}

function _createImg(keywords) {
    return {
        id: gImgsIdx++,
        url: `img/memes/${gImgsIdx}.jpg`,
        keywords
    }
}

function _createImgs() {
    let imgs = [];
    for (let i = 0; i < 18; i++) {
        imgs.push(_createImg(['Happy']));
    }
    return imgs;
}
