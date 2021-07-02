import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import * as redis from 'redis';
import { RedisContext } from 'redis';
import { KeyService } from '../../keys/key.service';
import { Key } from '../../keys/key';

@WebSocketGateway({ transport: ['websocket'] })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('SocketRedisGateway');

  @WebSocketServer() wss: Server;
  private suscription: RedisContext;
  private publisher: RedisContext;
  private conexiones: any[] = [];

  constructor(private readonly keyService: KeyService) {}

  afterInit(servidor: any) {
    this.suscription = redis.createClient({
      host: this.keyService.getKey(Key.REDIS_HOST),
      port: this.keyService.getKey(Key.REDIS_PORT),
      password: this.keyService.getKey(Key.REDIS_PASSWORD),
    });
    this.publisher = redis.createClient({
      host: this.keyService.getKey(Key.REDIS_HOST),
      port: this.keyService.getKey(Key.REDIS_PORT),
      password: this.keyService.getKey(Key.REDIS_PASSWORD),
    });

    this.suscription.on('subscribe', (channel: any, count: any) => {
      console.log(
        `Server ${process.env.APPID} subscribed successfully to livechat`,
      );
      this.publisher.publish('notifications', `${process.env.APPID} Suscrito`);
    });

    this.suscription.on('message', (channel: any, message: any) => {
      try {
        console.log(
          `Server ${process.env.APPID} received message in channel ${channel} msg: ${message}`,
        );
        this.conexiones.forEach((c) => c.send(`${message}`));
        this.wss.emit('notificationOfServer', `${message}`);
      } catch (error) {
        this.logger.error(`Error::${error}`);
      }
    });

    this.suscription.subscribe('notifications');
  }

  handleConnection(cliente: any, ...args: any[]) {
    this.logger.debug(`Cliente Conectado: ${cliente.id}`);
    this.conexiones.push(cliente);
  }

  handleDisconnect(cliente: any) {
    this.logger.debug(`Cliente Desconectado: ${cliente.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: any[]) {
    try {
      console.log(`${process.env.APPID} Received message ${message[0]}`);
      this.publisher.publish('notifications', message[0]);
    } catch (e) {
      this.logger.error(
        'SocketRedisGateway::SubscribeMessage::handleMessage::publisher::publish' +
          e,
      );
    }
  }

  handleMessageExternal(mensaje: any): boolean {
    try {
      this.publisher.publish('notifications', JSON.stringify(mensaje));
      return true;
    } catch (e) {
      this.logger.error(
        'SocketRedisGateway::SubscribeMessage::handleMessage::publisher::publish' +
          e,
      );
      return false;
    }
  }
}
