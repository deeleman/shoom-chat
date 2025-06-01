import { useMemo } from "react";
import { useUserMedia } from "../UserMediaProvider";

export const useStreams = (): { streams: MediaStream[] } => {
  const { stream } = useUserMedia();

  const streamsList = useMemo(() => {
    const streams = stream ? [stream] : [];

    return {
      streams,
    }
  }, [stream]);

  return streamsList;
};
