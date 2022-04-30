
import React from 'react';
import './App.css';
import Backtrack from './knights-tour/backtrack';
import Warnsdorff from './knights-tour/warnsdorff';

function App() {
  const [algorithm, setAlgorithm] = React.useState<any>();
  const [output, setOutput] = React.useState<string>();
  const [status, setStatus] = React.useState<string>();
  
  React.useEffect(() => {
    (document.getElementById("N") as HTMLInputElement).value = '8';
    (document.getElementById("X") as HTMLInputElement).value = '0';
    (document.getElementById("Y") as HTMLInputElement).value = '0';
  }, [])
  
  return (
    <div className="App">
      <div style={{margin: "auto", width: "300px", marginTop: "1em"}}>
        <button
          onClick={() => {
            // Ensure algorithm is not null
            if(!algorithm){
              setStatus("Algorithm not initialised!");
              return;
            }
            const N:number = Number((document.getElementById("N") as HTMLInputElement).value);
            const X:number = Number((document.getElementById("X") as HTMLInputElement).value);
            const Y:number = Number((document.getElementById("Y") as HTMLInputElement).value);
            
            // Run the algorithm
            setStatus("Running...");
            let sol;
            setTimeout(() => {
              var start = new Date().getTime();
              sol = algorithm.run(N ?? 8, X ?? 0, Y ?? 0);
              var end = new Date().getTime();
              // Print the output
              setOutput(algorithm.printSolution(sol));
              
              setStatus("Done. Algororithm finished in " + (end - start) + "ms");
            }, 100)
            
          }}
        >
          START
        </button>
        &nbsp;
        <button
          onClick={() => setAlgorithm(new Warnsdorff())}
          disabled={algorithm && algorithm.name === "Warnsdorff's"}
        >
          Warnsdorff
        </button>
        &nbsp;
        <button
          onClick={() => setAlgorithm(new Backtrack())}
          disabled={algorithm && algorithm.name === "Backtracking"}
        >
          Backtracking
        </button>
        <br /><br />
        Board Size: <input
          type="number"
          id="N"
          min="0"
          max="500"
        />
        <br />
        Start X: <input
          type="number"
          min="0"
          id="X"
          max={algorithm ? algorithm.N-1 : 0}
        />
        <br />
        Start Y: <input
          type="number"
          min="0"
          id="Y"
          max={algorithm ? algorithm.N-1 : 0}
        />
        <pre>
          Status: {status}
        <pre>
        </pre>
          Algorithm: {algorithm ? algorithm.name : "uninitialised"}
        </pre>
      </div>
      <div style={{textAlign: "center"}}>
        {/* Output */}
        {output && output.split("\n").map((row, rowKey) => 
          <div
            style={{
            }}
            key={rowKey}
          >
            {row.split('|').map((value, valueKey) => 
              value && <div
                style={{
                  width: "3rem",
                  lineHeight: "3rem",
                  textAlign: "center",
                  display: "inline-block",
                  border: "1px solid black",
                  backgroundColor: (rowKey + valueKey) % 2 === 1 ? "#b37964" : "#edc5b7"
                }}
                key={valueKey}
              >
                {value}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
