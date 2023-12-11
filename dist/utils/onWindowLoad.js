"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onWindowLoad = void 0;
const isClientSide_1 = require("./isClientSide");
let loaded = false;
function onWindowLoad() {
    return new Promise((resolve, reject) => {
        if (!(0, isClientSide_1.isClientSide)()) {
            reject();
        }
        else if (loaded) {
            resolve();
        }
        else if (['loaded', 'interactive', 'complete'].indexOf(document.readyState) > -1) {
            loaded = true;
            resolve();
        }
        else {
            window.addEventListener('load', () => {
                loaded = true;
                resolve();
            }, false);
        }
    });
}
exports.onWindowLoad = onWindowLoad;
