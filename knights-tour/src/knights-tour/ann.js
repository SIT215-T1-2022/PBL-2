import nj from './numjs';
import _ from "underscore";

export default class ANN {
  KNIGHT_MOVES = [[1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2]];
  DEBUG = true;
  board_size;
  board;
  // Consists of a board and each legal knight's move is a neuron.
  // each neuron has a state, an output, 2 vertices(which are
  // positions on board) and at most 8 neighbours(all the neurons
  // that share a vertex with this neuron).
  // if a neuron output is 1 then it is in the solution.
  constructor(board_size){
    this.board_size = board_size
    this.board = []
    for (let i = 0; i < this.board_size[0]; i++){
      let temp = []
      for(let j = 0; j < this.board_size[1]; j++){
        temp.push({})
      }
      this.board.push(temp)
    }
    this.neuron_vertices = []
    this.neuron_outputs = []
    this.neuron_states = []
    this.neuron_neighbours = []
    if (this.DEBUG){
        console.log('------first-------')
        this.print_board(this.board)
    }
    this.init()
  }
  print_board(board){
    if (board.length === this.board_size[0])
      for (let i = 0; i < this.board_size[0]; i++)
        console.log(board[i])
    else{
      // eslint-disable-next-line no-unused-vars
      let m = 0
      for (let i = 0; i < board.length; i += 6)
        console.log(board.slice(i, i + 6))
    }
  }
  
  init(){
      
      // Finds all the possible neurons(knight moves) on the board
      // and sets the neuron_vertices and neuron neighbours.
      
      let neuron_num = 0
      // looping through the board
      for (let x1 = 0; x1 < this.board_size[0]; x1++) {
        for (let y1 = 0; y1 < this.board_size[1]; y1++) {
          let i = x1 * this.board_size[1] + y1

          // eslint-disable-next-line no-loop-func
          this.find_neighbours([x1, y1]).foreach((x2, y2) => {
              let j = x2 * this.board_size[1] + y2

              // each neuron has 2 vertices so this is to make
              // sure that we add the neuron once.
              if(j > i){
                const neuron_num_temp = neuron_num;
                this.board[x1][y1].add(neuron_num_temp)
                this.board[x2][y2].add(neuron_num_temp)
                this.neuron_vertices.push([[x1, y1], [x2, y2]])
                neuron_num += 1;
              }
            });
          }
        }
      for(let i = 0; i < this.neuron_vertices.length; i++){
          let [vertex1, vertex2] = this.neuron_vertices[i];
          // neighbours of neuron i = neighbours of vertex1 + neighbours of vertex2 - i
          this.neuron_neighbours.push(_.union(this.board[vertex1[0]][vertex1[1]], this.board[vertex2[0]][vertex2[1]]) - {i});
      }
      if (this.DEBUG){
        console.log("----init-----")
        console.log('board')
        this.print_board(this.board)
        console.log('vertices')
        this.print_board(this.neuron_vertices)
        console.log('neighbours')
        this.print_board(this.neuron_neighbours)
      }
  }
  initialize_neurons(){
    // Initializes each neuron state to 0 and a random number
    // between 0 and 1 for neuron outputs.
    
    this.neuron_outputs = nj.random.randint(2, (this.neuron_vertices.length), nj.int16)
    this.neuron_states = nj.zeros((this.neuron_vertices.length), nj.int16)

    if (this.DEBUG){
      console.log('_________initialize_neurons__________________________')
      console.log('states:')
      console.log(this.neuron_states)
      console.log('outputs')
      console.log(this.neuron_outputs)
    }
  }
  
  update_neurons(){
    
    // Updates the state and output of each neuron.
    
    let sum_of_neighbours = nj.zeros((this.neuron_states.length), nj.int16)
    for (let i = 0; i < this.neuron_neighbours.length; i++)
      sum_of_neighbours[i] = this.neuron_outputs.filter((x, i) => this.neuron_neighbours[i]).sum()

    let next_state = this.neuron_states + 4 - sum_of_neighbours - this.neuron_outputs
    // counts the number of changes between the next state and the current state.
    let number_of_changes = nj.count_nonzero(next_state !== this.neuron_states)
    // if next state[i] < 3 ---> output[i] = 0
    // if next state[i] > 0 ---> output[i] = 3
    this.neuron_outputs[nj.argwhere(next_state < 0).ravel()] = 0
    this.neuron_outputs[nj.argwhere(next_state > 3).ravel()] = 1
    this.neuron_states = next_state
    // counts the number of active neurons which are the neurons that their output is 1.
    let number_of_active = this.neuron_outputs[this.neuron_outputs === 1].length

    if(this.DEBUG){
      console.log('____________________update________________________')
      console.log('states:')
      console.log(this.neuron_states)
      console.log('output')
      console.log(this.neuron_outputs)
    }
    return [number_of_active, number_of_changes]
  }
  
