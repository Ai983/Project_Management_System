import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // You can authenticate here if needed
    // For now, just log connection
    // Optionally, store userId <-> socketId mapping
  }

  handleDisconnect(client: Socket) {
    // Clean up if needed
  }

  sendNotification(userId: string, notification: any) {
    // Emit to a specific user room
    this.server.to(userId).emit('notification', notification);
  }

  joinUserRoom(client: Socket, userId: string) {
    client.join(userId);
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId);
  }
} 