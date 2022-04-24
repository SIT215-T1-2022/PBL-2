import KnightsTourAlgorithm from "./algorithm";

export default class Warndorff implements KnightsTourAlgorithm{
  /** 
   * Calls function f for the different possible move offsets 
   * @param f a function of signature `var (int relativeOffsetX, int relativeOffsetY, var user_data)` 
   * @returns void 
   */ 
  iteratePossibleMoves(f: (
    xOffset:number,
    yOffset:number,
    n:any) => any
  ) {
    let data : any = [];
  
	  // Define the set of moves by an offset of x and y coordinates
    const moves = [
      [-2, 1],
      [-2, -1],
      [-1, 2],
      [-1, -2],
      [1, 2],
      [1, -2],
      [2, 1],
      [2, -1],
    ];
  
    for (let i = 0; i < 8; i++) {
      data = f(moves[i][0], moves[i][1], data); // Call the user's function for the different possible moves 
    }
  
    return data;
  }
  
  /** 
   * Checks if the position at x, y is available and unvisited, indicating that it's possible to move there. 
   * @param board to check 
   * @param x the x coordinate of the position 
   * @param y the y coordinate of the position 
   * @returns bool true if it's possible to move to the specified position, otherwise false 
   */
  canMoveTo(board:[[]], x:number, y:number) : boolean {
  
    let boardWidth = board.length;
    let boardHeight = board[0].length;
  
    if (!(x < boardWidth && x >= 0 && y < boardHeight && y >= 0)) {
      return false;
    }
  
    if (board[x][y] === 0) {
      return true;
    }
  
    return false;
  }
  
  /** 
   * Gets the number of legal moves from a particular x and y coordinate
   * @param board to check 
   * @param x the x coordinate of the position 
   * @param y the y coordinate of the position 
   * @returns the degree from a particular x and y coordinate
   */
  getDegree(board:[[]], x:number, y:number):number {
    let isMovePossible = (xOffset:number, yOffset:number, n:number) : number => {
      n = n ?? 0;
  
      return this.canMoveTo(board, x, y) ? n + 1 : n;
    };
    
    return this.iteratePossibleMoves(isMovePossible);
  }
  
  getDegreeTable(board:[[]], x:number, y:number) {
    let createDegreeTable = (xOffset:number, yOffset:number, n:Array<[number, number, number]>): Array<[number, number, number]> => {
      n = n ? n : [];
      if (this.canMoveTo(board, x + xOffset, y + yOffset)) {
        n.push([xOffset, yOffset, this.getDegree(board, x + xOffset, y + yOffset)]);
      }
      return n;
    };
  
    return this.iteratePossibleMoves(createDegreeTable);
  }
  
  getNextMove(board:[[]], x:number, y:number) {
    let minDegree = 0;
    let nextMoveRelative = [0, 0];
  
    let degreesTable = this.getDegreeTable(board, x, y);
  
    for (let i = 0; i < degreesTable.length; i++) {
      if (degreesTable[0][2] > minDegree) {
        nextMoveRelative = [degreesTable[0][0], degreesTable[0][1]];
        minDegree = degreesTable[0][2];
      }
    }
  
    return nextMoveRelative;
  }
  
  getPath(n:number, startingX:number, startingY:number) : any {
    let board = Array.from(Array(n), () => new Array(n).fill(0)); /// Initializes a board with values elements of value 0, indicating unvisited.
  
    let currentX = startingX;
    let currentY = startingY;
  
    let trace = [];
  
    for (let i = 0; i < n * n - 1; i++) {
      board[currentX][currentY] = 1;
      trace.push([currentX, currentY]);
  
      let nextMove = this.getNextMove(board as [[]], currentX, currentY);
      if (nextMove[0] === 0 && nextMove[1] === 0) {
        break;
      }
  
      currentX += nextMove[0];
      currentY += nextMove[1];
    }
  
    return trace;
  }  
}
