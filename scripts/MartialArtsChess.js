
try {
    Game = require("./Game");
} catch { /* This means we are in the browser. No need to make a fuss about this catch */ }

class MartialArtsChess extends Game {

    /*
    COORDINATES
    Coordinates are order pairs of integers between 0 and 4 inclusively where 0,0 is the lower left square
    from player a's perspective and 4,4 is the lower left square from player b's perspective. Relative
    changes in x are positive when moving to the right of the board from player a's perspective and changes
    in y are positive when moving towards player b from player a's perspective.
    */

    /*
    PIECE SERIAL NUMBERS
    Each piece has a serial number which begins with either "a" or "b" (depending on which player owns the
    piece) and followed by an integer between 0 and 1 inclusively indicating the x coordinate of the piece
    at the start of the game. Therefore, "a2" corresponds to the guru for player a and it starts on square
    [2, 0] and "b2" corresponds to guru for player b and it starts on square [2, 4].
    */
    
    /*
    A "move" is an array of two sub arrays with the following structure:
    [[xIndexOfMovingPieceBeforeMove, yIndexOfMovingPieceBeforeMove], [xIndexOfMovingPieceAfterMove, yIndexOfMovingPieceAfterMove]]
    a move describes a motion of a piece across the board. It is the contextualization of a "relative move"
    to a particular place on the board.
    */

    /*
    A "relative move" is an array of two elements:
    [relativeChangeInXCoordinate, relativeChangeInYCoordinate]
    An "attack" card contains a list of "relative moves" which describes how a piece's position can change.
    Relative moves are serialized with serial numbers that are m0, m1, m2, m3, or m4.
    */

    /*
    A "turn" consists of an array of three serial numbers of the following structure
    [serialNumberOfPieceMakingMove, serialNumberOfRelativeMove, serialNumberOfCMove, relativeMove, serialNumberOfPieceCaptured, or null if no piece was captured]
    and example would be ["a2", "m2", "m1", [0, 1], null] (no piece was captured), and ["b3", "m1", "m2", [0, 1], "a1"] where piece
    "a1" was captured.
    */

    /*
    This has keys that are serial numbers of a pieces (e.g. "a3") and values that are arrays of the form
    [xCoordinateOfPiece, yCoordinateOfPiece].
    */
    aSerialToSquareMap = {};

    /*
    This has keys that are serial numbers of b pieces (e.g. "b3") and values that are arrays of the form
    [xCoordinateOfPiece, yCoordinateOfPiece].
    */
    bSerialToSquareMap = {};

    /*
    This has keys that are comma separated integers between 0 and 4 inclusively (e.g. "3,2") referring to
    squares on the board and values that are serial numbers of pieces present at those squares.
    */
    squareToSerialMap = {};

    /*
    This has keys that are the serial numbers of moves (i.e. m0, m1, m2, m3, or m4) and values that are
    arrays of "relative moves".
    */
    serialToRelativeMoveMap = {};

    /*
    This array has elements which are serial numbers of relative moves that player a currently holds.
    */
    aMoves = [];

    /*
    This array has elements which are serial numbers of relative moves that player b currently holds.
    */
    bMoves = [];

    /*
    This variable is the serial number of the one move that neither player currently holds.
    */
    cMove = null;

    moveArrayForGameInstantiation = null;

    constructor (relativeMoves) {
        super();
        this.moveArrayForGameInstantiation = relativeMoves;
        this.reset(relativeMoves);
    }

    reset(relativeMoves) {
        this.aSerialToSquareMap = {};
        this.squareToSerialMap = {};
        for (let i = 0; i <= 4; i++) {
            this.aSerialToSquareMap[`a${i}`] = [i, 0];
            this.squareToSerialMap[`${i},0`] = `a${i}`;
        }
        this.bSerialToSquareMap = {};
        for (let i = 0; i <= 4; i++) {
            this.bSerialToSquareMap[`b${i}`] = [i, 4];
            this.squareToSerialMap[`${i},4`] = `b${i}`;
        }
        if (!relativeMoves) throw new Error("You must pass a list of relative moves to the constructor.");
        if (relativeMoves.length !== 5) {
            throw new Error(`Called reset with ${relativeMoves.length} moves, but expected 5.`);
        }
        this.serialToRelativeMoveMap = {};
        for (let i = 0; i <= 4; i++) {
            for (let j = 0; j < relativeMoves[i].length; j++) {
                if (relativeMoves[i][j].length !== 2) throw new Error(`Relative move ${i} given to reset was ${relativeMoves[i][j]} but this does not have a length of two, it has a length if ${relativeMoves[i][j].length}`);

            }
            this.serialToRelativeMoveMap[`m${i}`] = relativeMoves[i];
        }
        this.aMoves = ["m0", "m1"];
        this.bMoves = ["m2", "m3"];
        this.cMove = "m4";
        this.playerTurnIndex = 0; // 0 corresponds to player "a", whereas 1 corresponds to player "b"
    }

