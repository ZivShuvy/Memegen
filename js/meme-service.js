'use strict'
let gKeywords = { 'happy': 12, 'funny puk': 1 }
let gImgsIdx = 0;
let gLineId = 0;
let gImgs = _createImgs();


let gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: []
}

function setAilment(ailment) {
    gMeme.lines[gMeme.selectedLineIdx].align = ailment;
}

function changeFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function removeLine() {
    if (gMeme.lines.length === 0) return;
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx--;
}

function nextLine() {
    gMeme.selectedLineIdx++;
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0;
}

function addLine() {
    gMeme.lines.push(
        {
            txt: 'Enter text here',
            size: 40,
            align: 'center',
            color: 'white',
            font: 'Impact',
            x: -1000,
            y: -1000
        }
    )
    gMeme.selectedLineIdx++;
}


function setLineCoords(x, y) {
    gMeme.lines[gMeme.selectedLineIdx].x = x;
    gMeme.lines[gMeme.selectedLineIdx].y = y;
}

function clearLines() {
    gMeme.selectedLineIdx = 0;
    gMeme.lines = [{
        txt: 'Enter text here',
        size: 40,
        align: 'center',
        color: 'white',
        font: 'Impact',
        x: -1000,
        y: -1000
    }]
}

function getMeme() {
    return gMeme;
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
