import {Body, Controller, HttpStatus, Logger, Post, Res} from '@nestjs/common';
import { SocketGateway } from '../../gateways/socket/socket.gateway';
import {Response} from "express";

@Controller('notifications')
export class NotificationsController {
  logger: Logger = new Logger(NotificationsController.name);

  constructor(private readonly socketGateway: SocketGateway) {}

  @Post()
  notificarATodos(@Body() cuerpo: any, @Res() res: Response) {
    try {
      const notificar = this.socketGateway.handleMessageExternal(cuerpo);
      const code = notificar ? HttpStatus.OK : HttpStatus.BAD_REQUEST;

      const payload = notificar
        ? 'Se ha enviado la notificaicón a todos los clientes'
        : 'No se pudo enviar la notificación, favor de revisar los logs';

      res.status(code).json({
        status: notificar,
        code,
        payload,
      });
    } catch (e) {
      this.logger.log(
        'NotificacionExternaController::notificarATodos::manejadorMensajeExterno::Error: ' +
          e,
      );
      res.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        code: HttpStatus.BAD_REQUEST,
        payload: e,
      });
    }
  }
}
