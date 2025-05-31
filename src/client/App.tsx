// import { io, Socket } from 'socket.io-client';
import { ThemeProvider, MediaDevicesProvider } from './providers';
import { Layout } from './shell';

function App() {
  // const SOCKET_SERVER = `http://localhost:3000`;
  // const [_, setSocket] = useState<Socket | null>(null);
  // const [messages, setMessages] = useState<string>('');
  // const [socketId, setSocketId] = useState<string | null>(null);

  // useEffect(() => {
  //   const socketIO = io(
  //     process.env.NODE_ENV === 'production' 
  //       ? window.location.origin 
  //       : SOCKET_SERVER
  //   );

  //   setSocket(socketIO);
    
  //   socketIO.on('welcome-response', (response) => {
  //     console.log('Connected to Socket.IO server!', response);
  //     setSocketId(response.socketId);
  //     setMessages(JSON.stringify(response, null, 2));
  //   });

  //   socketIO.on('channel-join-response', (response) => {
  //     console.log('Channel join response.');
  //     setMessages(JSON.stringify(response, null, 2));
  //   });
    
  //   socketIO.on('disconnect', (response) => {
  //     console.log('Disconnected from Socket.IO server.');
  //     setMessages(response);
  //   });

  //   return () => {
  //     socketIO.removeAllListeners();
  //     socketIO.disconnect();
  //   };
  // }, []);

  return (
    <MediaDevicesProvider>
      <ThemeProvider defaultTheme="dark">
        <Layout>
          <p>Video is embedded here</p>
        </Layout>
      </ThemeProvider>
    </MediaDevicesProvider>
  );
}

export default App;
