import { type Room, type Message, type InsertRoom, type InsertMessage } from "@shared/schema";

export interface IStorage {
  getRooms(): Promise<Room[]>;
  getRoom(id: number): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  getMessages(roomId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private rooms: Map<number, Room>;
  private messages: Map<number, Message[]>;
  private currentRoomId: number;
  private currentMessageId: number;

  constructor() {
    this.rooms = new Map();
    this.messages = new Map();
    this.currentRoomId = 1;
    this.currentMessageId = 1;

    // Create default room
    this.createRoom({ name: "General" });
  }

  async getRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoom(id: number): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async createRoom(insertRoom: InsertRoom): Promise<Room> {
    const id = this.currentRoomId++;
    const room: Room = { id, ...insertRoom };
    this.rooms.set(id, room);
    this.messages.set(id, []);
    return room;
  }

  async getMessages(roomId: number): Promise<Message[]> {
    return this.messages.get(roomId) || [];
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      id,
      ...insertMessage,
      timestamp: new Date(),
    };
    const roomMessages = this.messages.get(insertMessage.roomId) || [];
    roomMessages.push(message);
    this.messages.set(insertMessage.roomId, roomMessages);
    return message;
  }
}

export const storage = new MemStorage();
