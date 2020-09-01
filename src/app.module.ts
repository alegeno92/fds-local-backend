import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { MqttModule } from 'nest-mqtt';
import { join } from 'path';

import { SensorEntity } from './entities/sensor.entity';
import { ValueEntity } from './entities/value.entity';
import { ActuatorEntity } from './entities/actuator.entity';

import { ActuatorService } from './services/actuator.service';
import { SensorService } from './services/sensor.service';
import { MqttConnectorService } from './services/mqtt-connector.service';

import { AppGateway } from './gateways/app.gateway';
import { ActuatorController } from './controllers/actuator.controller';
import { SensorController } from './controllers/sensor.controller';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      synchronize: true,
      entities: [
        SensorEntity,
        ValueEntity,
        ActuatorEntity,
      ],
    }),
    TypeOrmModule.forFeature([
      SensorEntity,
      ValueEntity,
      ActuatorEntity,
    ]),
    MqttModule.forRoot({
      hostname: process.env.MQTT_HOSTNAME,
      port: parseInt(process.env.MQTT_PORT),
      clientId: process.env.MQTT_CLIENT_ID,
    }),
  ],
  controllers: [ActuatorController, SensorController],
  providers: [AppGateway, ActuatorService, SensorService, MqttConnectorService],
})
export class AppModule {
}
