export default class Warndorff {
  static iteratePossibleMoves(f:Function) {
    let data;
  
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
  
    for (var i = 0; i < 8; i++) {
      data = f(moves[i][0], moves[i][1], data);
    }
  
    return data;
  }
  
  static canMoveTo(board:[[]], x:number, y:number) {
  
    var boardWidth = board.length;
    var boardHeight = board[0].length;
  
    if (!(x < boardWidth && x >= 0 && y < boardHeight && y >= 0)) {
      return false;
    }
  
    if (board[x][y] === 0) {
      return true;
    }
  
    return false;
  }
  
  static getDegree(board:[[]], x:number, y:number):number {
    let isMovePossible = (xOffset:number, yOffset:number, n:number) => {
      if (n == null) {
        n = 0;
      }
  
      if (this.canMoveTo(board, x, y)) {
        return n + 1;
      } else {
        return n;
      }
    };
  
    var n = this.iteratePossibleMoves(isMovePossible);
  
    return n;
  }
  
  static getDegreeTable(board:[[]], x:number, y:number) {
    let createDegreeTable = (xOffset:number, yOffset:number, n:[[number, number, number]]) => {
      n.push();
      if (Warndorff.canMoveTo(board, x + xOffset, y + yOffset)) {
        n.push([xOffset, yOffset, Warndorff.getDegree(board, x + xOffset, y + yOffset)]);
      }
      return n;
    };
  
    var degreeTable = Warndorff.iteratePossibleMoves(createDegreeTable);
  
    return degreeTable;
  }
  
  static getNextMove(board:[[]], x:number, y:number) {
    var minDegree = 0;
    var nextMoveRelative = [0, 0];
  
    var degreesTable = Warndorff.getDegreeTable(board, x, y);
  
    for (var i = 0; i < degreesTable.length; i++) {
      if (degreesTable[0][2] > minDegree) {
        nextMoveRelative = [degreesTable[0][0], degreesTable[0][1]];
        minDegree = degreesTable[0][2];
      }
    }
  
    return nextMoveRelative;
  }
  
  static getWarnsdorffsPath(n:number, startingX:number, startingY:number) {
    var board = Array.from(Array(n), () => new Array(n).fill(0));
  
    var currentX = startingX;
    var currentY = startingY;
  
    var trace = [];
  
    for (var i = 0; i < n * n - 1; i++) {
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
