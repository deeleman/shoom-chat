import { Box } from "@twilio-paste/core";
import { VideoGridItem } from "./VideoGridItem";
import { useStreamingData } from "../providers";
import { useRef } from "react";
import { useGrid } from "./useGrid";
import { type AspectRatio } from "./types";

export const VideoGrid: React.FC = () => {
  const { streams } = useStreamingData();

  const gridContainerRef = useRef<HTMLDivElement>(null);

  const ASPECT_RATIO: AspectRatio = '16:9';

  const [gridItemWidth, gridItemHeight] = useGrid(gridContainerRef, streams, ASPECT_RATIO);

  return (
    <Box width={'100%'} height={'100%'} position={'relative'}>
      <Box position={'absolute'} top={0} left={0} right={0} bottom={0} display={'flex'} justifyContent={'center'}>
        <Box
          ref={gridContainerRef}
          display={'flex'}
          width={'90%'}
          height={"100%"}
          flexWrap={"wrap"}
          justifyContent={'center'}
          alignContent={'center'}
          alignItems={'center'}
        >
          {streams.map((stream, index) => (
            <VideoGridItem key={`${stream.id}__${index}`} widthPx={gridItemWidth} heightPx={gridItemHeight} stream={stream} aspectRatio={ASPECT_RATIO} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
