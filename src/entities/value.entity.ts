import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { JoinColumn, ManyToOne } from 'typeorm/index';
import { SensorEntity } from './sensor.entity';

@Entity('value')
export class ValueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: 1})
  timestamp: number;

  @Column({type: 'text'})
  value: string;

  @Column({nullable: false})
  sensorId: number;

  @ManyToOne(type => SensorEntity, sensor => sensor.values, {nullable: false})
  @JoinColumn({name: 'sensorId'})
  sensor!: SensorEntity;


}
