import { AspectRatio, Box, Flex, Heading, HelpText, Input, Label, Paragraph } from "@twilio-paste/core";
import { useEffect, useRef } from "react";
import { useUserMedia } from "../providers";

export const VideoRegistration: React.FC = (): React.ReactElement => {
  const { stream, setName } = useUserMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleKeyUp = (e) => {
    const name = inputRef.current?.value;
    if (e.key === 'Enter' && name && name.length > 1) {
      setName(name);
    }
  }
  
  return (
    <Flex vAlignContent={'stretch'} hAlignContent={'center'} maxWidth={'80%'}>
      <Box position="relative" width={`400px`}>
        <AspectRatio ratio={'4:3'}>
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
        </AspectRatio>
      </Box>
      <Box maxWidth={'40%'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'self-start'} backgroundColor={'colorBackgroundBody'} paddingX={'space80'} marginY={'space10'}>
        <Heading as="h2" variant="heading20">Welcome to Shoom!</Heading>
        <Paragraph>We're thrilled to have you here! Now you can start chatting with your contacts and conduct 1:1 meetings with peers and family. Please provide your full name below:</Paragraph>
        <Label htmlFor="name" required>Your full name</Label>
        <Input ref={inputRef} aria-describedby="name_help_text" id="name" name="name" type="text" placeholder="Eg. John Doe" required onKeyUp={handleKeyUp} />
        <HelpText id="name_help_text">Once entered the information hit ENTER to submit</HelpText>
      </Box>
    </Flex>
  );
};