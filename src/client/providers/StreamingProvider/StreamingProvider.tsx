import { useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { io } from 'socket.io-client';
import { useUserMedia } from "../UserMediaProvider";
import { StreamingContext } from "./StreamingContext";
import { SocketEvent, type StreamingContextType } from "./types";

const DEV_SOCKET_SERVER = `http://localhost:3000`;
const SOCKET_URI = process.env.NODE_ENV === 'production' ? window.location.origin : DEV_SOCKET_SERVER;

export const StreamingProvider: React.FC<PropsWithChildren> = ({ children }): React.ReactElement => {
  const localPeerConnectionRef = useRef<RTCPeerConnection>(null);
  const remotePeerConnectionRef = useRef<RTCPeerConnection>(null);

  const { stream: localStream, name} = useUserMedia();
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>(undefined);

  const bootstrapRTCConnection = useCallback((localStream: MediaStream) => {
    const socketIo = io(SOCKET_URI);

    // Start a RTCPeerConnection to each client
    socketIo.on(SocketEvent.PeerRefresh, (peers) => {
      if (!Array.isArray(peers) || peers.length <= 1) return;

      const peerSocketId = peers[0];

      // Initialize peer connection
      localPeerConnectionRef.current = new RTCPeerConnection();

      // Add all tracks from stream to peer connection
      localStream.getTracks().forEach((track) => localPeerConnectionRef.current!.addTrack(track, localStream));

      // Send Candidates to establish a channel communication to send stream and data
      localPeerConnectionRef.current.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socketIo.emit(SocketEvent.ICECandidateSignal, peerSocketId, candidate, name);
        }
      };

      // Receive stream from remote client and add to remote stream object
      localPeerConnectionRef.current.ontrack = ({ streams: [stream] }) => {
        setRemoteStream(stream);
      };

      // Create Offer, set Local Description and send Offer to other users connected
      localPeerConnectionRef.current
        .createOffer()
        .then((offer) => localPeerConnectionRef.current!.setLocalDescription(offer))
        .then(() => {
          socketIo.emit(SocketEvent.ConnectionOfferRequest, peerSocketId, localPeerConnectionRef.current!.localDescription);
        });
    });

    // Receive Offer from other client
    socketIo.on(SocketEvent.ConnectionOfferRequest, (socketId, description) => {
      // Initialize peer connection
      remotePeerConnectionRef.current = new RTCPeerConnection();

      // Add all tracks from stream to peer connection
      localStream.getTracks().forEach((track) => remotePeerConnectionRef.current!.addTrack(track, localStream));

      // Send Candidates to establish a channel communication to send stream and data
      remotePeerConnectionRef.current.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socketIo.emit(SocketEvent.ICECandidateSignal, socketId, candidate, name);
        }
      };

      // Receive stream from remote client and add to remote video area
      remotePeerConnectionRef.current.ontrack = ({ streams: [stream] }) => {
        setRemoteStream(stream);
      };

      // Set Local And Remote description and create answer
      remotePeerConnectionRef.current
        .setRemoteDescription(description)
        .then(() => remotePeerConnectionRef.current!.createAnswer())
        .then((answer) => remotePeerConnectionRef.current!.setLocalDescription(answer))
        .then(() => {
          socketIo.emit(SocketEvent.ConnectionOfferReply, socketId, remotePeerConnectionRef.current!.localDescription);
        });
    });

    // Receive Answer to establish peer connection
    socketIo.on(SocketEvent.ConnectionOfferReply, (description: RTCSessionDescription) => {
      if (localPeerConnectionRef.current) {
        localPeerConnectionRef.current.setRemoteDescription(description);
      }
    });

    // Receive candidates and add to peer connection
    socketIo.on(SocketEvent.ICECandidateSignal, (candidate) => {
      const connection = localPeerConnectionRef.current || remotePeerConnectionRef.current;
      if (connection) {
        connection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  }, [name]);

  useEffect(() => {
    if (localStream && name) {
      bootstrapRTCConnection(localStream)
    }
  }, [bootstrapRTCConnection, localStream, name]);

  const streamingContextValue = useMemo<StreamingContextType>(() => {
    const streams = remoteStream ? [remoteStream] : [];
    if (localStream) {
      streams.push(localStream);
    }

    return {
      streams,
      socketId: '',
    };
  }, [localStream, remoteStream]);

  return (
    <StreamingContext.Provider value={streamingContextValue}>
      {children}
    </StreamingContext.Provider>
  );
}