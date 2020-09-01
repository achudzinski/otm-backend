import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./tasks/entities/task.entity";
import {TasksModule} from "./tasks/tasks.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3041,
      username: 'root',
      password: 'root',
      database: 'otm-tasks',
      entities: [Task],
      synchronize: true,
    }),
    TasksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
