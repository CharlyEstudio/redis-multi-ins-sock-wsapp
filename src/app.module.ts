import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NotificationsController } from './controllers/notifications/notifications.controller';
import { SocketGateway } from './gateways/socket/socket.gateway';
import { KeyService } from './keys/key.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [NotificationsController],
  providers: [SocketGateway, KeyService],
})
export class AppModule {}
