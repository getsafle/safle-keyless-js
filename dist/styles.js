"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styles = void 0;
exports.styles = `
iframe {
    height: 770px;
    width: 360px
}

.safle_keyless-container {
  position: fixed;
  width: 360px;
  height: 770px;
  top: 10px;
  right: 0px;
  z-index: 2147483647;
}

@media (max-width: 576px) {
  .safle_keyless-container {
    bottom: 0;
    top: auto;
  }
}

.safle_keyless-widget-frame {
    position: fixed;
  width: 375px;
  height: 770px;
  top: 20px;
  right: 20px;
  box-shadow: 0 5px 40px rgba(0,0,0,.16);
  border-radius: 8px;
  overflow: scroll;
  z-index: 2147483000;
}

iframe {
    height: 770px;
    width: 360px
}

@media (max-width: 576px) {
  .safle_keyless-widget-frame {
    bottom: 0;
    top: auto;
    width: 100%;
    right: 0;
    left: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
`;
