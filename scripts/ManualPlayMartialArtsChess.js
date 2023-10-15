const MartialArtsChess = require("./MartialArtsChess");
const Game = require("./Game");

const prompt = require('prompt-sync')();

let game = new MartialArtsChess([
    [[1, -1], [-1, 1], [-2, 0]], // Rabbit, m0
    [[-1, -1], [1, 1], [2, 0]], // Other rabbit, m1
    [[1, 0], [0, -1], [0, 1]], // cross one, m2
    [[-1, -1], [-1, 0], [1, 0], [1, 1]], // snake, m3
    [[-1, 1], [1, 1], [0, -1]], // Mantis, m4
]);

game.treeSearchMaxDepth = 6;

while (!game.isGameOver()) {

    // Take the user's input move
    console.log("\n");
    console.log("Here is the game board:\n");
    for (let y = 4; y >= 0; y--) {
        let row = "";
        for (let x = 0; x <= 4; x++) {
            if (game.squareToSerialMap[`${x},${y}`]) row += game.squareToSerialMap[`${x},${y}`]; else row += "--";
            if (x < 4) row += " ";
        }
        console.log(row);
    }

    console.log(`\n\nYou have moves ${game.aMoves}, opponent has moves ${game.bMoves}, and cMove is ${game.cMove}`);

    console.log("\nYou can make these moves");
    const allowedMoves = game.getMoves();
    for (let i = 0; i < allowedMoves.length; i++) {
        console.log(`${i}) ${allowedMoves[i]}`);
    }

    let validInputReceived = false;
    while (!validInputReceived) {
        let userIn = prompt("Enter the index of the move to make.\n");
        userIn.replace(/\n/, "");
        if (!isNaN(userIn) && !isNaN(parseInt(userIn))) {
            validInputReceived = true;
            if (parseInt(userIn) < 0) {
                game.makeMove(game.getBestMove()[0]);
            } else {
                game.makeMove(allowedMoves[parseInt(userIn)]);
            }
        } else {
            console.error("Invalid input. Try again.");
        }
    }

    if (!game.isGameOver()) {
        const aiMoveAndProb = game.getBestMove();
        console.log(`The AI made the move ${aiMoveAndProb[0]}`);
        game.makeMove(aiMoveAndProb[0]);
    }

}
