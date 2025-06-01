import { VideoGrid } from './main/VideoGrid';
import { ThemeProvider, MediaDevicesProvider, UserMediaProvider, StreamingProvider } from './providers';
import { Layout } from './shell';

function App() {
  return (
    <MediaDevicesProvider>
      <ThemeProvider defaultTheme="light">
        <UserMediaProvider>
          <StreamingProvider>
            <Layout>
              <VideoGrid />
            </Layout>
          </StreamingProvider>
        </UserMediaProvider>
      </ThemeProvider>
    </MediaDevicesProvider>
  );
}

export default App;
