import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useRef } from "react";
import type { Message, ChatEvent } from "@shared/schema";

export function useChat() {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  const connectToChat = useCallback((username: string) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        const message = data.message as Message;
        queryClient.setQueryData(
          ["/api/rooms", message.roomId, "messages"],
          (old: Message[] = []) => [...old, message]
        );
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
    };
  }, [queryClient]);

  const sendMessage = useCallback((roomId: number, username: string, content: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const event: ChatEvent = {
        type: "message",
        roomId,
        username,
        content,
      };
      socketRef.current.send(JSON.stringify(event));
    }
  }, []);

  return {
    isConnected,
    connectToChat,
    sendMessage,
  };
}
