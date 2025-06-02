import { AspectRatio as PasteAspectRatio, Box } from "@twilio-paste/core";
import { useEffect, useRef } from "react";
import { type AspectRatio } from "./types";

type VideoItemProps = {
  aspectRatio?: AspectRatio;
  widthPx?: number;
  heightPx?: number;
  stream?: MediaStream;
};

const DEFAULT_ASPECT_RATIO = '4:3';

export const VideoGridItem: React.FC<VideoItemProps> = ({
  aspectRatio = DEFAULT_ASPECT_RATIO,
  stream,
  widthPx,
  heightPx,
}): React.ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Box position="relative" width={`${widthPx}px`} height={`${heightPx}px`}>
      <PasteAspectRatio ratio={aspectRatio}>
        <Box
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          left={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor={'colorBackgroundBodyInverse'}
          margin={'space10'}
        >
          <video
            data-stream-id={stream?.id}
            ref={videoRef}
            playsInline
            autoPlay
            muted
          />
        </Box>
      </PasteAspectRatio>
    </Box>
  );
};
