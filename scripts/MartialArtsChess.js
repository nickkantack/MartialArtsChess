const Game = require("./Game");

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
    [serialNumberOfPieceMakingMove, serialNumberOfRelativeMove, serialNumberOfPieceCaptured, or null if no piece was captured]
    and example would be ["a2", "m2", null] (no piece was captured), and ["b3", "m1", "a1"] where piece
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

    constructor (relativeMoves) {
        super();
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
            this.aSerialToSquareMap[`b${i}`] = [i, 4];
            this.squareToSerialMap[`${i},4`] = `a${i}`;
        }
        if (!relativeMoves) throw new Error("You must pass a list of relative moves to the constructor.");
        if (relativeMoves.length !== 5) {
            throw new Error(`Called reset with ${relativeMoves.length} moves, but expected 5.`);
        }
        console.log("Should have errored");
        this.serialToRelativeMoveMap = {};
        for (let i = 0; i <= 4; i++) {
            if (relativeMoves[i].length !== 2) throw new Error(`Relative move ${i} given to reset was ${relativeMoves[i]} but this does not have a length of two.`);
            this.serialToRelativeMoveMap[`m${i}`] = relativeMoves[i];
        }
        console.debug("Ran ok");
        this.aMoves = ["m0", "m1"];
        this.bMoves = ["m2", "m3"];
        this.cMoves = "m4";
    }

    /**
     * Consider caching possible moves in the derived class if calculating possible moves is computationally expensive.
     * Also, it is critically important that this method return an empty list when the game is over.
     *
     * @returns a list of moves which are valid arguments for {@link makeMove}
     */
    getMoves() {
        
    }

    /**
     * Evolve the gameState according to the current player making the move passed in
     * @param move - the move the current player makes
     */
    makeMove(move) {
        // TODO remember that a relative move must be multiplied by -1 when player b is making it!
    }

    /**
     * Evolve the gameState according to the non-current player unmaking the move passed in
     * @param move - the move the other player should unmake
     */
    unmakeMove(move) {
        
    }

    /**
     * @returns the winning player index, or, {@link Game.NO_WINNER_PLAYER_INDEX} if stalemate or the game is ongoing
     */
    getWinningPlayerIndex() {
        
    }

    /**
     * This method should be a FAST estimation of a player's winning probability.
     * @returns the probability that player playerIndex will win, as estimated from the current state of the game.
     * @param playerIndex
     */
    getEstimatedWinningProbability(playerIndex) {
        
    }


    isGameOver() {
        return (this.getMoves().length === 0) || (this.getWinningPlayerIndex() !== Game.NO_WINNER_PLAYER_INDEX);
    }

}

module.exports = MartialArtsChess;