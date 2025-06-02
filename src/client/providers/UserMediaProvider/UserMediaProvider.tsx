import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { UserMediaContext } from "./UserMediaContext";
import { useMediaDevices } from "../MediaDevicesProvider";
import type { UserMediaData } from "./types";

export const UserMediaProvider: React.FC<PropsWithChildren> = ({
  children,
}): React.ReactElement => {
  const [stream, setStream] = useState<MediaStream>();
  const [name, setName] = useState<string | undefined>(undefined);
  const {
    isMicrophoneEnabled,
    isVideoEnabled,
    selectedVideoDevice,
    selectedMicrophoneDevice,
  } = useMediaDevices();

  const audioDeviceMetadata = useMemo(() => {
    return selectedMicrophoneDevice?.deviceId
      ? {
          deviceId: { exact: selectedMicrophoneDevice.deviceId },
        }
      : true;
  }, [selectedMicrophoneDevice?.deviceId]);

  const videoDeviceMetadata = useMemo(() => {
    return selectedVideoDevice?.deviceId
      ? {
          deviceId: { exact: selectedVideoDevice.deviceId },
        }
      : true;
  }, [selectedVideoDevice?.deviceId]);

  useEffect(() => {
    const fetchStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoDeviceMetadata,
        audio: audioDeviceMetadata,
      });

      setStream(stream);
    };

    fetchStream();
  }, [audioDeviceMetadata, videoDeviceMetadata]);

  useEffect(() => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        if (track.readyState === "live" && !isVideoEnabled) {
          track.stop();
        } else if (track.readyState !== "live" && isVideoEnabled) {
          navigator.mediaDevices
            .getUserMedia({ video: videoDeviceMetadata })
            .then((refreshedStream) => {
              stream.removeTrack(stream.getVideoTracks()[0]);
              stream.addTrack(refreshedStream.getVideoTracks()[0]);
            });
        }
      });
    }
  }, [stream, isVideoEnabled, selectedVideoDevice, videoDeviceMetadata]);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        if (track.readyState === "live" && !isMicrophoneEnabled) {
          track.stop();
        } else if (track.readyState !== "live" && isMicrophoneEnabled) {
          navigator.mediaDevices
            .getUserMedia({ audio: audioDeviceMetadata })
            .then((refreshedStream) => {
              stream.removeTrack(stream.getAudioTracks()[0]);
              stream.addTrack(refreshedStream.getAudioTracks()[0]);
            });
        }
      });
    }
  }, [stream, isMicrophoneEnabled, audioDeviceMetadata]);

  const userMediaProviderValue = useMemo<UserMediaData>(() => ({
    stream,
    name,
    setName,
  }), [name, stream])

  return (
    <UserMediaContext.Provider value={userMediaProviderValue}>
      {children}
    </UserMediaContext.Provider>
  );
};
