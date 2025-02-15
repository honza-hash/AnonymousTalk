import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RoomList from "@/components/chat/room-list";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";
import UsernameModal from "@/components/chat/username-modal";
import { useChat } from "@/hooks/use-chat";

export default function Chat() {
  const [username, setUsername] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number>(1);
  const { connectToChat } = useChat();

  useEffect(() => {
    if (username) {
      connectToChat(username);
    }
  }, [username]);

  if (!username) {
    return <UsernameModal onSubmit={setUsername} />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Card className="m-4 p-4 flex-1 grid grid-cols-[250px_1fr] gap-4 max-w-6xl mx-auto">
        <div className="flex flex-col">
          <RoomList selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} />
        </div>
        <Separator orientation="vertical" className="mx-2" />
        <div className="flex flex-col h-[calc(100vh-2rem)]">
          <MessageList roomId={selectedRoomId} username={username} />
          <MessageInput roomId={selectedRoomId} username={username} />
        </div>
      </Card>
    </div>
  );
}
