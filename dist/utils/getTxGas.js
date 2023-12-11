"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTxGas = void 0;
const { addHexPrefix, stripHexPrefix, BN } = require('ethereumjs-util');
const SIMPLE_GAS_COST = '0x5208'; // Hex for 21000, cost of a simple send.
function getTxGas(query, txParams) {
    return __awaiter(this, void 0, void 0, function* () {
        const block = yield query.getBlockByNumber('latest', false);
        const { safeGas, simpleSend, gasLimitSpecified } = yield safeTxGas(query, txParams, block.gasLimit);
        if (simpleSend || gasLimitSpecified) {
            return safeGas;
        }
        try {
            const gas = yield estimateTxGas(query, txParams, block.gasLimit, safeGas);
            return gas;
        }
        catch (error) {
            return safeGas;
        }
    });
}
exports.getTxGas = getTxGas;
function safeTxGas(query, txParams, blockGasLimitHex) {
    return __awaiter(this, void 0, void 0, function* () {
        // check if gasLimit is already specified
        const gasLimitSpecified = Boolean(txParams.gas);
        // if it is, use that value
        if (gasLimitSpecified) {
            return { safeGas: txParams.gas, simpleSend: false, gasLimitSpecified: true };
        }
        const recipient = txParams.to;
        const hasRecipient = Boolean(recipient);
        // see if we can set the gas based on the recipient
        if (hasRecipient) {
            const code = yield query.getCode(recipient);
            // For an address with no code, geth will return '0x', and ganache-core v2.2.1 will return '0x0'
            const codeIsEmpty = !code || code === '0x' || code === '0x0';
            if (codeIsEmpty) {
                // if there's data in the params, but there's no contract code, it's not a valid transaction
                if (txParams.data) {
                    const err = new Error('Trying to call a function on a non-contract address');
                    throw err;
                }
                // This is a standard ether simple send, gas requirement is exactly 21k
                return { safeGas: SIMPLE_GAS_COST, simpleSend: true, gasLimitSpecified: false };
            }
        }
        // fallback to block gasLimit
        const blockGasLimitBN = hexToBn(blockGasLimitHex);
        const saferGasLimitBN = BnMultiplyByFraction(blockGasLimitBN, 19, 20);
        return { safeGas: bnToHex(saferGasLimitBN), simpleSend: false, gasLimitSpecified: false };
    });
}
function estimateTxGas(query, txParams, blockGasLimitHex, safeGas) {
    return __awaiter(this, void 0, void 0, function* () {
        txParams.gas = safeGas;
        const estimatedGas = addHexPrefix(yield query.estimateGas(txParams));
        return addGasBuffer(estimatedGas, blockGasLimitHex);
    });
}
function addGasBuffer(initialGasLimitHex, blockGasLimitHex) {
    const initialGasLimitBn = hexToBn(initialGasLimitHex);
    const blockGasLimitBn = hexToBn(blockGasLimitHex);
    const upperGasLimitBn = blockGasLimitBn.muln(0.9);
    const bufferedGasLimitBn = initialGasLimitBn.muln(1.5);
    // if initialGasLimit is above blockGasLimit, dont modify it
    if (initialGasLimitBn.gt(upperGasLimitBn))
        return bnToHex(initialGasLimitBn);
    // if bufferedGasLimit is below blockGasLimit, use bufferedGasLimit
    if (bufferedGasLimitBn.lt(upperGasLimitBn))
        return bnToHex(bufferedGasLimitBn);
    // otherwise use blockGasLimit
    return bnToHex(upperGasLimitBn);
}
function hexToBn(inputHex) {
    return new BN(stripHexPrefix(inputHex), 16);
}
function bnToHex(inputBn) {
    return addHexPrefix(inputBn.toString(16));
}
function BnMultiplyByFraction(targetBN, numerator, denominator) {
    const numBN = new BN(numerator);
    const denomBN = new BN(denominator);
    return targetBN.mul(numBN).div(denomBN);
}
