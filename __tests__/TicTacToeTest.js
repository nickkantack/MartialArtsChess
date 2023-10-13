const TicTacToe = require("../scripts/TicTacToe");
const Game = require("../scripts/Game");
const assert = require("assert");

let game = new TicTacToe();

describe("TicTacToeTest", function() {
    describe("numberOfPlayers", function() {
        it("Tic tac toe is a two player game", function() {
            assert.strictEqual(game.numberOfPlayers, 2);
        });
    });
    describe("getBoardAsString", function() {
        it("Initialized board looks right", function() {
            assert.strictEqual(game.getBoardAsString().match(/_/g).length, game.dimension * game.dimension);
        })
    })
    describe('makeMoveByIndex', function() {
        it("negative row", function() {
            assert.throws(() => { game.makeMove("-1" + TicTacToe.MOVE_DELIMITER + "0") }, Error);
        });
        it("row too big", function() {
            assert.throws(() => { game.makeMove(game.dimension + TicTacToe.MOVE_DELIMITER + "0") }, Error);
        });
        it("negative column", function() {
            assert.throws(() => { game.makeMove("0" + TicTacToe.MOVE_DELIMITER + "-1") }, Error);
        });
        it("column too big", function() {
            assert.throws(() => { game.makeMove("0" + TicTacToe.MOVE_DELIMITER + game.dimension) }, Error);
        });
    });
    describe('makeMove', function() {
        it('cannot play over an existing mark', function() {
            let testGame = new TicTacToe();
            testGame.makeMove("1,1");
            assert.throws(() => {
                testGame.makeMove("1" + TicTacToe.MOVE_DELIMITER + "1")
            }, Error);
        });
        it('all possible plays land on the board where intended', function() {
            let testGame = new TicTacToe();
            let playerIndex = 0;
            for (let row = 0; row < testGame.dimension; row++) {
                for (let col = 0; col < testGame.dimension; col++) {
                    assert.strictEqual(testGame.board[row][col], TicTacToe.DEFAULT_SQUARE_VALUE);
                    testGame.makeMove(row + "," + col);
                    assert.strictEqual(testGame.board[row][col], playerIndex);
                    playerIndex = 1 - playerIndex;
                }
            }
        });
    });
    describe('GET_MOVE_AS_STRING', function() {
        it('test case', function() {
           assert.strictEqual(TicTacToe.GET_MOVE_AS_STRING(0, 0), "0" + TicTacToe.MOVE_DELIMITER + "0");
        });
        it('test case', function() {
            assert.strictEqual(TicTacToe.GET_MOVE_AS_STRING(3, 2), "3" + TicTacToe.MOVE_DELIMITER + "2");
        });
        it('test case', function() {
            assert.strictEqual(TicTacToe.GET_MOVE_AS_STRING(1, -1), "1" + TicTacToe.MOVE_DELIMITER + "-1");
        });
    });
    describe('getMoves', function() {
        it('early game', function() {
            let testGame = new TicTacToe();
            let testMove = TicTacToe.GET_MOVE_AS_STRING(1, 1);
            assert.strictEqual(testGame.getMoves().length, testGame.dimension * testGame.dimension);
            assert(testGame.getMoves().includes(testMove));
            testGame.makeMove(testMove);
            assert.strictEqual(testGame.getMoves().length, testGame.dimension * testGame.dimension - 1);
            assert(!testGame.getMoves().includes(testMove));
        });
        it('play out entire game', function() {
           let testGame = new TicTacToe();
           let dimSquared = testGame.dimension * testGame.dimension;
           for (let i = 0; i < dimSquared; i++) {
               assert.strictEqual(testGame.getMoves().length,  dimSquared - i);
               testGame.makeMove(testGame.getMoves()[0]);
           }
           assert.strictEqual(testGame.getMoves().length, 0);
        });
    });
    describe('foundThreeInARow', function() {
        it('test case', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 2));
            assert.strictEqual(testGame.foundThreeInARow(0, 0, 0, 1), 0);
            assert.strictEqual(testGame.foundThreeInARow(0, 0, 1, 0), TicTacToe.NO_WINNER_PLAYER_INDEX);
        })
    });
    describe('getWinningPlayerIndex', function() {
        it('win case 1', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 2));
            assert.strictEqual(testGame.getWinningPlayerIndex(), 0);
        });
        it('win case 2', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 2));
            assert.strictEqual(testGame.getWinningPlayerIndex(), 1);
        });
        it('win case 3', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 2));
            assert.strictEqual(testGame.getWinningPlayerIndex(), 0);
        });
        it('win case 4', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 0));
            assert.strictEqual(testGame.getWinningPlayerIndex(), 0);
        });
        it('win case 5', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 2));
            assert.strictEqual(testGame.getWinningPlayerIndex(), 0);
        });
        it('win case 6', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 1));
            assert.strictEqual(testGame.getWinningPlayerIndex(), 1);
        });
        it('win case 7', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 2));
            assert.strictEqual(testGame.getWinningPlayerIndex(), 0);
        });
        it('win case 8', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 0));
            assert.strictEqual(testGame.getWinningPlayerIndex(), 1);
        });
        it('game incomplete', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            assert.strictEqual(testGame.getWinningPlayerIndex(), TicTacToe.NO_WINNER_PLAYER_INDEX);
        });
        it('stalemate', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 2));
            assert.strictEqual(testGame.getWinningPlayerIndex(), TicTacToe.NO_WINNER_PLAYER_INDEX);
        });
    });
    describe('isGameOver', function () {
        it('game won', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 2));
            assert.strictEqual(testGame.isGameOver(), true);
        });
        it('game won 2', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 0));
            assert.strictEqual(testGame.isGameOver(), true);
        });
        it('game not over', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            assert.strictEqual(testGame.isGameOver(), false);
        });
        it('stalemate', function() {
            let testGame = new TicTacToe();
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 0));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(0, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 1));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(1, 2));
            testGame.makeMove(TicTacToe.GET_MOVE_AS_STRING(2, 2));
            assert(testGame.isGameOver());
        });
    });
    describe('AI plays optimally', function() {
       it('many games with random start', function() {
           for (let i = 0; i < 30; i++) {
               let testGame = new TicTacToe();
               testGame.setTreeSearchMaxDepth(6);
               // First play random
               let startingMoves = testGame.getMoves();
               testGame.makeMove(startingMoves[parseInt(Math.random() * startingMoves.length)]);
               while (!testGame.isGameOver()) {
                   let bestMoveString = testGame.getBestMove()[0];
                   testGame.makeMove(testGame.getBestMove()[0]);
               }
               assert.strictEqual(testGame.getWinningPlayerIndex(), Game.NO_WINNER_PLAYER_INDEX);
           }
       });
       it('random play never beats AI', function() {
           for (let i = 0; i < 30; i++) {
               let testGame = new TicTacToe();
               testGame.setTreeSearchMaxDepth(6);
               // First play random
               let startingMoves = testGame.getMoves();
               testGame.makeMove(startingMoves[parseInt(Math.random() * startingMoves.length)]);
               while (!testGame.isGameOver()) {
                   if (testGame.playerTurnIndex === 0) {
                       let moves = testGame.getMoves();
                       testGame.makeMove(moves[parseInt(Math.random() * moves.length)]);
                   } else {
                       testGame.makeMove(testGame.getBestMove()[0]);
                   }
               }
               assert.notStrictEqual(testGame.getWinningPlayerIndex(), 0);
           }
       });
    });
});