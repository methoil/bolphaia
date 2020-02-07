"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var playerIds;
(function (playerIds) {
    playerIds["phrygians"] = "phrygians";
    playerIds["hitites"] = "hitites";
})(playerIds = exports.playerIds || (exports.playerIds = {}));
var pieceTypes;
(function (pieceTypes) {
    pieceTypes["levy"] = "levy";
    pieceTypes["archer"] = "archer";
    pieceTypes["cataphract"] = "cataphract";
    pieceTypes["hoplite"] = "hoplite";
})(pieceTypes = exports.pieceTypes || (exports.pieceTypes = {}));
exports.pieceDefs = [
    {
        pieceId: 'levy',
        maxHealth: 2,
    },
    {
        pieceId: 'archer',
        maxHealth: 2,
    },
    {
        pieceId: 'hoplite',
        maxHealth: 8,
    },
    {
        pieceId: 'cataphract',
        maxHealth: 10,
    },
];
