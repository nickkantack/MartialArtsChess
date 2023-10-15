const MartialArtsChess = require("../scripts/MartialArtsChess");
const Game = require("../scripts/Game");
const assert = require("assert");

DEFAULT_MOVE_LIST = [
    [[1, 0]],
    [[-1, 0]],
    [[0, 1]],
    [[0, 2]],
    [[0, -1]],
];

describe("MartialArtsChessTest", function() {
    describe("Constructor and reset result in a proper initial game state", function() {
        let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
        it("Move lists", function() {
            assert.strictEqual(game.aMoves.length, 2, "aMoves has incorrect number of moves");
            assert.strictEqual(game.aMoves[0], "m0", "aMoves has incorrect move option 1");
            assert.strictEqual(game.aMoves[1], "m1", "aMoves has incorrect move option 2");
            assert.strictEqual(game.bMoves.length, 2, "bMoves has incorrect number of moves");
            assert.strictEqual(game.bMoves[0], "m2", "bMoves has incorrect move option 1");
            assert.strictEqual(game.bMoves[1], "m3", "bMoves has incorrect move option 2");
            assert.strictEqual(game.cMove, "m4", "cMove is incorrect move");
            assert.strictEqual(game.serialToRelativeMoveMap["m0"][0][0], 1, "m0 has wrong x change");
            assert.strictEqual(game.serialToRelativeMoveMap["m0"][0][1], 0, "m0 has wrong y change");
            assert.strictEqual(game.serialToRelativeMoveMap["m1"][0][0], -1, "m1 has wrong x change");
            assert.strictEqual(game.serialToRelativeMoveMap["m1"][0][1], 0, "m1 has wrong y change");
            assert.strictEqual(game.serialToRelativeMoveMap["m2"][0][0], 0, "m2 has wrong x change");
            assert.strictEqual(game.serialToRelativeMoveMap["m2"][0][1], 1, "m2 has wrong y change");
            assert.strictEqual(game.serialToRelativeMoveMap["m3"][0][0], 0, "m3 has wrong x change");
            assert.strictEqual(game.serialToRelativeMoveMap["m3"][0][1], 2, "m3 has wrong y change");
            assert.strictEqual(game.serialToRelativeMoveMap["m4"][0][0], 0, "m4 has wrong x change");
            assert.strictEqual(game.serialToRelativeMoveMap["m4"][0][1], -1, "m4 has wrong y change");
        });
        it("serial to square maps", () => {
            assert.strictEqual(Object.keys(game.aSerialToSquareMap).length, 5);
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
            assert.strictEqual(Object.keys(game.bSerialToSquareMap).length, 5);
            assert.strictEqual(game.bSerialToSquareMap["b0"][0], 0, "Piece b0 has wrong starting x coordinate");
            assert.strictEqual(game.bSerialToSquareMap["b0"][1], 4, "Piece b0 has wrong starting y coordinate");
            assert.strictEqual(game.bSerialToSquareMap["b1"][0], 1, "Piece b1 has wrong starting x coordinate");
            assert.strictEqual(game.bSerialToSquareMap["b1"][1], 4, "Piece b1 has wrong starting y coordinate");
            assert.strictEqual(game.bSerialToSquareMap["b2"][0], 2, "Piece b2 has wrong starting x coordinate");
            assert.strictEqual(game.bSerialToSquareMap["b2"][1], 4, "Piece b2 has wrong starting y coordinate");
            assert.strictEqual(game.bSerialToSquareMap["b3"][0], 3, "Piece b3 has wrong starting x coordinate");
            assert.strictEqual(game.bSerialToSquareMap["b3"][1], 4, "Piece b3 has wrong starting y coordinate");
            assert.strictEqual(game.bSerialToSquareMap["b4"][0], 4, "Piece b4 has wrong starting x coordinate");
            assert.strictEqual(game.bSerialToSquareMap["b4"][1], 4, "Piece b4 has wrong starting y coordinate");
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
        it ("player turn tracking", () => {
            assert.strictEqual(game.playerTurnIndex, 0);
        });
    });
    describe("Turn list is as expected", () => {
        let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
        // Check that if player a only has horizontal moves, at the start they have no legal moves
        assert.strictEqual(game.getMoves().length, 0);
        // Check that if player b has two valid vertical moves at the start, there are 10 possible turns
        game.playerTurnIndex = 1;
        assert.strictEqual(game.getMoves().length, 10);
    });
    describe("Moves cause expected change", () => {
        
    });
    describe("Undoing moves is inverse of doing moves", () => {

    });
    describe("reset results in game uncontaminated by previous game", () => {
        
    });
    describe("player scores", () => {
        it("scores are even at start", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
            assert.strictEqual(game.getEstimatedWinningProbability(0), 0.5);
            assert.strictEqual(game.getEstimatedWinningProbability(1), 0.5);
        });
        it("score increases as expected when guru makes progress", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
            game.aSerialToSquareMap["a0"] = [0, 1];
            assert.strictEqual(game.getEstimatedWinningProbability(0), 0.5);
            assert.strictEqual(game.getEstimatedWinningProbability(1), 0.5);
            game.aSerialToSquareMap["a2"] = [0, 1];
            assert.strictEqual(game.getEstimatedWinningProbability(0), (5 * 3 + 1) / (5 * 3 + 1 + 5 * 3));
            assert.strictEqual(game.getEstimatedWinningProbability(1), 5 * 3 / (5 * 3 + 5 * 3 + 1));
            game.bSerialToSquareMap["b2"] = [0, 3];
            assert.strictEqual(game.getEstimatedWinningProbability(0), 0.5);
            assert.strictEqual(game.getEstimatedWinningProbability(1), 0.5);
        });
        it("score decreases as expected when pieces are lost", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
            delete game.aSerialToSquareMap["a0"];
            assert.strictEqual(game.getEstimatedWinningProbability(0), 4 * 3 / (4 * 3 + 5 * 3));
            assert.strictEqual(game.getEstimatedWinningProbability(1), 5 * 3 / (4 * 3 + 5 * 3));
            delete game.bSerialToSquareMap["b0"];
            delete game.bSerialToSquareMap["b1"];
            assert.strictEqual(game.getEstimatedWinningProbability(0), 4 * 3 / (4 * 3 + 3 * 3));
            assert.strictEqual(game.getEstimatedWinningProbability(1), 3 * 3 / (4 * 3 + 3 * 3));
        });
    });
    describe("win conditions", () => {
        it("start of the game has no winner", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
            assert.strictEqual(game.getWinningPlayerIndex(), Game.NO_WINNER_PLAYER_INDEX);
        });
        it("a guru is captured", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
            delete game.aSerialToSquareMap["a2"];
            assert.strictEqual(game.getWinningPlayerIndex(), 1);
        });
        it("b guru is captured", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
            delete game.bSerialToSquareMap["b2"];
            assert.strictEqual(game.getWinningPlayerIndex(), 0);
        });
        it("a guru is on row of b steps but not on column of b steps", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
            game.aSerialToSquareMap["a2"] = [0, 4];
            assert.strictEqual(game.getWinningPlayerIndex(), Game.NO_WINNER_PLAYER_INDEX);
        });
        it("b guru is on row of a steps but not on column of a steps", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
            game.bSerialToSquareMap["b2"] = [0, 0];
            assert.strictEqual(game.getWinningPlayerIndex(), Game.NO_WINNER_PLAYER_INDEX);
        });
        it("a guru is on b steps", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
            game.aSerialToSquareMap["a2"] = [2, 4];
            assert.strictEqual(game.getWinningPlayerIndex(), 0);
        });
        it("b guru is on a steps", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST);
            game.bSerialToSquareMap["b2"] = [2, 0];
            assert.strictEqual(game.getWinningPlayerIndex(), 1);
        });
    });
});