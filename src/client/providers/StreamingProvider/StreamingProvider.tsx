import { useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { io } from 'socket.io-client';
import { StreamingContext } from "./StreamingContext";
import { useUserMedia } from "../UserMediaProvider";
import { SocketEvent, type StreamingContextType, type WelcomeResponse } from "./types";

const DEV_SOCKET_SERVER = `http://localhost:3000`;
const SOCKET_URI = process.env.NODE_ENV === 'production' ? window.location.origin : DEV_SOCKET_SERVER;
const socketIO = io(SOCKET_URI);

export const StreamingProvider: React.FC<PropsWithChildren> = ({ children }): React.ReactElement => {
  const localConnectionsMapRef = useRef(new Map<string, RTCPeerConnection>())
  const remoteConnectionsMapRef = useRef(new Map<string, RTCPeerConnection>())

  const localStream = useUserMedia();
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const [socketId, setSocketId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<string[]>([]);
  const [peers, setPeers] = useState<string[]>([]);

  const handleWelcomeResponse = useCallback((response: WelcomeResponse) => {
    console.log('Connected to Socket.IO server!');
    setSocketId(response.socketId);
    setRooms(response.rooms);
  }, [setSocketId, setRooms]);

  const joinRoom = useCallback((name: string, room?: string) => {
    const user = { socketId, name };
    socketIO.emit(SocketEvent.ChannelJoinRequest, { user, room });
  }, [socketId]);

  useEffect(() => {
    if (peers.length > 0 && localStream) {
      const remoteStreams: MediaStream[] = [];

      peers.forEach((peerSocketId) => {
        const localConnection = new RTCPeerConnection();
        localStream.getTracks().forEach((track) => {
          localConnection.addTrack(track, localStream);
        });

        localConnection.onicecandidate = ({ candidate }) => {
          if(candidate) {
            socketIO.emit(SocketEvent.ICECandidateRequest, peerSocketId, candidate);
          }
        };

        localConnection.ontrack = ({ streams: [stream] }) => {
          remoteStreams.push(stream);
        };

        localConnection
          .createOffer()
          .then((offer: RTCSessionDescriptionInit) => localConnection.setLocalDescription(offer))
          .then(() => {
            socketIO.emit(SocketEvent.ConnectionOfferRequest, peerSocketId, localConnection.localDescription);
          });

        localConnectionsMapRef.current.set(peerSocketId, localConnection);
      });

      setRemoteStreams(remoteStreams);
    }
  }, [localStream, peers]);

  const handleOfferRequest = useCallback((peerSocketId: string, description: RTCSessionDescriptionInit) => {
    const remoteConnection = new RTCPeerConnection();
    localStream?.getTracks().forEach((track) => remoteConnection.addTrack(track, localStream));

    remoteConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socketIO.emit(SocketEvent.ICECandidateRequest, peerSocketId, candidate);
      }
    };

    remoteConnection.ontrack = ({ streams: [stream] }) => {
      setRemoteStreams((remoteStreams) => {
        const filteredStreams = remoteStreams.filter((remoteStream) => remoteStream.id !== stream.id);
        return [stream, ...filteredStreams];
      });
    };

    remoteConnection
      .setRemoteDescription(description)
      .then(() => remoteConnection.createAnswer())
      .then((answer: RTCSessionDescriptionInit) => remoteConnection.setLocalDescription(answer))
      .then(() => {
        socketIO.emit(SocketEvent.ConnectionOfferResponse, peerSocketId, remoteConnection.localDescription);
      });

    remoteConnectionsMapRef.current.set(peerSocketId, remoteConnection);
  }, [localStream]);

  const handleOfferResponse = useCallback((peerSocketId: string, description: RTCSessionDescriptionInit) => {
    const localConnection = localConnectionsMapRef.current.get(peerSocketId);
    if (localConnection) {
      localConnection.setRemoteDescription(description);
    }
  }, []);

  const handleCandidateRequest = useCallback((peerSocketId: string, candidate: RTCIceCandidateInit) => {
    const localConnection = localConnectionsMapRef.current.get(peerSocketId);
    const remoteConnection = remoteConnectionsMapRef.current.get(peerSocketId);
    if (localConnection || remoteConnection) {
      const connection = localConnection || remoteConnection;
      connection?.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }, []);

  useEffect(() => {
    socketIO.on(SocketEvent.WelcomeResponse, handleWelcomeResponse);
    socketIO.on(SocketEvent.ChannelJoinResponse, ({ peers }) => setPeers(peers));
    socketIO.on(SocketEvent.ConnectionOfferRequest, handleOfferRequest);
    socketIO.on(SocketEvent.ConnectionOfferResponse, handleOfferResponse);
    socketIO.on(SocketEvent.ICECandidateRequest, handleCandidateRequest);

    return () => {
      socketIO.removeAllListeners();
      socketIO.disconnect();
    };
  }, [handleOfferRequest, handleOfferResponse, handleWelcomeResponse, handleCandidateRequest]);

  const streamingContextValue = useMemo<StreamingContextType>(() => {
    const streams = remoteStreams;
    if (localStream) {
      streams.push(localStream);
    }

    return {
      socketId,
      rooms,
      peers,
      joinRoom,
      streams,
    };
  }, [socketId, rooms, peers, joinRoom, localStream, remoteStreams]);

  return (
    <StreamingContext.Provider value={streamingContextValue}>
      {children}
    </StreamingContext.Provider>
  );
}