export type MediaDevicesUtils = {
  videoMediaDevices: MediaDeviceInfo[];
  microphoneMediaDevices: MediaDeviceInfo[];
  selectedVideoDevice: MediaDeviceInfo | null;
  selectedMicrophoneDevice: MediaDeviceInfo | null;
  isVideoEnabled: boolean;
  isMicrophoneEnabled: boolean;

  enableVideo: (enable: boolean) => void;
  enableMicrophone: (enable: boolean) => void;
  selectVideoDevice: (device: MediaDeviceInfo) => void;
  selectMicrophoneDevice: (device: MediaDeviceInfo) => void;
}