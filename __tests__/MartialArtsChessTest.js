const MartialArtsChess = require("../scripts/MartialArtsChess");
const Game = require("../scripts/Game");
const assert = require("assert");

DEFAULT_MOVE_LIST_A_CANT_MOVE = [
    [[1, 0]],
    [[-1, 0]],
    [[0, 1]],
    [[0, 2]],
    [[0, -1]],
];

DEFAULT_MOVE_LIST_ALL_CAN_MOVE = [
    [[0, 1]],
    [[0, 2]],
    [[1, 1]],
    [[1, 1]],
    [[-1, 1]],
];

describe("MartialArtsChessTest", function() {
    describe("Constructor and reset result in a proper initial game state", function() {
        let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
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
        let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
        // Check that if player a only has horizontal moves, at the start they have no legal moves
        const turns = game.getMoves();
        assert.strictEqual(turns.length, 0);
        // Check that if player b has two valid vertical moves at the start, there are 10 possible turns
        game.playerTurnIndex = 1;
        assert.strictEqual(game.getMoves().length, 10);
        for (let turn of turns) {
            assert.strictEqual(/b[0-4]{1}/.test(turn[0]), true);
            assert.strictEqual(/m[0-4]{1}/.test(turn[1]), true);
            assert.strictEqual(/m[0-4]{1}/.test(turn[2]), true);
            assert.strictEqual(turn[3].length, 2);
            assert.strictEqual(turn.length, 4);
        }
    });
    describe("Moves cause expected change", () => {
        it("Moving a0 forward one", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_ALL_CAN_MOVE);
            const turns = game.getMoves();
            assert.strictEqual(game.playerTurnIndex, 0);
            assert.strictEqual(turns.length, 10);
            const turnToTake = turns[0];
            assert.strictEqual(turnToTake[0], "a0");
            game.makeMove(turns[0]);
            assert.strictEqual(game.playerTurnIndex, 1);
            // Assert that the lower left corner is empty because a0 moved
            assert.strictEqual(game.squareToSerialMap.hasOwnProperty("0,0"), false);
            assert.strictEqual(game.squareToSerialMap.hasOwnProperty("0,1"), true);
            const coordinatesOfa0 = game.aSerialToSquareMap["a0"];
            assert.strictEqual(coordinatesOfa0[0], 0);
            assert.strictEqual(coordinatesOfa0[1], 1);
            // Assert the other pieces are still where they started
            for (let i = 1; i <= 4; i++) {
                assert.strictEqual(game.squareToSerialMap.hasOwnProperty(`${i},0`), true);
            }
            for (let i = 0; i <= 4; i++) {
                assert.strictEqual(game.squareToSerialMap.hasOwnProperty(`${i},4`), true);
            }
            assert.strictEqual(game.aMoves.length, 2);
            assert.strictEqual(game.aMoves.includes("m4"), true);
            assert.strictEqual(game.aMoves.includes("m1"), true);
            assert.strictEqual(game.bMoves.length, 2);
            assert.strictEqual(game.bMoves.includes("m2"), true);
            assert.strictEqual(game.bMoves.includes("m3"), true);
        });
    });
    describe("Undoing moves is inverse of doing moves", () => {
        it("moving a0 forward one and then undoing it", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_ALL_CAN_MOVE);
            const turns = game.getMoves();
            const turnToTake = turns[0];
            assert.strictEqual(turnToTake[0], "a0");
            game.makeMove(turns[0]);
            game.unmakeMove(turns[0]);
            assert.strictEqual(turnToTake[0], "a0");
            assert.strictEqual(game.playerTurnIndex, 0);
            // Assert that the lower left corner is empty because a0 moved
            assert.strictEqual(game.squareToSerialMap.hasOwnProperty("0,0"), true);
            assert.strictEqual(game.squareToSerialMap.hasOwnProperty("0,1"), false);
            const coordinatesOfa0 = game.aSerialToSquareMap["a0"];
            assert.strictEqual(coordinatesOfa0[0], 0);
            assert.strictEqual(coordinatesOfa0[1], 0);
            // Assert the other pieces are still where they started
            for (let i = 0; i <= 4; i++) {
                assert.strictEqual(game.squareToSerialMap.hasOwnProperty(`${i},0`), true);
            }
            for (let i = 0; i <= 4; i++) {
                assert.strictEqual(game.squareToSerialMap.hasOwnProperty(`${i},4`), true);
            }
            assert.strictEqual(game.aMoves.includes("m0"), true);
            assert.strictEqual(game.aMoves.includes("m1"), true);
            assert.strictEqual(game.aMoves.length, 2);
            assert.strictEqual(game.bMoves.includes("m2"), true);
            assert.strictEqual(game.bMoves.includes("m3"), true);
            assert.strictEqual(game.bMoves.length, 2);
            assert.strictEqual(game.cMove, "m4");
        });
        it("moving twice, undoing twice, and getting the original game state", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_ALL_CAN_MOVE);
            const turns = game.getMoves();
            let turnsTaken = [];
            for (let i = 0; i < 2; i++) {
                const turns = game.getMoves();
                turnsTaken.push(turns[0]);
                game.makeMove(turns[0]);
            }
            for (let i = 0; i < 2; i++) {
                game.unmakeMove(turnsTaken[turnsTaken.length - 1]);
                turnsTaken.splice(turnsTaken.length - 1, 1);
            }
            assert.strictEqual(game.playerTurnIndex, 0);
            // Assert that the lower left corner is empty because a0 moved
            assert.strictEqual(game.squareToSerialMap.hasOwnProperty("0,0"), true);
            assert.strictEqual(game.squareToSerialMap.hasOwnProperty("0,1"), false);
            const coordinatesOfa0 = game.aSerialToSquareMap["a0"];
            assert.strictEqual(coordinatesOfa0[0], 0);
            assert.strictEqual(coordinatesOfa0[1], 0);
            // Assert the other pieces are still where they started
            for (let i = 0; i <= 4; i++) {
                assert.strictEqual(game.squareToSerialMap.hasOwnProperty(`${i},0`), true);
            }
            for (let i = 0; i <= 4; i++) {
                assert.strictEqual(game.squareToSerialMap.hasOwnProperty(`${i},4`), true);
            }
            assert.strictEqual(game.aMoves.includes("m0"), true);
            assert.strictEqual(game.aMoves.includes("m1"), true);
            assert.strictEqual(game.aMoves.length, 2);
            assert.strictEqual(game.bMoves.includes("m2"), true);
            assert.strictEqual(game.bMoves.includes("m3"), true);
            assert.strictEqual(game.bMoves.length, 2);
            assert.strictEqual(game.cMove, "m4");
        });
        it("move 10 times, undo all moves, back to original state", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_ALL_CAN_MOVE);
            const turns = game.getMoves();
            let turnsTaken = [];
            for (let i = 0; i < 10; i++) {
                const turns = game.getMoves();
                turnsTaken.push(turns[0]);
                game.makeMove(turns[0]);
            }
            for (let i = 0; i < 10; i++) {
                game.unmakeMove(turnsTaken[turnsTaken.length - 1]);
                turnsTaken.splice(turnsTaken.length - 1, 1);
            }
            assert.strictEqual(game.playerTurnIndex, 0);
            // Assert that the lower left corner is empty because a0 moved
            assert.strictEqual(game.squareToSerialMap.hasOwnProperty("0,0"), true);
            assert.strictEqual(game.squareToSerialMap.hasOwnProperty("0,1"), false);
            const coordinatesOfa0 = game.aSerialToSquareMap["a0"];
            assert.strictEqual(coordinatesOfa0[0], 0);
            assert.strictEqual(coordinatesOfa0[1], 0);
            // Assert the other pieces are still where they started
            for (let i = 0; i <= 4; i++) {
                assert.strictEqual(game.squareToSerialMap.hasOwnProperty(`${i},0`), true);
            }
            for (let i = 0; i <= 4; i++) {
                assert.strictEqual(game.squareToSerialMap.hasOwnProperty(`${i},4`), true);
            }
            assert.strictEqual(game.aMoves.includes("m0"), true);
            assert.strictEqual(game.aMoves.includes("m1"), true);
            assert.strictEqual(game.aMoves.length, 2);
            assert.strictEqual(game.bMoves.includes("m2"), true);
            assert.strictEqual(game.bMoves.includes("m3"), true);
            assert.strictEqual(game.bMoves.length, 2);
            assert.strictEqual(game.cMove, "m4");
        });
    });
    describe("reset results in game uncontaminated by previous game", () => {
        
    });
    describe("player scores", () => {
        it("scores are even at start", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
            assert.strictEqual(game.getEstimatedWinningProbability(0), 0.5);
            assert.strictEqual(game.getEstimatedWinningProbability(1), 0.5);
        });
        it("score increases as expected when guru makes progress", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
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
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
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
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
            assert.strictEqual(game.getWinningPlayerIndex(), Game.NO_WINNER_PLAYER_INDEX);
        });
        it("a guru is captured", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
            delete game.aSerialToSquareMap["a2"];
            assert.strictEqual(game.getWinningPlayerIndex(), 1);
        });
        it("b guru is captured", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
            delete game.bSerialToSquareMap["b2"];
            assert.strictEqual(game.getWinningPlayerIndex(), 0);
        });
        it("a guru is on row of b steps but not on column of b steps", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
            game.aSerialToSquareMap["a2"] = [0, 4];
            assert.strictEqual(game.getWinningPlayerIndex(), Game.NO_WINNER_PLAYER_INDEX);
        });
        it("b guru is on row of a steps but not on column of a steps", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
            game.bSerialToSquareMap["b2"] = [0, 0];
            assert.strictEqual(game.getWinningPlayerIndex(), Game.NO_WINNER_PLAYER_INDEX);
        });
        it("a guru is on b steps", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
            game.aSerialToSquareMap["a2"] = [2, 4];
            assert.strictEqual(game.getWinningPlayerIndex(), 0);
        });
        it("b guru is on a steps", () => {
            let game = new MartialArtsChess(DEFAULT_MOVE_LIST_A_CANT_MOVE);
            game.bSerialToSquareMap["b2"] = [2, 0];
            assert.strictEqual(game.getWinningPlayerIndex(), 1);
        });
    });
    describe("Calculating good moves", () => {
        it("Taking best move never loses to a random mover", () => {
            let game = new MartialArtsChess([
                [[1, -1], [-1, 1], [-2, 0]], // Rabbit
                [[-1, -1], [1, 1], [2, 0]], // Other rabbit
                [[1, 0], [0, -1], [0, 1]], // cross one
                [[-1, -1], [-1, 0], [1, 0], [1, 1]], // snake
                [[-1, 1], [1, 1], [0, -1]], // Mantis
            ]);
            game.treeSearchMaxDepth = 4;
            for (let i = 0; i < 30; i++) {
                while (!game.isGameOver()) {
                    const goodPlayerMoveAndProb = game.getBestMove();
                    game.makeMove(goodPlayerMoveAndProb[0]);
                    if (!game.isGameOver()) {
                        const eligibleMoves = game.getMoves();
                        const indexOfChosenMove = parseInt(Math.random() * eligibleMoves.length);
                        game.makeMove(eligibleMoves[indexOfChosenMove]);
                    }
                }
                assert.strictEqual(game.getWinningPlayerIndex(), 0);
            }
        });
        it("Taking best move never loses to a random mover, with random mover going first", () => {
            let game = new MartialArtsChess([
                [[1, -1], [-1, 1], [-2, 0]], // Rabbit
                [[-1, -1], [1, 1], [2, 0]], // Other rabbit
                [[1, 0], [0, -1], [0, 1]], // cross one
                [[-1, -1], [-1, 0], [1, 0], [1, 1]], // snake
                [[-1, 1], [1, 1], [0, -1]], // Mantis
            ]);
            game.treeSearchMaxDepth = 4;
            for (let i = 0; i < 30; i++) {
                while (!game.isGameOver()) {
                    const eligibleMoves = game.getMoves();
                    const indexOfChosenMove = parseInt(Math.random() * eligibleMoves.length);
                    game.makeMove(eligibleMoves[indexOfChosenMove]);
                    if (!game.isGameOver()) {
                        const goodPlayerMoveAndProb = game.getBestMove();
                        game.makeMove(goodPlayerMoveAndProb[0]);
                    }
                }
                assert.strictEqual(game.getWinningPlayerIndex(), 1);
            }
        });
        it("Deeper AI wins", () => {
            let game = new MartialArtsChess([
                [[1, -1], [-1, 1], [-2, 0]], // Rabbit
                [[-1, -1], [1, 1], [2, 0]], // Other rabbit
                [[1, 0], [0, -1], [0, 1]], // cross one
                [[-1, -1], [-1, 0], [1, 0], [1, 1]], // snake
                [[-1, 1], [1, 1], [0, -1]], // Mantis
            ]);
            for (let i = 0; i < 30; i++) {
                while (!game.isGameOver()) {
                    game.treeSearchMaxDepth = 4;
                    const goodPlayerMoveAndProb = game.getBestMove();
                    game.makeMove(goodPlayerMoveAndProb[0]);
                    if (!game.isGameOver()) {
                        game.treeSearchMaxDepth = 2;
                        const goodPlayerMoveAndProb = game.getBestMove();
                        game.makeMove(goodPlayerMoveAndProb[0]);
                    }
                }
                assert.strictEqual(game.getWinningPlayerIndex(), 0);
            }
        });
    });
});