import KnightsTourAlgorithm from "./algorithm";

export default class Warndorff implements KnightsTourAlgorithm{
  output: string = '';
  sol: Array<[number, number]> = [];
  N: number = 0;
  
  run(){
    const trace = this.getPath(15, 2, 4);
    
    for(var i = 0; i < this.N; i++)
      this.sol[i] = [0, this.N*this.N-1];
    
    for (let i = 0; i < trace.length; i++)
    {
      const [x, y] = trace[i];
      this.sol[x][y] = i;
    }
  }
  
  printSolution(){
    let out = `Output:\n`;
    for(let x = 0; x < this.N; x++){
      for(let y = 0; y < this.N; y++){
        out = out + this.sol[x][y]+ "\t";
      }
      out = out + "\n";
    }
    return out;
  }
  
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
    let data : any;
  
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
  
    // check if the x and y is in the bounds of the board
    if (!(x < boardWidth && x >= 0 && y < boardHeight && y >= 0)) {
      return false;
    }
  
    // check if the move is available. 0 means the position is not taken.
    if (board[x][y] === 0) {
      return true;
    }
  
    return false;
  }
  
  /** 
   * Gets the number of legal moves from a particular x and y coordinate
   * @param board the board to check
   * @param x the x coordinate of the position 
   * @param y the y coordinate of the position 
   * @returns the degree / number of legal moves from a particular x and y coordinate
   */
  getDegree(board:[[]], x:number, y:number):number {
    let isMovePossible = (xOffset:number, yOffset:number, n:number) : number => {
      n = n ?? 0;

      return this.canMoveTo(board, x + xOffset, y + yOffset) ? n + 1 : n;
    };
    
    return this.iteratePossibleMoves(isMovePossible);
  } 
  
  /** 
   * Gets the number of legal moves from legal moves from a particular x and y coordinate
   * @param board the board to check
   * @param x the x coordinate of the position to check
   * @param y the y coordinate of the position to check
   * @returns a list of the number of legal moves from legal moves from a particular x and y coordinate
   */
  getDegreesOfPossibleMoves(board:[[]], x:number, y:number) {
    let createDegreesOfPossibleMoves = (xOffset:number, yOffset:number, n:Array<[number, number, number]>): Array<[number, number, number]> => {
      n = n ? n : [];
      // if the move is legal, get the amount of possible moves from that position then add it to the list
      if (this.canMoveTo(board, x + xOffset, y + yOffset)) {
        n.push([xOffset, yOffset, this.getDegree(board, x + xOffset, y + yOffset)]);  
      }
      return n;
    }; 
  
    return this.iteratePossibleMoves(createDegreesOfPossibleMoves);
  }
  
  /** 
   * Gets the suggested next move from a particular position
   * @param board the board to consider 
   * @param x the x coordinate of the position to check
   * @param y the y coordinate of the position to check
   * @returns the relative suggested move to make
   */
  getNextMoveRelative(board:[[]], x:number, y:number) {
    let degreesOfPossibleMoves = this.getDegreesOfPossibleMoves(board, x, y);
    if (degreesOfPossibleMoves.length === 0) {
      return [0, 0]; 
    }

    // search for the legal move with the least subsequent moves
    let minDegree = degreesOfPossibleMoves[0][2];
    let nextMoveRelative = [degreesOfPossibleMoves[0][0], degreesOfPossibleMoves[0][1]];
    for (let i = 1; i < degreesOfPossibleMoves.length; i++) {
      if (degreesOfPossibleMoves[i][2] < minDegree) { 
        nextMoveRelative = [degreesOfPossibleMoves[i][0], degreesOfPossibleMoves[i][1]];
        minDegree = degreesOfPossibleMoves[i][2]; 
      }
    }
    return nextMoveRelative; 
  }
  /** 
   * Gets the knights tour path using the warndorfs algorithm
   * @param n the n as in n x n board to create the path from
   * @param startingX the x coordinate to start generating the warndorfs path to
   * @param startingY the y coordinate to start generating the warndorfs path to
   * @returns the knights tour path if a solution has been found, otherwise an attempt at the path that ends before reaching the start again
   */
  getPath(n:number, startingX:number, startingY:number) : any {
    this.N = n;
    
    let board = Array.from(Array(n), () => new Array(n).fill(0)); /// Initializes a board with values elements of value 0, indicating unvisited.
  
    let currentX = startingX;
    let currentY = startingY;
  
    // the potential knights tour
    let tour = [];
   
    // loop a maximum of n * n times; it should generally be safe to rely on the break below, but this is to be extra cautious if something goes wrong
    for (let i = 0; i < n * n; i++) {   
      board[currentX][currentY] = 1;
      tour.push([currentX, currentY]);
  
      let nextMoveRelative = this.getNextMoveRelative(board as [[]], currentX, currentY);
      if (nextMoveRelative[0] === 0 && nextMoveRelative[1] === 0) { 
        break;
      } 
  
      currentX += nextMoveRelative[0];
      currentY += nextMoveRelative[1];
    }
    return tour;
  }  
}
