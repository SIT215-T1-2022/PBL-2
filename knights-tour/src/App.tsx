
import React, { useEffect } from 'react';
import './App.css';
import Backtrack from './knights-tour/backtrack';
import Warndorff from './knights-tour/warndorff';

function App() {
  const [algorithm, setAlgorithm] = React.useState<any>();
  const [output, setOutput] = React.useState<string>();
  
  useEffect(() => {

    // for (var i = 0; i < trace.length; i++) {
    //   console.log(i + ": { x: " + trace[i][0] + ", y: " + trace[i][1] + "}");
    // }
    
    // Function Call
    const N = 8;
    const x = 4;
    const y = 0;
    // const N = 7;
    // const x = 1;
    // const y = 0;
    
    setAlgorithm(new Backtrack(N, x, y));
    setAlgorithm(new Warndorff());
  }, []);
  
  return (
    <div className="App">
      <button
        onClick={() => {
          if(!algorithm) return;
          const sol = algorithm.run();
          const str = algorithm.printSolution(sol);
          console.log(str);
          setOutput(str);
        }}
      >
        START
      </button>
      {output && output.split("\n").map((i,key) => {
        return <div key={key}>{i}</div>;
      })}
    </div>
  );
}

export default App;
