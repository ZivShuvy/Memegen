'use strict'
const IMGS_KEY = 'imgDB';
const IMGS_IDX_KEY = 'nextImgIdx';
let gKeywords = {
    'all': 10, 'funny': 4, 'politics': 1, 'animal': 3, 'happy': 6, 'comic': 2,
    'smile': 1, 'baby': 1, 'sleep': 1, 'tv': 2, 'surprise': 1, 'cunning': 1, 'men': 5, 'sport': 3
}
let gImgsIdx;
let gLineId = 0;
let gImgs;
let gIsDrag = false;

let gMeme = {
    selectedImgId: 0,
    selectedType: 'text',
    selectedLineIdx: 0,
    lines: [],
    selectedStickerIdx: -1,
    stickers: []
}

const stickersCount = 8;
let PAGE_SIZE = 4;
let gPageIdx = 0;


init();

function init() {
    _createImgsIdx();
    _createImgs();
    if(window.innerWidth < 700) {
        PAGE_SIZE = 2;
    }
}


function getPageSize() {
    return PAGE_SIZE;
}

function setNextPage(diff){
    if (gPageIdx + diff >= getNumOfPages() || gPageIdx + diff < 0) return
    gPageIdx += diff
}

function getNumOfPages() {
    return Math.ceil(stickersCount / PAGE_SIZE);
}


function getCirlclePos(currSticker) {
    return { x: currSticker.x + currSticker.width, y: currSticker.y + currSticker.height }
}

function isCircleClicked(clickedPos) {
    if(gMeme.stickers[gMeme.selectedStickerIdx]) {
        let { x, y } = getCirlclePos(gMeme.stickers[gMeme.selectedStickerIdx]);
        x+=10;
        const distance = Math.sqrt((x - clickedPos.x) ** 2 + (y - clickedPos.y) ** 2)
        return distance <= 15;
    }
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

function getKeyWords() {
    return gKeywords;
}

function addCustomImg(img) {
    const customImg = { id: gImgsIdx++, url: img.src, keywords: [''] };
    gImgs.push(customImg);
    _saveImgsToStorage();
    _saveImgsIdxToStorage();
    renderImgs();
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

function _createImgsIdx() {
    gImgsIdx = loadFromStorage(IMGS_IDX_KEY);
    if (!gImgsIdx) {
        gImgsIdx = 0;
        _saveImgsIdxToStorage();
    }
}

function _createImgs() {
    gImgs = loadFromStorage(IMGS_KEY);
    if (!gImgs || !gImgs.length) {
        gImgs = [];
        gImgs.push(_createImg(['funny', 'politics']));
        gImgs.push(_createImg(['animal', 'happy']));
        gImgs.push(_createImg(['animal', 'comic', 'smile', 'baby']));
        gImgs.push(_createImg(['animal', 'sleep', 'funny']));
        gImgs.push(_createImg(['baby', 'happy']));
        gImgs.push(_createImg(['tv']));
        gImgs.push(_createImg(['baby', 'surprise', 'funny']));
        gImgs.push(_createImg(['men', 'happy']));
        gImgs.push(_createImg(['baby', 'cunning']));
        gImgs.push(_createImg(['happy', 'funny', 'politics']));
        gImgs.push(_createImg(['sport', 'men']));
        gImgs.push(_createImg(['cunning', 'men', 'surprise']));
        gImgs.push(_createImg(['tv', 'happy', 'men']));
        gImgs.push(_createImg(['tv', 'surprise']));
        gImgs.push(_createImg(['men']));
        gImgs.push(_createImg(['men', 'happy', 'funny', 'comic']));
        gImgs.push(_createImg(['politics']));
        gImgs.push(_createImg(['tv']));
        _saveImgsToStorage();
        _saveImgsIdxToStorage();
    }
}

function _saveImgsIdxToStorage() {
    saveToStorage(IMGS_IDX_KEY, gImgsIdx);
}

function _saveImgsToStorage() {
    saveToStorage(IMGS_KEY, gImgs);
}





