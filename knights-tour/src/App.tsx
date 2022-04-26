import React, { useEffect } from 'react';
import './App.css';
import Backtrack from './knights-tour/backtrack';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Warndorff from './knights-tour/warndorff';

function App() {
  useEffect(() => {
    // const trace = new Warndorff().getPath(5, 1, 4);

    // for (var i = 0; i < trace.length; i++) {
    //   console.log(i + ": { x: " + trace[i][0] + ", y: " + trace[i][1] + "}");
    // }
    
    // Driver code
    
    // Function Call
    const backtrackKT = new Backtrack();
    backtrackKT.solveKT();
  }, []);
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