    /**
     * Consider caching possible moves in the derived class if calculating possible moves is computationally expensive.
     * Also, if this returns an empty list, the game will be presumed over.
     *
     * @returns a list of moves which are valid arguments for {@link makeMove}
     */
    getMoves() {
        let playerLetter = this.playerTurnIndex ? "b" : "a";
        let playerSerialToSquareMap = this.playerTurnIndex ? this.bSerialToSquareMap : this.aSerialToSquareMap;
        let reflectionMultiplier = playerLetter === "b" ? -1 : 1; // Handle 180 degree rotation between player perspectives
        let playerMoves = this.playerTurnIndex ? this.bMoves : this.aMoves;
        let movesToReturn = [];
        for (let pieceSerial of Object.keys(playerSerialToSquareMap)) {
            const originatingSquare = playerSerialToSquareMap[pieceSerial];
            for (let move of playerMoves) {
                for (let relativeMove of this.serialToRelativeMoveMap[move]) {
                    const destinationSquare = [originatingSquare[0] + reflectionMultiplier * relativeMove[0], originatingSquare[1] + reflectionMultiplier * relativeMove[1]];
                    // If the destination square is out of bounds, skip this relative move
                    if (destinationSquare[0] < 0 || destinationSquare[0] > 4 || destinationSquare[1] < 0 || destinationSquare[1] > 4) continue;
                    const destinationSquareAsString = this.#getSquareAsString(destinationSquare);
                    // If a friendly piece is at the destination square, skip this move
                    if (this.squareToSerialMap[destinationSquareAsString] && new RegExp(`${playerLetter}[0-4]{1}`).test(this.squareToSerialMap[destinationSquareAsString])) continue;
                    const capturedPiece = this.squareToSerialMap[destinationSquareAsString] || null;
                    // If the capture piece ends in "2" and is on its team's stairs, stil this move
                    if (playerLetter === "a" && capturedPiece === "b2" && destinationSquareAsString === "2,4") continue;
                    if (playerLetter === "b" && capturedPiece === "a2" && destinationSquareAsString === "2,0") continue;
                    const turn = [pieceSerial, move, this.cMove, relativeMove, capturedPiece];
                    movesToReturn.push(turn);
                }
            }
        }
        return movesToReturn;
    }

