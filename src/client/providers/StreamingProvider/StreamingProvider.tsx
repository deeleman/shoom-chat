import { useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { io } from 'socket.io-client';
import { StreamingContext } from "./StreamingContext";
import { useUserMedia } from "../UserMediaProvider";
import { SocketEvent, type StreamingContextType, type PeersRefreshPayload } from "./types";

const DEV_SOCKET_SERVER = `http://localhost:3000`;
const SOCKET_URI = process.env.NODE_ENV === 'production' ? window.location.origin : DEV_SOCKET_SERVER;
const socketIO = io(SOCKET_URI);

export const StreamingProvider: React.FC<PropsWithChildren> = ({ children }): React.ReactElement => {
  const localStream = useUserMedia();
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>(undefined);

  const localRTCConnectionRef = useRef<RTCPeerConnection>(null)
  const remoteRTCConnectionRef = useRef<RTCPeerConnection>(null)

  const handlePeersRefresh = useCallback(({ peers }: PeersRefreshPayload) => {
    console.log('Connected to Socket.IO server!');

    if (!peers || !peers.length || !localStream) {
      return;
    }

    const peerSocketId = peers[0];
    localRTCConnectionRef.current = new RTCPeerConnection();

    localStream
      .getTracks()
      .forEach((track) => localRTCConnectionRef.current!.addTrack(track, localStream));

    localRTCConnectionRef.current.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socketIO.emit(SocketEvent.ICECandidateRequest, peerSocketId, candidate);
      }
    };

    localRTCConnectionRef.current.ontrack = ({ streams: [remoteMediaStream] }) => {
      setRemoteStream(remoteMediaStream);
    };

    localRTCConnectionRef.current
      .createOffer()
      .then((offer) => localRTCConnectionRef.current!.setLocalDescription(offer))
      .then(() => {
        socketIO.emit(SocketEvent.ConnectionOfferRequest, peerSocketId, localRTCConnectionRef.current!.localDescription);
      });
  }, [localStream]);


  const handleOfferRequest = useCallback((peerSocketId: string, description: RTCSessionDescriptionInit) => {
    if (!localStream) return;

    remoteRTCConnectionRef.current = new RTCPeerConnection();
    localStream.getTracks().forEach((track) => remoteRTCConnectionRef.current!.addTrack(track, localStream));

    remoteRTCConnectionRef.current!.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socketIO.emit(SocketEvent.ICECandidateRequest, peerSocketId, candidate);
      }
    };

    remoteRTCConnectionRef.current!.ontrack = ({ streams: [remoteMediaStream] }) => {
      setRemoteStream(remoteMediaStream);
    };

    remoteRTCConnectionRef.current
      .setRemoteDescription(description)
      .then(() => remoteRTCConnectionRef.current!.createAnswer())
      .then((answer: RTCSessionDescriptionInit) => remoteRTCConnectionRef.current!.setLocalDescription(answer))
      .then(() => {
        socketIO.emit(SocketEvent.ConnectionOfferResponse, peerSocketId, remoteRTCConnectionRef.current!.localDescription);
      });
  }, [localStream]);

  const handleOfferResponse = useCallback((description: RTCSessionDescriptionInit) => {
    if (localRTCConnectionRef.current) {
      localRTCConnectionRef.current.setRemoteDescription(description);
    }
  }, []);

  const handleCandidateRequest = useCallback((candidate: RTCIceCandidateInit) => {
    const localConnection = localRTCConnectionRef.current;
    const remoteConnection = remoteRTCConnectionRef.current;
    if (localConnection || remoteConnection) {
      const connection = localConnection || remoteConnection;
      connection?.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }, []);

  useEffect(() => {
    socketIO.on(SocketEvent.PeerRefresh, handlePeersRefresh);
    socketIO.on(SocketEvent.ConnectionOfferRequest, handleOfferRequest);
    socketIO.on(SocketEvent.ConnectionOfferResponse, handleOfferResponse);
    socketIO.on(SocketEvent.ICECandidateRequest, handleCandidateRequest);

    return () => {
      socketIO.removeAllListeners();
      socketIO.disconnect();
    };
  }, [handleCandidateRequest, handleOfferRequest, handleOfferResponse, handlePeersRefresh]);

  const streamingContextValue = useMemo<StreamingContextType>(() => {
    const streams = remoteStream ? [remoteStream] : [];
    if (localStream) {
      streams.push(localStream);
    }

    return {
      streams,
      socketId: socketIO.id,
    };
  }, [localStream, remoteStream]);

  return (
    <StreamingContext.Provider value={streamingContextValue}>
      {children}
    </StreamingContext.Provider>
  );
}