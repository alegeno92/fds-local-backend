import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actuator')
export class ActuatorEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  device: string;

  @Column()
  name: string;

  @Column({default: 'string'})
  type: string;

  @Column()
  value: string;

  @Column({default: true})
  emitValue: boolean;

}
