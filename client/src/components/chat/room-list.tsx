import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Room } from "@shared/schema";

interface RoomListProps {
  selectedRoomId: number;
  onSelectRoom: (roomId: number) => void;
}

export default function RoomList({ selectedRoomId, onSelectRoom }: RoomListProps) {
  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-4">Rooms</h2>
      {rooms.map((room) => (
        <Button
          key={room.id}
          variant={room.id === selectedRoomId ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelectRoom(room.id)}
        >
          # {room.name}
        </Button>
      ))}
    </div>
  );
}
