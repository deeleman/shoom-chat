import { useUserMedia } from "../providers";
import { VideoGrid } from "./VideoGrid";
import { VideoRegistration } from "./VideoRegistration";

export const VideoRouter: React.FC = () => {
  const { name } = useUserMedia();

  return name ? <VideoGrid /> : <VideoRegistration />;
};
