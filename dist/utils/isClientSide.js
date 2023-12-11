"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isClientSide = void 0;
const isClientSide = () => !!(typeof window !== 'undefined' && window.document);
exports.isClientSide = isClientSide;
