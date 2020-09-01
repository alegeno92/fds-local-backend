import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm/index';
import { writeToString } from '@fast-csv/format';
import { SensorEntity } from '../entities/sensor.entity';
import { ValueEntity } from '../entities/value.entity';


@Injectable()
export class SensorService {

  constructor(
    @InjectRepository(SensorEntity)
    private readonly sensorRepository: Repository<SensorEntity>,
    @InjectRepository(ValueEntity)
    private readonly valueRepository: Repository<ValueEntity>,
  ) {
  }

  private static flatten(value: ValueEntity) {
    return {
      device: value.sensor.device,
      sensor: value.sensor.name,
      value_type: value.sensor.type,
      timestamp: value.timestamp,
      value: value.value,
    };
  }

  public async getAll() {
    return await this.sensorRepository.find();
  }

  public async insert(data): Promise<SensorEntity> {

    const sensor = await this.getSensorByDeviceAndName(data['device'], data['sensor']);

    if (sensor !== undefined) {
      await this.insertValue(sensor, data['timestamp'], data['value']);
      return sensor;
    }

    const newSensor = await this.createSensor(data['device'], data['sensor'], data['value_type']);
    await this.insertValue(sensor, data['timestamp'], data['value']);

    return newSensor;

  }


  public async getSensorByDeviceAndName(device: string, sensor: string): Promise<SensorEntity> | null {
    const qb = await getRepository(SensorEntity)
      .createQueryBuilder('sensor')
      .leftJoinAndSelect('sensor.values', 'values')
      .andWhere('sensor.device = :device')
      .andWhere('sensor.name = :name')
      .setParameter('device', device)
      .setParameter('name', sensor);

    return await qb.getOne();
  }

  public async insertValue(sensor: SensorEntity, timestamp: number, value: string): Promise<ValueEntity> {
    const newValue = new ValueEntity();
    newValue.timestamp = timestamp;
    newValue.value = value;
    newValue.sensorId = sensor.id;

    try {
      return await this.valueRepository.save(newValue);
    } catch (e) {
      console.log(e);
    }
  }

  public async createSensor(device: string, sensor: string, value_type: string): Promise<SensorEntity> {
    const newSensor = new SensorEntity();
    newSensor.device = device;
    newSensor.name = sensor;
    newSensor.type = value_type;
    newSensor.values = [];
    return await this.sensorRepository.save(newSensor);
  }


  public async exportAllValues(clearTables: boolean) {
    const values = await getRepository(ValueEntity).find({
      order: {
        timestamp: 'DESC',
      },
      relations: ['sensor'],
    });

    if (clearTables && values.length > 0) {
      console.log(clearTables);
      const greater = values[0];
      await this.deleteAll(greater.timestamp);
    }
    return await writeToString(values.map(value => SensorService.flatten(value)), { headers: true });
  }

  private async deleteAll(timestamp: number) {
    await this.valueRepository.createQueryBuilder()
      .delete()
      .where('timestamp < :timestamp')
      .setParameter('timestamp', timestamp - 10)
      .execute();
  }

}