    /**
     * Evolve the gameState according to the current player making the turn passed in
     * @param turn - the turn the current player makes
     */
    makeMove(turn) {
        const movingPieceSerial = turn[0];
        const moveSerial = turn[1];
        const relativeMove = turn[3];
        const capturedPieceOrNull = turn[4];

        // Remove captured pieces from the appropriate serial to square map
        if (capturedPieceOrNull) {
            if (this.playerTurnIndex === 0) {
                if (!this.bSerialToSquareMap.hasOwnProperty(capturedPieceOrNull)) {
                    throw new Error(`Expected to capture piece ${capturedPieceOrNull}, but this serial was not a key in bSerialToSquareMap.`);
                }
                delete this.bSerialToSquareMap[capturedPieceOrNull];
            } else {
                if (!this.aSerialToSquareMap.hasOwnProperty(capturedPieceOrNull)) {
                    throw new Error(`Expected to capture piece ${capturedPieceOrNull}, but this serial was not a key in aSerialToSquareMap.`);
                }
                delete this.aSerialToSquareMap[capturedPieceOrNull];
            }
        }

        // Just make sure we have a starting position for the moving piece
        if (this.playerTurnIndex) {
            if (!this.bSerialToSquareMap.hasOwnProperty(movingPieceSerial)) {
                throw new Error(`Expected to find moving piece serial ${movingPieceSerial} in keys of bSerialToSquareMap, but did not find it.`);
            }
        } else {
            if (!this.aSerialToSquareMap.hasOwnProperty(movingPieceSerial)) {
                throw new Error(`Expected to find moving piece serial ${movingPieceSerial} in keys of aSerialToSquareMap, but did not find it.`);
            }
        }

        // Change the square to serial map to reflect the moving piece is no longer at its starting square
        const startStringAsArray = this.playerTurnIndex ? this.bSerialToSquareMap[movingPieceSerial] : this.aSerialToSquareMap[movingPieceSerial];
        const startSquareAsString = this.#getSquareAsString(startStringAsArray);
        // The start square is necessarily left empty
        delete this.squareToSerialMap[startSquareAsString];
        
        // Calculate the destination square
        const reflectionMultiplier = this.playerTurnIndex ? -1 : 1; // Handle 180 degree rotation between player perspectives
        const destinationSquare = [startStringAsArray[0] + reflectionMultiplier * relativeMove[0], startStringAsArray[1] + reflectionMultiplier * relativeMove[1]];
        const destinationSquareAsString = this.#getSquareAsString(destinationSquare);

        // Make sure piece can move to this location (board edges and same team capture)
        if (this.squareToSerialMap.hasOwnProperty(destinationSquareAsString) && this.squareToSerialMap[destinationSquareAsString] !== capturedPieceOrNull) {
            throw new Error(`Inconsistent maps: square to serial map should 
            ${capturedPieceOrNull == null ? `no key for destination ${destination} to execute turn ${turn}, 
            but it had the key with value 
            ${this.squareToSerialMap[destinationSquareAsString]}` : `match the expected capture piece of turn ${turn}, but it had ${this.squareToSerialMap[destinationSquareAsString]} 
            instead.`}`);
        }
        if (destinationSquare[0] < 0 || destinationSquare[0] > 4 || destinationSquare[1] < 0 || destinationSquare[1] > 4) {
            throw new Error(`Can't move piece to destination square ${destinationSquare} since it is off the board.`);
        }

        // Update the square to serial map to reflect a new piece at the destination square
        this.squareToSerialMap[destinationSquareAsString] = movingPieceSerial;

        // Update the serial to square map to show the moving piece is at its new square
        if (this.playerTurnIndex) {
            this.bSerialToSquareMap[movingPieceSerial] = destinationSquare;
        } else {
            this.aSerialToSquareMap[movingPieceSerial] = destinationSquare;
        }

        // change the cMove and playerMoves list
        if (this.playerTurnIndex) {
            if (!this.bMoves.includes(moveSerial)) throw new Error(`Expected that bMoves would contain ${moveSerial} from turn ${turn} but it did not. It had ${this.bMoves}`);
            // Rotate in the cMove for this player to fill the void left by the move used
            this.bMoves.splice(this.bMoves.indexOf(moveSerial), 1);
            this.bMoves.push(this.cMove);
        } else {
            if(!this.aMoves.includes(moveSerial)) throw new Error(`Expected that aMoves would contain ${moveSerial} from turn ${turn} but it did not. It had ${this.aMoves}`);
            // Rotate in the cMove for this player to fill the void left by the move used
            this.aMoves.splice(this.aMoves.indexOf(moveSerial), 1);
            this.aMoves.push(this.cMove);
        }
        // Place the used move into neither player's list of available moves
        this.cMove = moveSerial;

        this.playerTurnIndex = this.playerTurnIndex ? 0 : 1;
    }

