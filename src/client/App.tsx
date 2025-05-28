import "./App.css";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [socketOutput, setSocketOutput] = useState('');
  const socketRef = useRef(io());

  useEffect(() => {
    socketRef.current.on('peers', (socketId, peers) => {
      console.log({socketId, peers})
      setSocketOutput(JSON.stringify({socketId, peers}, null, 2));
    });

    return () => {
      socketRef.current.removeAllListeners();
    };
  }, []);

  return (
    <div className="App">
      <h1>Soom Chat</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Test counter: {count}
        </button>
        {socketOutput && <p><pre>{socketOutput}</pre></p>}
      </div>
    </div>
  );
}

export default App;
