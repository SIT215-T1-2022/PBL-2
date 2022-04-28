export default abstract class KnightsTourAlgorithm {
  // provides a virtual / abstract function for our class implementations to override  
  abstract getPath(n:number, startingX:number, startingY:number):Array<[number, number]>;
}
