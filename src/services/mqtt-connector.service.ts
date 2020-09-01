import { Injectable, Logger } from '@nestjs/common';
import { AppGateway } from '../gateways/app.gateway';
import { Payload, Subscribe } from 'nest-mqtt';
import { SensorService } from './sensor.service';

@Injectable()
export class MqttConnectorService {

  constructor(
    private appGateway: AppGateway,
    private sensorService: SensorService,
  ) {
  }

  @Subscribe('/sensors')
  async sensors(@Payload() data) {
    await this.sensorService.insert(data);
    this.appGateway.sendBroadcastMessage('sensors', data);
  }
}
