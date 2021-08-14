'use strict';

function saveToStorage(key, val) {
    try {
    localStorage.setItem(key, JSON.stringify(val))
    }
    catch (e) {
        console.log("Local Storage is full, Please empty data");
    }
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}