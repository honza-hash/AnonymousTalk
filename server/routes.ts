import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { type ChatEvent, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  app.get("/api/rooms", async (req, res) => {
    const rooms = await storage.getRooms();
    res.json(rooms);
  });

  app.get("/api/rooms/:id/messages", async (req, res) => {
    const roomId = parseInt(req.params.id);
    const messages = await storage.getMessages(roomId);
    res.json(messages);
  });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", async (data: string) => {
      try {
        const event: ChatEvent = JSON.parse(data);

        if (event.type === "message") {
          // Validate message data against schema
          const messageData = insertMessageSchema.parse({
            roomId: event.roomId,
            content: event.content,
            username: event.username,
          });

          const message = await storage.createMessage(messageData);

          // Broadcast to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "message", message }));
            }
          });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        // Send error back to client
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "error", message: "Failed to send message" }));
        }
      }
    });
  });

  return httpServer;
}