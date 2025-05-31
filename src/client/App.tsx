import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from "react";
import { Backdrop, Footer, Header } from './shell';
import { Flex } from '@twilio-paste/flex';
import { ThemeProvider } from './providers';

const SOCKET_SERVER = `http://localhost:3000`;

function App() {
  const [_, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string>('');
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    const socketIO = io(
      process.env.NODE_ENV === 'production' 
        ? window.location.origin 
        : SOCKET_SERVER
    );

    setSocket(socketIO);
    
    socketIO.on('welcome-response', (response) => {
      console.log('Connected to Socket.IO server!', response);
      setSocketId(response.socketId);
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

  return (
    <ThemeProvider defaultTheme='dark'>
      <Backdrop>
        <Flex width={'100%'} height={'100vh'} vertical>
          <Header />
          <Flex grow>
            <div className="card">
              <div><pre>{messages}</pre></div>
              <div><pre>Socket ID: {socketId}</pre></div>
            </div>
          </Flex>
          <Footer />
        </Flex>
      </Backdrop>
    </ThemeProvider>
  );
}

export default App;