    /**
     * Evolve the gameState according to the non-current player unmaking the turn passed in
     * @param turn - the turn the other player should unmake
     */
    unmakeMove(turn) {

        const movingPieceSerial = turn[0];
        const moveSerial = turn[1];
        const oldCMove = turn[2];
        const relativeMove = turn[3];
        const capturedPieceOrNull = turn[4];

        // Just make sure we have a starting position for the moving piece
        if (!this.playerTurnIndex) {
            if (!this.bSerialToSquareMap.hasOwnProperty(movingPieceSerial)) {
                throw new Error(`Expected to find moving piece serial ${movingPieceSerial} in keys of bSerialToSquareMap, but did not find it.`);
            }
        } else {
            if (!this.aSerialToSquareMap.hasOwnProperty(movingPieceSerial)) {
                throw new Error(`Expected to find moving piece serial ${movingPieceSerial} in keys of aSerialToSquareMap, but did not find it.`);
            }
        }

        // Calculate the square that would have been the moving piece's starting square
        const destinationSquare = this.playerTurnIndex ? this.aSerialToSquareMap[movingPieceSerial] : this.bSerialToSquareMap[movingPieceSerial];
        const destinationSquareAsString = this.#getSquareAsString(destinationSquare);
        const reflectionMultiplier = !this.playerTurnIndex ? -1 : 1; // Handle 180 degree rotation between player perspectives
        const originatingSquare = [destinationSquare[0] - reflectionMultiplier * relativeMove[0], destinationSquare[1] - reflectionMultiplier * relativeMove[1]];
        const originatingSquareAsString = this.#getSquareAsString(originatingSquare);

        // Check that the starting square is empty
        if (this.squareToSerialMap.hasOwnProperty(originatingSquareAsString)) throw new Error(`Expected originating square ${originatingSquare} for undoing turn ${turn} would be empty, but currently it has ${this.squareToSerialMap[originatingSquareAsString]}`);

        // Ff there was a captured piece, make sure the piece isn't already on the board (no duplication)
        if (capturedPieceOrNull && (this.aSerialToSquareMap.hasOwnProperty(capturedPieceOrNull) || this.bSerialToSquareMap.hasOwnProperty(capturedPieceOrNull))) throw new Error(`Expected that while undoing turn ${turn} the captured piece ${capturedPieceOrNull} would not still be on the board, but it was.`);

        // Check that the movingPieceSerial is a if it's player b's turn, or vice versa
        if ((this.playerTurnIndex && /b/.test(movingPieceSerial)) || (!this.playerTurnIndex && /a/.test(movingPieceSerial))) throw new Error(`Current player index ${this.playerTurnIndex} matches the player that should have made the turn we're undoing (${turn}), which implies that the player could have moved multiple times in a row.`);

        // If we make it here, the turn can be undone, so do that now
        if (capturedPieceOrNull) {
            this.squareToSerialMap[destinationSquareAsString] = capturedPieceOrNull;
            if (this.playerTurnIndex) {
                this.bSerialToSquareMap[capturedPieceOrNull] = destinationSquare;
            } else {
                this.aSerialToSquareMap[capturedPieceOrNull] = destinationSquare;
            }
        } else {
            delete this.squareToSerialMap[destinationSquareAsString];
        }
        this.squareToSerialMap[originatingSquareAsString] = movingPieceSerial;
        if (this.playerTurnIndex) {
            this.aSerialToSquareMap[movingPieceSerial] = originatingSquare;
        } else {
            this.bSerialToSquareMap[movingPieceSerial] = originatingSquare;
        }

        if (this.cMove !== moveSerial) throw new Error(`Can't undo a move that used ${cMove} if that's not the current cMove, and the current cMove is ${this.cMove}`);
        
        this.cMove = oldCMove;
        if (!this.playerTurnIndex) {
            if (!this.bMoves.includes(oldCMove)) throw new Error(`To undo moving piece ${movingPieceSerial}, bMoves must have the old c move ${oldCMove}, but instead it only has ${this.bMoves}`);
            this.bMoves.splice(this.bMoves.indexOf(oldCMove), 1);
            this.bMoves.push(moveSerial);
        } else {
            if (!this.aMoves.includes(oldCMove)) throw new Error(`To undo moving piece ${movingPieceSerial}, aMoves must have the old c move ${oldCMove}, but instead it only has ${this.aMoves}`);
            this.aMoves.splice(this.aMoves.indexOf(oldCMove), 1);
            this.aMoves.push(moveSerial);
        }
        
        this.playerTurnIndex = this.playerTurnIndex ? 0 : 1;
    }

    /**
     * @returns the winning player index, or, {@link Game.NO_WINNER_PLAYER_INDEX} if stalemate or the game is ongoing
     */
    getWinningPlayerIndex() {
        if (!this.aSerialToSquareMap.hasOwnProperty("a2")) return 1;
        if (this.bSerialToSquareMap.hasOwnProperty("b2") && this.bSerialToSquareMap["b2"][0] === 2 && this.bSerialToSquareMap["b2"][1] === 0) return 1;
        if (!this.bSerialToSquareMap.hasOwnProperty("b2")) return 0;
        if (this.aSerialToSquareMap.hasOwnProperty("a2") && this.aSerialToSquareMap["a2"][0] === 2 && this.aSerialToSquareMap["a2"][1] === 4) return 0;
        return Game.NO_WINNER_PLAYER_INDEX;
    }

