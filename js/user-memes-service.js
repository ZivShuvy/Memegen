const MEMES_KEY = 'userMemesDB';
const ID_KEY = 'nextMemeIdx';
let gUserMemes = loadFromStorage(MEMES_KEY);
let gNextMemeIdx = loadFromStorage(ID_KEY);

if (!gUserMemes) {
    gUserMemes = [];
}

if (!gNextMemeIdx) {
    gNextMemeIdx = 0;
}


function addUserMeme(dataUrl, memeId) {
    if (memeId === -1) {
        gUserMemes.push({
            id: gNextMemeIdx++,
            url: dataUrl,
            memeData: JSON.parse(JSON.stringify(getMeme()))
        });
    } else {
        const currMeme = getMemeById(memeId);
        currMeme.url = dataUrl;
        currMeme.memeData = JSON.parse(JSON.stringify(getMeme()));
    }
    _saveMemesToStorage();
    _saveIdToStorage();
}

function loadMemes() {
    gUserMemes = loadFromStorage(MEMES_KEY);
}

function getMemeById(id) {
    return gUserMemes.find(meme => id === meme.id)
}

function getUserMemesUrls() {
    return gUserMemes;
}

function _saveIdToStorage() {
    saveToStorage(ID_KEY, gNextMemeIdx);
}

function _saveMemesToStorage() {
    saveToStorage(MEMES_KEY, gUserMemes);
}
