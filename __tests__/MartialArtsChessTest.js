const MartialArtsChess = require("../scripts/MartialArtsChess");
const assert = require("assert");

describe("MartialArtsChessTest", function() {
    describe("constructor", function() {
        it("Constructor and reset result in a proper initial game state", function() {
            let game = new MartialArtsChess([
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, 2],
                [0, -1],
            ]);
            assert.strictEqual(game.aMoves.length, 2);
        });
    });
});