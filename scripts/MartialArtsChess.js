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
                    if (destinationSquare[0] < 0 || destinationSquare[0] > 4 || destinationSquare[1] < -1 || destinationSquare[1] > 4) continue;
                    const destinationSquareAsString = `${destinationSquare[0]},${destinationSquare[1]}`;
                    // If a friendly piece is at the destination square, skip this move
                    if (this.squareToSerialMap[destinationSquareAsString] && new RegExp(`${playerLetter}[0-4]{1}`).test(this.squareToSerialMap[destinationSquareAsString])) continue;
                    const capturedPiece = this.squareToSerialMap[destinationSquareAsString] || null;
                    const turn = [pieceSerial, relativeMove, capturedPiece];
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
        // TODO remember that a relative move must be multiplied by -1 when player b is making it!

        // TODO change the cMove and playerMoves list

        this.playerTurnIndex = this.playerTurnIndex ? 0 : 1;
    }

    /**
     * Evolve the gameState according to the non-current player unmaking the turn passed in
     * @param turn - the turn the other player should unmake
     */
    unmakeMove(turn) {
        
        this.playerTurnIndex = this.playerTurnIndex ? 0 : 1;
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

}

module.exports = MartialArtsChess;