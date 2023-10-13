const MartialArtsChess = require("../scripts/MartialArtsChess");
const assert = require("assert");

describe("MartialArtsChessTest", function() {
    describe("Constructor and reset result in a proper initial game state", function() {
        let game = new MartialArtsChess([
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, 2],
            [0, -1],
        ]);
        it("Move lists", function() {
            assert.strictEqual(game.aMoves.length, 2, "aMoves has incorrect number of moves");
            assert.strictEqual(game.aMoves[0], "m0", "aMoves has incorrect move option 1");
            assert.strictEqual(game.aMoves[1], "m1", "aMoves has incorrect move option 2");
            assert.strictEqual(game.bMoves.length, 2, "bMoves has incorrect number of moves");
            assert.strictEqual(game.bMoves[0], "m2", "bMoves has incorrect move option 1");
            assert.strictEqual(game.bMoves[1], "m3", "bMoves has incorrect move option 2");
            assert.strictEqual(game.cMove, "m4", "cMove is incorrect move");
            assert.strictEqual(game.serialToRelativeMoveMap["m0"][0], 1, "m0 has wrong x change");
            assert.strictEqual(game.serialToRelativeMoveMap["m0"][1], 0, "m0 has wrong y change");
            assert.strictEqual(game.serialToRelativeMoveMap["m1"][0], -1, "m1 has wrong x change");
            assert.strictEqual(game.serialToRelativeMoveMap["m1"][1], 0, "m1 has wrong y change");
            assert.strictEqual(game.serialToRelativeMoveMap["m2"][0], 0, "m2 has wrong x change");
            assert.strictEqual(game.serialToRelativeMoveMap["m2"][1], 1, "m2 has wrong y change");
            assert.strictEqual(game.serialToRelativeMoveMap["m3"][0], 0, "m3 has wrong x change");
            assert.strictEqual(game.serialToRelativeMoveMap["m3"][1], 2, "m3 has wrong y change");
            assert.strictEqual(game.serialToRelativeMoveMap["m4"][0], 0, "m4 has wrong x change");
            assert.strictEqual(game.serialToRelativeMoveMap["m4"][1], -1, "m4 has wrong y change");
        });
        it("serial to square maps", () => {
            assert.strictEqual(game.aSerialToSquareMap["a0"][0], 0, "Piece a0 has wrong starting x coordinate");
            assert.strictEqual(game.aSerialToSquareMap["a0"][1], 0, "Piece a0 has wrong starting y coordinate");
            assert.strictEqual(game.aSerialToSquareMap["a1"][0], 1, "Piece a1 has wrong starting x coordinate");
            assert.strictEqual(game.aSerialToSquareMap["a1"][1], 0, "Piece a1 has wrong starting y coordinate");
            assert.strictEqual(game.aSerialToSquareMap["a2"][0], 2, "Piece a2 has wrong starting x coordinate");
            assert.strictEqual(game.aSerialToSquareMap["a2"][1], 0, "Piece a2 has wrong starting y coordinate");
            assert.strictEqual(game.aSerialToSquareMap["a3"][0], 3, "Piece a3 has wrong starting x coordinate");
            assert.strictEqual(game.aSerialToSquareMap["a3"][1], 0, "Piece a3 has wrong starting y coordinate");
            assert.strictEqual(game.aSerialToSquareMap["a4"][0], 4, "Piece a4 has wrong starting x coordinate");
            assert.strictEqual(game.aSerialToSquareMap["a4"][1], 0, "Piece a4 has wrong starting y coordinate");
            // b too
            assert.strictEqual(game.aSerialToSquareMap["b0"][0], 0, "Piece b0 has wrong starting x coordinate");
            assert.strictEqual(game.aSerialToSquareMap["b0"][1], 4, "Piece b0 has wrong starting y coordinate");
            assert.strictEqual(game.aSerialToSquareMap["b1"][0], 1, "Piece b1 has wrong starting x coordinate");
            assert.strictEqual(game.aSerialToSquareMap["b1"][1], 4, "Piece b1 has wrong starting y coordinate");
            assert.strictEqual(game.aSerialToSquareMap["b2"][0], 2, "Piece b2 has wrong starting x coordinate");
            assert.strictEqual(game.aSerialToSquareMap["b2"][1], 4, "Piece b2 has wrong starting y coordinate");
            assert.strictEqual(game.aSerialToSquareMap["b3"][0], 3, "Piece b3 has wrong starting x coordinate");
            assert.strictEqual(game.aSerialToSquareMap["b3"][1], 4, "Piece b3 has wrong starting y coordinate");
            assert.strictEqual(game.aSerialToSquareMap["b4"][0], 4, "Piece b4 has wrong starting x coordinate");
            assert.strictEqual(game.aSerialToSquareMap["b4"][1], 4, "Piece b4 has wrong starting y coordinate");
        });
        it ("square to serial map", () => {
            assert.strictEqual(game.squareToSerialMap["0,0"], "a0");
            assert.strictEqual(game.squareToSerialMap["1,0"], "a1");
            assert.strictEqual(game.squareToSerialMap["2,0"], "a2");
            assert.strictEqual(game.squareToSerialMap["3,0"], "a3");
            assert.strictEqual(game.squareToSerialMap["4,0"], "a4");
            assert.strictEqual(game.squareToSerialMap["0,4"], "b0");
            assert.strictEqual(game.squareToSerialMap["1,4"], "b1");
            assert.strictEqual(game.squareToSerialMap["2,4"], "b2");
            assert.strictEqual(game.squareToSerialMap["3,4"], "b3");
            assert.strictEqual(game.squareToSerialMap["4,4"], "b4");
        });
    });
    describe("Moves cause expected change", () => {
        
    });
    describe("Undoing moves is inverse of doing moves", () => {

    });
    describe("reset results in game uncontaminated by previous game", () => {
        
    });
});