import { Button } from '@twilio-paste/core/button';
import { ButtonGroup } from '@twilio-paste/core/button-group';
import { Flex } from "@twilio-paste/core/flex";
import { Menu, MenuButton, MenuGroup, MenuItem, useMenuState } from '@twilio-paste/core/menu';
import { ChevronDownIcon } from '@twilio-paste/icons/esm/ChevronDownIcon';
import { MicrophoneOffIcon } from "@twilio-paste/icons/esm/MicrophoneOffIcon";
import { MicrophoneOnIcon } from "@twilio-paste/icons/esm/MicrophoneOnIcon";
import { VideoOffIcon } from "@twilio-paste/icons/esm/VideoOffIcon";
import { VideoOnIcon } from "@twilio-paste/icons/esm/VideoOnIcon";
import { AcceptIcon } from "@twilio-paste/icons/esm/AcceptIcon";
import { useCallback } from 'react';
import { useMediaDevices } from '../../providers';

export const SettingsMenu: React.FC = (): React.ReactElement => {
  const videoOptionsMenu = useMenuState();
  const micOptionsMenu = useMenuState();
  const mediaDevicesSettings = useMediaDevices();

  const toggleVideo = useCallback(() => {
    mediaDevicesSettings.enableVideo(!mediaDevicesSettings.isVideoEnabled);
  }, [mediaDevicesSettings]);
  
  const toggleMicrophone = useCallback(() => {
    mediaDevicesSettings.enableMicrophone(!mediaDevicesSettings.isMicrophoneEnabled);
  }, [mediaDevicesSettings]);

  const selectVideoSource = useCallback((device: MediaDeviceInfo) => {
    mediaDevicesSettings.selectVideoDevice(device);
    videoOptionsMenu.hide();
  }, [mediaDevicesSettings]);

  const selectMicrophone= useCallback((device: MediaDeviceInfo) => {
    mediaDevicesSettings.selectMicrophoneDevice(device);
    micOptionsMenu.hide();
  }, [mediaDevicesSettings]);

  return (
    <ButtonGroup attached>
      <Button variant={mediaDevicesSettings.isVideoEnabled ? 'secondary' : 'destructive_secondary'} onClick={toggleVideo}>
        {mediaDevicesSettings.isVideoEnabled
          ? (<><VideoOnIcon decorative={false} title="Video On" /> Video On</>)
          : (<><VideoOffIcon decorative={false} title="Video Off" /> Video Off</>)
        }
      </Button>
      <MenuButton {...videoOptionsMenu} variant="secondary">
        <ChevronDownIcon decorative={false} title='Camera Options' />
      </MenuButton>
      <Menu {...videoOptionsMenu} aria-label="Camera Options">
        <MenuGroup label="Select camera device" icon={<VideoOnIcon decorative />}>
          {mediaDevicesSettings.videoMediaDevices.map((mediaDevice, _, deviceInfoArray) => (
            <MenuItem {...videoOptionsMenu}
              key={mediaDevice.deviceId}
              disabled={deviceInfoArray.length === 1}
              onClick={() => selectVideoSource(mediaDevice)}
            >
              <Flex hAlignContent={'between'}>
                {mediaDevice.label || 'Default Camera' }
                {mediaDevice.deviceId === mediaDevicesSettings.selectedVideoDevice?.deviceId ? <AcceptIcon decorative /> : null}
              </Flex>
            </MenuItem>
          ))}
        </MenuGroup>
      </Menu>
      <Button variant={mediaDevicesSettings.isMicrophoneEnabled ? 'secondary' : 'destructive_secondary'} onClick={toggleMicrophone}>
        {mediaDevicesSettings.isMicrophoneEnabled
          ? (<><MicrophoneOnIcon decorative={false} title="Microphone On" /> Mic On</>)
          : (<><MicrophoneOffIcon decorative={false} title="Microphone Off" /> Mic Off</>)
        }
      </Button>
      <MenuButton {...micOptionsMenu} variant="secondary">
        <ChevronDownIcon decorative={false} title='Microphone Options' />
      </MenuButton>
      <Menu {...micOptionsMenu} aria-label="Microphone Options">
        <MenuGroup label="Select mic device" icon={<MicrophoneOnIcon decorative />}>
          {mediaDevicesSettings.microphoneMediaDevices.map((mediaDevice, _, deviceInfoArray) => (
            <MenuItem {...micOptionsMenu}
              key={mediaDevice.deviceId}
              disabled={deviceInfoArray.length === 1}
              onClick={() => selectMicrophone(mediaDevice)}
            >
              <Flex hAlignContent={'between'}>
                {mediaDevice.label || 'Default Mic' }
                {mediaDevice.deviceId === mediaDevicesSettings.selectedMicrophoneDevice?.deviceId ? <AcceptIcon decorative /> : null}
              </Flex>
            </MenuItem>
          ))}
        </MenuGroup>
      </Menu>
    </ButtonGroup>
  );
}