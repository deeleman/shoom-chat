import "./App.css";

import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Soom Chat</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Test counter: {count}
        </button>
      </div>
    </div>
  );
}

export default App;