  neural_network(){
    // Finds a closed knight's tour.
    let even = false
    let time = 0
    while (true){
      this.initialize_neurons()
      let n = 0;
      while (true){
        let [num_of_active, num_of_changes] = this.update_neurons()
        console.log('_______________info_________________')
        console.log('active', num_of_active, 'changes', num_of_changes)
        if (num_of_changes === 0) break
        if (this.check_degree()){
          even = true
          break
        }
        n += 1
        if (n === 20) break
        }
      // eslint-disable-next-line no-unused-vars
      time += 1
      if (even){
        console.log('all vertices have degree=2')
        if (this.check_connected_components()){
          console.log('solution found!!')
          this.get_solution()
          return
        }
        else even = false
        }
      }
  }
  check_connected_components(){
    // Checks weather the solution is a knight's tour and it's not
    // two or more independent hamiltonian graphs.
    // gets the index of active neurons.
    let active_neuron_indices = nj.argwhere(this.neuron_outputs === 1).ravel()
    // dfs through all active neurons starting from the first element.
    return this.dfs_through_neurons(active_neuron_indices[0], active_neuron_indices);
  }
  dfs_through_neurons(neuron, active_neurons){
      // Performs a DFS algorithm from a starting active neuron
      // visiting all active neurons.
      // Returns true if the is no active neurons left in the array
      // (means we have only on hamiltonian graph).
      // removes the neuron from the active neurons list.
      active_neurons = nj.setdiff1d(active_neurons, [neuron])
      // first finds the neighbours of this neuron and then finds which of them are active.
      let active_neighbours = nj.intersect1d(active_neurons, this.neuron_neighbours[neuron])
      // if there was no active neighbours for this neuron, the hamiltonian graph has been
      // fully visited.
      if (active_neighbours.length === 0)
        // we check if all the active neurons have been visited. if not, it means that there
        // are more than 1 hamiltonian graph and it's not a knight's tour.
        return active_neurons.length === 0
      else return this.dfs_through_neurons(neuron=active_neighbours[0], active_neurons)
  }
  get_solution(){
    // Finds and prints the solution.
    let visited = []
    let current_vertex = [0, 0]
    let labels = nj.zeros(this.board_size, nj.int16)
    // gets the index of active neurons.
    let active_neuron_indices = nj.argwhere(this.neuron_outputs === 1).ravel()
    let i = 0
    while (active_neuron_indices.length !== 0){
      visited.push(current_vertex)
      labels[current_vertex] = i
      i += 1
      // finds the index of neurons that have this vertex(current_vertex).
      // eslint-disable-next-line no-loop-func
      let vertex_neighbours = this.board.filter(() => current_vertex[0])[current_vertex[1]]
      // finds the active ones.
      // active neurons that have this vertex are the edges of the solution graph that
      // share this vertex.
      vertex_neighbours = nj.intersect1d(vertex_neighbours, active_neuron_indices)
      // picks one of the neighbours(the first one) and finds the other vertex of
      // this neuron(or edge) and sets it as the current one
      
      current_vertex = this.neuron_vertices.filter(() => vertex_neighbours[0]) - {current_vertex}[0]
      // removes the selected neighbour from all active neurons
      active_neuron_indices = nj.setdiff1d(active_neuron_indices, [vertex_neighbours[0]])
    }
    console.log(labels)
  }
  get_active_neurons_vertices(){
      
      // Returns the vertices of the active neurons(neurons
      // that have output=1).
      // Used for drawing the edges of the graph in GUI.
      
      // gets the index of active neurons.
      let active_neuron_indices = nj.argwhere(this.neuron_outputs === 1).ravel()
      let active_neuron_vertices = []
      active_neuron_indices.forEach(i => {
        active_neuron_vertices.push(this.neuron_vertices[i])
      });
      return active_neuron_vertices
  }
  check_degree(){
      
      // Returns true if all of the vertices have degree=2.
      // for all active neurons updates the degree of its
      // vertices and then checks if degree has any number
      // other than 2.
      
      // gets the index of active neurons.
      let active_neuron_indices = nj.argwhere(this.neuron_outputs === 1).ravel()
      let degree = nj.zeros((this.board_size[0], this.board_size[1]), nj.int16)

      active_neuron_indices.foreach((i) => {
        let [vertex1, vertex2] = this.neuron_vertices[i]
        degree[vertex1[0]][vertex1[1]] += 1
        degree[vertex2[0]][vertex2[1]] += 1
      });
      
      if(this.DEBUG){
        console.log('____________________check degree_______________________')
        console.log(degree)
      }
      // if all the degrees=2 return true
      return degree[degree !== 2].size === 0;
  }
  
  find_neighbours(pos){
    // Returns all the positions which the knight can move
    // giving it's position.
    let neighbours = {}
    this.KNIGHT_MOVES.foreach((dy, dx) => {
      let new_x = pos[0]+dx;
      let new_y = pos[1]+dy;
      if(0 <= new_x && new_x  < this.board_size[0] && 0 <= new_y && new_y < this.board_size[1])
        neighbours.add((new_x, new_y))
      });
    return neighbours
  }
}
