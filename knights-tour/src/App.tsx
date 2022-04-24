import React, { useEffect } from 'react';
import './App.css';
import Warndorff from './knights-tour/warndorff';

function App() {
  useEffect(() => {
    const trace = new Warndorff().getPath(5, 1, 2);

    for (var i = 0; i < trace.length; i++) {
      console.log(i + ": { x: " + trace[i][0] + ", y: " + trace[i][1] + "}");
    }
  }, []);
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
