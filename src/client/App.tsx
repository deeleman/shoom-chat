import { VideoRouter } from './main/VideoRouter';
import { ThemeProvider, MediaDevicesProvider, UserMediaProvider, StreamingProvider } from './providers';
import { Layout } from './shell';

function App() {
  return (
    <MediaDevicesProvider>
      <ThemeProvider defaultTheme="light">
        <UserMediaProvider>
          <StreamingProvider>
            <Layout>
              <VideoRouter />
            </Layout>
          </StreamingProvider>
        </UserMediaProvider>
      </ThemeProvider>
    </MediaDevicesProvider>
  );
}

export default App;
