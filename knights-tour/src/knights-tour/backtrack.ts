
// Source: https://www.geeksforgeeks.org/the-knights-tour-problem-backtracking-1/
export default class Backtrack {
  
  // Javascript program for Knight Tour problem
  iterations:number = 0;
  N: number = -1;
  startX: number = -1;
  startY: number = -1;
  name: string = "Backtracking";
  
  // A utility function to check if i,j are
  // valid indexes for N*N chessboard
  isSafe(x:number, y:number, sol: number[][]): boolean {
    return(x >= 0 && x < this.N && y >= 0 && y < this.N && sol[x][y] === -1);
  }
  
  // A utility function to print solution
  // matrix sol[N][N]
  printSolution(sol:[][]):string{
    let output:string = ``;
    for(let x = 0; x < this.N; x++){
      for(let y = 0; y < this.N; y++){
        output = output + (sol[x][y]) + "|";
      }
      output = output + "\n";
    }
    return output;
  }
  
  // This function solves the Knight Tour problem
  // using Backtracking.  This  function mainly
  // uses solveKTUtil() to solve the problem. It
  // returns false if no complete tour is possible,
  // otherwise return true and prints the tour.
  // Please note that there may be more than one
  // solutions, this function prints one of the
  // feasible solutions. 
  run(N: number, x: number, y: number)
  {
    this.N = N;
    this.startX = x;
    this.startY = y;
    
    console.log("Solve!");
    // Initialize solution array to be the size of N
    let sol:number[][] = new Array(this.N);
    for(var i = 0; i < sol.length; i++)
      sol[i] = new Array(2);
    
    // Initialise all elements of the solution matrix to be -1
    for(let x = 0; x < this.N; x++)
      for(let y = 0; y < this.N; y++)
        sol[x][y] = -1;

    // xMove[] and yMove[] define next move of Knight.
    // xMove[] is for next value of x coordinate
    // yMove[] is for next value of y coordinate
    let xMove = [ 2, 1, -1, -2, -2, -1, 1, 2 ];
    let yMove = [ 1, 2, 2, 1, -1, -2, -2, -1 ];

    // Since the Knight is initially at the first block
    sol[this.startX][this.startY] = 0;

    // Start from 0,0 and explore all tours using
    // solveKTUtil()
    if (!this.solveKTUtil(this.startX, this.startY, 1, sol, xMove, yMove))
    {
      console.log("Solution does not exist");
      return false;
    }
    
    return sol;
  }
  
  // A recursive utility function to solve Knight
  // Tour problem
  solveKTUtil(x: number,
    y: number, 
    movei: number,
    sol: number[][],
    xMove: number[],
    yMove: number[]
  ){
    // Break if the iterations goes for too long.
    this.iterations++;
    if(this.iterations > 50e8){
      console.error("Too many iterations");
      return false;
    }
    
    let k, next_x, next_y;
    if (movei === this.N * this.N) return true;

    // Try all next moves from the
    // current coordinate x, y
    for(k = 0; k < 8; k++)
    {
      // Get the next move by shifting the current position by the next knight move
      next_x = x + xMove[k];
      next_y = y + yMove[k];
      
      if (this.isSafe(next_x, next_y, sol))
      {
        // Knight move is legal.
        sol[next_x][next_y] = movei;
        if (this.solveKTUtil(next_x, next_y, movei + 1, sol, xMove, yMove))
          return true; // Found solution
        else
          sol[next_x][next_y] = -1; // backtracking
      }
    }
    return false;
  }
}
