import { Body, Controller, Get, Header, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { SensorService } from '../services/sensor.service';

interface ExportSensorDto{
  clear: boolean
}

@Controller()
export class SensorController {

  constructor(
      private sensorService: SensorService
  ) {
  }

  @Get('/sensors')
  async getAll() {
    return await this.sensorService.getAll();
  }

  @Post('/sensors/export')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/csv')
  @Header('Content-Disposition', 'attachment; filename="export.csv"')
  async export(@Body() data: ExportSensorDto) {
    return this.sensorService.exportAllValues(data.clear)
  }

}
