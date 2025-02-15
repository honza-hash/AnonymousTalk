import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@shared/schema";

interface MessageListProps {
  roomId: number;
  username: string;
}

export default function MessageList({ roomId, username }: MessageListProps) {
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/rooms", roomId, "messages"],
  });

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.username === username ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.username === username
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <div className="text-sm font-semibold mb-1">{message.username}</div>
              <div className="text-sm">{message.content}</div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
