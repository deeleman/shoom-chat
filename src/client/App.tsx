import "./App.css";
import { io, Socket } from 'socket.io-client';
import { useCallback, useEffect, useState } from "react";

const SOCKET_SERVER = `http://localhost:3000`;

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string>('');

  useEffect(() => {
    const socketIO = io(
      process.env.NODE_ENV === 'production' 
        ? window.location.origin 
        : SOCKET_SERVER
    );

    setSocket(socketIO);
    
    socketIO.on('welcome-response', (response) => {
      console.log('Connected to Socket.IO server!', response);
      setMessages(JSON.stringify(response, null, 2));
    });

    socketIO.on('channel-join-response', (response) => {
      console.log('Channel join response.');
      setMessages(JSON.stringify(response, null, 2));
    });
    
    socketIO.on('disconnect', (response) => {
      console.log('Disconnected from Socket.IO server.');
      setMessages(response);
    });

    return () => {
      socketIO.removeAllListeners();
      socketIO.disconnect();
    };
  }, []);

  const buttonClickHandler = useCallback(() => {
    if (socket) {
      socket.emit(
        'channel-join-request',
        { 
          user: {
            socketId: socket.id,
            room: "Pablo's Fun room"
      }});
    }
  }, [socket]);

  return (
    <div className="App">
      <h1>Shoom Chat</h1>
      <div className="card">
        <button onClick={buttonClickHandler}>
          Call peers
        </button>
        <div><pre>{messages}</pre></div>
      </div>
    </div>
  );
}

export default App;
