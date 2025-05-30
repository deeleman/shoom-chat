import "./App.css";
import { io, Socket } from 'socket.io-client';
import { useCallback, useEffect, useState } from "react";

const SOCKET_SERVER = `http://localhost:3000`;

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socketIO = io(
      process.env.NODE_ENV === 'production' 
        ? window.location.origin 
        : SOCKET_SERVER
    );

    setSocket(socketIO);
    
    socketIO.on('connect', () => {
      console.log('Connected to Socket.IO server!');
      setMessages((prevMessages) => [...prevMessages, 'Connected to server!']);
    });

    socketIO.on('peers', (socketId, peers) => {
      console.log({socketId, peers})
      setMessages((prevMessages) => [...prevMessages, JSON.stringify({socketId, peers}, null, 2)]);
    });

    socketIO.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server.');
      setMessages((prevMessages) => [...prevMessages, 'Disconnected from server.']);
    });

    return () => {
      socketIO.removeAllListeners();
      socketIO.disconnect();
    };
  }, []);

  const buttonClickHandler = useCallback(() => {
    if (socket) {
      socket.emit('peers');
    }
  }, [socket]);

  return (
    <div className="App">
      <h1>Shoom Chat</h1>
      <div className="card">
        <button onClick={buttonClickHandler}>
          Call peers
        </button>
        {messages.map((message) => (
          <p><pre>{message}</pre></p>
        ))}
      </div>
    </div>
  );
}

export default App;
