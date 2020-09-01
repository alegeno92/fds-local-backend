import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { JoinColumn, OneToMany } from 'typeorm/index';
import { ValueEntity } from './value.entity';

@Entity('sensor')
export class SensorEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device: string;

  @Column()
  name: string;

  @Column({default: 'string'})
  type: string;

  @OneToMany(type => ValueEntity, value => value.sensor, { nullable: false})
  @JoinColumn()
  values: ValueEntity[];
}
