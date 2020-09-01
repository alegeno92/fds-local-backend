import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm/index';
import { writeToString } from '@fast-csv/format';
import { ActuatorEntity } from '../entities/actuator.entity';
import { ActuatorDto } from '../controllers/actuator.controller';


@Injectable()
export class ActuatorService {

  constructor(
    @InjectRepository(ActuatorEntity)
    private readonly actuatorRepository: Repository<ActuatorEntity>,
  ) {
  }

  private static flatten(actuator: ActuatorEntity) {
    return {
      device: actuator.device,
      actuator: actuator.name,
      value_type: actuator.type,
      value: actuator.value
    }
  }

  public async getAll() {
    return await this.actuatorRepository.find();
  }

  public async insert(data): Promise<ActuatorEntity> {
    return  await this.getActuatorByDeviceAndName(data['device'], data['actuator']);
  }

  public async getActuatorByDeviceAndName(device: string, sensor: string): Promise<ActuatorEntity> | null {
    const qb = await getRepository(ActuatorEntity)
      .createQueryBuilder('actuator')
      .andWhere('actuator.device = :device')
      .andWhere('actuator.name = :name')
      .setParameter('actuator', device)
      .setParameter('actuator', sensor);

    return await qb.getOne();
  }

  public async createActuator(device: string, actuator: string, value_type: string, value: string): Promise<ActuatorEntity> {
    const newActuator = new ActuatorEntity();
    newActuator.device = device;
    newActuator.name = actuator;
    newActuator.type = value_type;
    newActuator.value = value;
    return await this.actuatorRepository.save(newActuator);
  }

  public async exportAll() {
    const values = await getRepository(ActuatorEntity).find();

    return await writeToString(values.map(value => ActuatorService.flatten(value)), { headers: true });
  }

  public async update(id: number, data: ActuatorDto): Promise<ActuatorEntity> {
    const actuator = await this.actuatorRepository.findOne(id);
    actuator.value = data.value;
    return await this.actuatorRepository.save(actuator);
  }

}
