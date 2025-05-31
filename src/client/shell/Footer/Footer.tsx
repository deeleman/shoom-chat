import { Badge } from '@twilio-paste/core/Badge';
import { Box } from '@twilio-paste/core/Box';
import { Button } from '@twilio-paste/core/button';
import { ButtonGroup } from '@twilio-paste/core/button-group';
import { Flex } from "@twilio-paste/core/flex";
import { Menu, MenuButton, MenuItem, useMenuState } from '@twilio-paste/core/menu';
import { ChevronDownIcon } from '@twilio-paste/icons/esm/ChevronDownIcon';
import { MicrophoneOffIcon } from "@twilio-paste/icons/esm/MicrophoneOffIcon";
import { MicrophoneOnIcon } from "@twilio-paste/icons/esm/MicrophoneOnIcon";
import { VideoOffIcon } from "@twilio-paste/icons/esm/VideoOffIcon";
import { VideoOnIcon } from "@twilio-paste/icons/esm/VideoOnIcon";
import GitHubButton from "react-github-btn";
import { useCallback, useState } from 'react';

export const Footer: React.FC = (): React.ReactElement => {
  const videoOptionsMenu = useMenuState();
  const micOptionsMenu = useMenuState();

  const [videoOn, setVideoOn] = useState(true);
  const [microphoneOn, setMicrophoneOn] = useState(true);

  const toggleVideo = useCallback(() => {
    setVideoOn((videoOn) => !videoOn);
  }, []);

  const toggleMicrophone = useCallback(() => {
    setMicrophoneOn((microphoneOn) => !microphoneOn);
  }, []);

  return (
    <Box padding={'space60'} width={'100%'}>
      <Flex width={'100%'} hAlignContent={'between'} vAlignContent={'bottom'}>
        <Badge as="span" variant="neutral_counter">v1.0.0</Badge>
        <ButtonGroup attached>
          <Button variant={videoOn ? 'secondary' : 'destructive_secondary'} onClick={toggleVideo}>
            {videoOn
              ? (<><VideoOnIcon decorative={false} title="Video On" /> Video On</>)
              : (<><VideoOffIcon decorative={false} title="Video Off" /> Video Off</>)
            }
          </Button>
          <MenuButton {...videoOptionsMenu} variant="secondary">
            <ChevronDownIcon decorative={false} title='Camera Options' />
          </MenuButton>
          <Menu {...videoOptionsMenu} aria-label="Camera Options">
            <MenuItem {...videoOptionsMenu}>System camera</MenuItem>
            <MenuItem {...videoOptionsMenu}>Display monitor camera</MenuItem>
            <MenuItem {...videoOptionsMenu}>logi built-in camera</MenuItem>
          </Menu>
          <Button variant={microphoneOn ? 'secondary' : 'destructive_secondary'} onClick={toggleMicrophone}>
            {microphoneOn
              ? (<><MicrophoneOnIcon decorative={false} title="Microphone On" /> Mic On</>)
              : (<><MicrophoneOffIcon decorative={false} title="Microphone Off" /> Mic Off</>)
            }
          </Button>
          <MenuButton {...micOptionsMenu} variant="secondary">
            <ChevronDownIcon decorative={false} title='Microphone Options' />
          </MenuButton>
          <Menu {...micOptionsMenu} aria-label="Microphone Options">
            <MenuItem {...micOptionsMenu}>System mic</MenuItem>
            <MenuItem {...micOptionsMenu}>Display monitor mic</MenuItem>
            <MenuItem {...micOptionsMenu}>logi built-in mic</MenuItem>
          </Menu>
        </ButtonGroup>
        <GitHubButton
          href="https://github.com/deeleman/shoom-chat"
          data-color-scheme={`no-preference: light; light: light; dark: dark;`}
          data-show-count="true"
          aria-label="Star deeleman/shoom-chat on GitHub"
        >
          Star
        </GitHubButton>
      </Flex>
    </Box>
  );
}