    /**
     * This method should be a FAST estimation of a player's winning probability.
     * @returns the probability that player playerIndex will win, as estimated from the current state of the game.
     * @param playerIndex
     */
    getEstimatedWinningProbability(playerIndex) {
        // TODO let x = 3 * (number of pieces player a has) + 1 + rows between a's guru and b's steps
        //  let y = 3 * (number of pieces player b has) + 1 + rows between b's guru and a's steps
        //  if playerIndex === 0, then return 1 - e^(-xq) / (e^(-xq) + e^(-yq)) where q is a factor that
        //  stresses tipping a balance in your favor over improving an already considerable lead.
        const countOfPiecesForPlayerContemplatingNextMove = playerIndex ? Object.keys(this.bSerialToSquareMap).length : Object.keys(this.aSerialToSquareMap).length;
        const countOfPiecesForPlayerNotContempaltingNextMove = !playerIndex ? Object.keys(this.bSerialToSquareMap).length : Object.keys(this.aSerialToSquareMap).length;
        const progressTowardsStepsForPlayerContemplatingNextMove = playerIndex ? 4 - this.bSerialToSquareMap["b2"][1] : this.aSerialToSquareMap["a2"][1];
        const progressTowardsStepsForPlayerNotContemplatingNextMove = !playerIndex ? 4 - this.bSerialToSquareMap["b2"][1] : this.aSerialToSquareMap["a2"][1];
        const scoreOfPlayerConteplatingNextMove = 3 * countOfPiecesForPlayerContemplatingNextMove + progressTowardsStepsForPlayerContemplatingNextMove;
        const scoreOfPlayerNotContemplatingNextMove = 3 * countOfPiecesForPlayerNotContempaltingNextMove + progressTowardsStepsForPlayerNotContemplatingNextMove;
        return scoreOfPlayerConteplatingNextMove / (scoreOfPlayerConteplatingNextMove + scoreOfPlayerNotContemplatingNextMove);
    }


    isGameOver() {
        return (this.getMoves().length === 0) || (this.getWinningPlayerIndex() !== Game.NO_WINNER_PLAYER_INDEX);
    }

    /*
    Specifically for this game object, the process of playing out game scenarios to calculate the best move
    involves making changes to this object and then undoing them. This leads to an equivalent but not identical
    gamestate where the elements of aMoves should be the same original elements but their order may be changed.
    This wrapper method over the base class getBestMove() allows the aMoves and bMoves from the original game
    state to be preserved. This leads to a potentially better client experience where game state arrays don't
    have elements changing order when you call getBestMove();
    */
    getBestMove() {
        const aMovesCopy = [...this.aMoves];
        const bMovesCopy = [...this.bMoves];
        const result = super.getBestMove();
        this.aMoves = aMovesCopy;
        this.bMoves = bMovesCopy;
        return result;
    }

    copy() {
        const dummyGame = new MartialArtsChess(this.moveArrayForGameInstantiation);
        dummyGame.aMoves = [];
        dummyGame.aMoves[0] = this.aMoves[0];
        dummyGame.aMoves[1] = this.aMoves[1];
        dummyGame.bMoves[0] = this.bMoves[0];
        dummyGame.bMoves[1] = this.bMoves[1];
        dummyGame.cMove = this.cMove;
        dummyGame.squareToSerialMap = {};
        for (let square of Object.keys(this.squareToSerialMap)) {
            dummyGame.squareToSerialMap[square] = this.squareToSerialMap[square];
        }
        dummyGame.aSerialToSquareMap = {};
        for (let serial of Object.keys(this.aSerialToSquareMap)) {
            const square = this.aSerialToSquareMap[serial];
            dummyGame.aSerialToSquareMap[serial] = [square[0], square[1]];
        }
        dummyGame.bSerialToSquareMap = {};
        for (let serial of Object.keys(this.bSerialToSquareMap)) {
            const square = this.bSerialToSquareMap[serial];
            dummyGame.bSerialToSquareMap[serial] = [square[0], square[1]];
        }
        dummyGame.serialToRelativeMoveMap = {};
        for (let move of Object.keys(this.serialToRelativeMoveMap)) {
            const arrayOfRelativeMoves = this.serialToRelativeMoveMap[move];
            const arrayForDummyGame = [];
            for (let relativeMove of arrayOfRelativeMoves) {
                arrayForDummyGame.push([relativeMove[0], relativeMove[1]]);
            }
            dummyGame.serialToRelativeMoveMap[move] = arrayForDummyGame;
        }
        dummyGame.playerTurnIndex = this.playerTurnIndex;
        dummyGame.treeSearchMaxDepth = this.treeSearchMaxDepth;
        return dummyGame;
    }

    #getSquareAsString(array) {
        if (array.length !== 2) throw new Error(`Cannot convert square array to string since it does not have only two coordinates. Array was ${array}`);
        return `${array[0]},${array[1]}`;
    }

}

if (typeof module !== "undefined") {
    module.exports = MartialArtsChess;
}