import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { UserMediaContext } from "./UserMediaContext";
import { useMediaDevices } from "../MediaDevicesProvider";

export const UserMediaProvider: React.FC<PropsWithChildren> = ({ children }): React.ReactElement => {
const [stream, setStream] = useState<MediaStream>();
  const {
    isMicrophoneEnabled,
    isVideoEnabled,
    selectedVideoDevice,
    selectedMicrophoneDevice,
  } = useMediaDevices();

  useEffect(() => {
    const fetchStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedMicrophoneDevice?.deviceId ? {
          deviceId: { exact: selectedMicrophoneDevice.deviceId }
        } : true,
        video: selectedVideoDevice?.deviceId ? {
          deviceId: { exact: selectedVideoDevice.deviceId }
        } : true,
      });

      setStream(stream);
    };

    fetchStream();
  }, [
    selectedVideoDevice,
    selectedMicrophoneDevice,
  ]);

  useEffect(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.readyState === 'live' && track.kind === 'video') {
          if (!isVideoEnabled) {
            track.stop();
          }
        }
      });
    }
  }, [stream, isVideoEnabled]);

  useEffect(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.readyState === 'live' && track.kind === 'audio') {
          if (!isMicrophoneEnabled) {
            track.stop();
          }
        }
      });
    }
  }, [stream, isMicrophoneEnabled]);

  const userMediaContextProps = useMemo(
    () => ({
      stream: stream,
    }),
    [stream]
  );

  return (
    <UserMediaContext.Provider value={userMediaContextProps}>
      {children}
    </UserMediaContext.Provider>
  );
};
