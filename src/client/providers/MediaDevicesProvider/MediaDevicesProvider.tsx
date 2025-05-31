import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { MediaDevicesContext } from "./MediaDevicesContext";
import { MediaDevicesUtils } from "./types";

export const MediaDevicesProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [videoMediaDevices, setVideoMediaDevices] = useState<MediaDeviceInfo[]>([]);
  const [microphoneMediaDevices, setMicrophoneMediaDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDevice, selectVideoDevice] = useState<MediaDeviceInfo | null>(null);
  const [selectedMicrophoneDevice, selectMicrophoneDevice] = useState<MediaDeviceInfo | null>(null);
  const [isVideoEnabled, enableVideo] = useState(true);
  const [isMicrophoneEnabled, enableMicrophone] = useState(true);

  useEffect(() => {
    const retrieveMediaDeviceInfo = async () => {
      // mediaDevices.getUserMedia() must be executed first to gain access to media devices
      // upon running mediaDevices.enumerateDevices() below.
      // TODO: Add a warning window and promote this operation up.
      await navigator.mediaDevices.getUserMedia({audio: true, video: true});

      const devices = await navigator.mediaDevices.enumerateDevices();

      const formattedDevices = devices.map(({ deviceId, groupId, kind, label, toJSON }) => ({
        deviceId,
        groupId,
        kind,
        toJSON,
        label: label.split('(')[0].trim(),
      }))

      const videoDevices = formattedDevices.filter((device) => device.kind === 'videoinput');
      setVideoMediaDevices(videoDevices);
      if (videoDevices.length > 0) {
        selectVideoDevice(videoDevices[0]);
      }

      const microphoneDevices = formattedDevices.filter((device) => device.kind === 'audioinput');
      setMicrophoneMediaDevices(microphoneDevices);
        if (microphoneDevices.length > 0) {
        selectMicrophoneDevice(microphoneDevices[0]);
      }
    };

    retrieveMediaDeviceInfo();
  }, []);

  const MediaDevicesProviderProps = useMemo<MediaDevicesUtils>(() => ({
    videoMediaDevices,
    microphoneMediaDevices,
    selectedVideoDevice,
    selectedMicrophoneDevice,
    isVideoEnabled,
    isMicrophoneEnabled,
    enableVideo,
    enableMicrophone,
    selectVideoDevice,
    selectMicrophoneDevice,
  }), [
    videoMediaDevices,
    microphoneMediaDevices,
    selectedVideoDevice,
    selectedMicrophoneDevice,
    isVideoEnabled,
    isMicrophoneEnabled,
    enableVideo,
    enableMicrophone,
    selectVideoDevice,
    selectMicrophoneDevice,
  ]);

  return (
    <MediaDevicesContext.Provider value={MediaDevicesProviderProps}>
      {children}
    </MediaDevicesContext.Provider>
  );
};
