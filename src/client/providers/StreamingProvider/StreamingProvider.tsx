import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { io } from 'socket.io-client';
import { useUserMedia } from "../UserMediaProvider";
import { StreamingContext } from "./StreamingContext";
import { type StreamingContextType } from "./types";

const DEV_SOCKET_SERVER = `http://localhost:3000`;
const SOCKET_URI = process.env.NODE_ENV === 'production' ? window.location.origin : DEV_SOCKET_SERVER;
// const socketIO = io(SOCKET_URI);

export const StreamingProvider: React.FC<PropsWithChildren> = ({ children }): React.ReactElement => {
  const localStream = useUserMedia();
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>(undefined);

  const initConnection = useCallback((stream: MediaStream) => {
    const socket = io(SOCKET_URI);
    let localConnection: RTCPeerConnection;
    let remoteConnection: RTCPeerConnection;

    // Start a RTCPeerConnection to each client
    socket.on('other-users', (otherUsers) => {
      // Ignore when not exists other users connected
      if (!otherUsers || !otherUsers.length) return;

      const socketId = otherUsers[0];

      // Ininit peer connection
      localConnection = new RTCPeerConnection();

      // Add all tracks from stream to peer connection
      stream.getTracks().forEach(track => localConnection.addTrack(track, stream));

      // Send Candidates to establish a channel communication to send stream and data
      localConnection.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit('candidate', socketId, candidate);
        }
      };

      // Receive stream from remote client and add to remote video area
      localConnection.ontrack = ({ streams: [ stream ] }) => {
        setRemoteStream(stream);
      };

      // Create Offer, Set Local Description and Send Offer to other users connected
      localConnection
        .createOffer()
        .then(offer => localConnection.setLocalDescription(offer))
        .then(() => {
          socket.emit('offer', socketId, localConnection.localDescription);
        });
    });

    // Receive Offer From Other Client
    socket.on('offer', (socketId, description) => {
      // Ininit peer connection
      remoteConnection = new RTCPeerConnection();

      // Add all tracks from stream to peer connection
      stream.getTracks().forEach(track => remoteConnection.addTrack(track, stream));

      // Send Candidtates to establish a channel communication to send stream and data
      remoteConnection.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit('candidate', socketId, candidate);
        }
      };

      // Receive stream from remote client and add to remote video area
      remoteConnection.ontrack = ({ streams: [ stream ] }) => {
        setRemoteStream(stream);
      };

      // Set Local And Remote description and create answer
      remoteConnection
        .setRemoteDescription(description)
        .then(() => remoteConnection.createAnswer())
        .then(answer => remoteConnection.setLocalDescription(answer))
        .then(() => {
          socket.emit('answer', socketId, remoteConnection.localDescription);
        });
    });

    // Receive Answer to establish peer connection
    socket.on('answer', (description) => {
      localConnection.setRemoteDescription(description);
    });

    // Receive candidates and add to peer connection
    socket.on('candidate', (candidate) => {
      // GET Local or Remote Connection
      const conn = localConnection || remoteConnection;
      conn.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }, [])

  useEffect(() => {
    if (localStream) {
      initConnection(localStream)
    }
  }, [initConnection, localStream]);

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