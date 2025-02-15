import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull().references(() => rooms.id),
  content: text("content").notNull(),
  username: text("username").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertRoomSchema = createInsertSchema(rooms).pick({
  name: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  roomId: true,
  content: true,
  username: true,
});

export type Room = typeof rooms.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type ChatEvent = {
  type: "message";
  roomId: number;
  username: string;
  content: string;
} | {
  type: "join_room";
  roomId: number;
  username: string;
};