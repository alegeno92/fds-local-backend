import { Body, Controller, Get, Header, HttpCode, HttpStatus, Inject, Logger, Param, Post, Put } from '@nestjs/common';
import { ActuatorService } from '../services/actuator.service';
import { MqttService } from 'nest-mqtt';

export interface ActuatorDto {
  device: string;
  name: string;
  type: string;
  value: string;
}

@Controller()
export class ActuatorController {

  constructor(
    @Inject(MqttService) private readonly mqttService: MqttService,
    private actuatorService: ActuatorService,
  ) {
  }

  @Get('/actuators')
  async getAll() {
    return await this.actuatorService.getAll();
  }

  @Put('/actuators/:id')
  async update(@Param('id') id: number, @Body() actuatorDto: ActuatorDto) {
    const actuator = await this.actuatorService.update(id, actuatorDto);
    if (actuator.emitValue) {
      await this.mqttService.publish('/actuators', actuator);
    }
  }

  @Post('/actuators/export')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/csv')
  @Header('Content-Disposition', 'attachment; filename="export.csv"')
  async export() {
    return this.actuatorService.exportAll();
  }

}
