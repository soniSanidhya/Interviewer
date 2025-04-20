import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";
import '../../index.css';

function VideoCallWindow({ isFullscreen }) {
  const { roomId } = useParams();
  const zegoInstanceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const appId = Number(import.meta.env.VITE_APP_ID);
    const serverSecret = import.meta.env.VITE_SERVER_SECRET;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      Date.now().toString(),
      "UserName123"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zegoInstanceRef.current = zp;

    zp.joinRoom({
      container: containerRef.current,
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
      showPreJoinView: false,
      showTextChat: false,
      showScreenSharingButton: true,
      layout: "Sidebar",
      showLeavingView: false,
      showLeaveRoomConfirmDialog: false,
    });

    // Cleanup logic to destroy instance
    return () => {
      if (zegoInstanceRef.current) {
        zegoInstanceRef.current.destroy();
        zegoInstanceRef.current = null;
      }
    };
  }, [roomId]);

  return (
    <div
      ref={containerRef}
      style={{
        width: isFullscreen ? "100%" : "650px",
        height: isFullscreen ? "95%" : "400px",
        backgroundColor: "#f0f0f0",
        border: "1px solid rgb(104, 55, 184)",
        borderRadius: "10px",
        margin: isFullscreen ? "0" : "0 auto",
      }}
    />
  );
}

export default VideoCallWindow;
