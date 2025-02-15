import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChat } from "@/hooks/use-chat";

interface MessageInputProps {
  roomId: number;
  username: string;
}

export default function MessageInput({ roomId, username }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const { sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(roomId, username, message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
