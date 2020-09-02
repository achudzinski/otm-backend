import config from "./config";
import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./tasks/entities/task.entity";
import {TasksModule} from "./tasks/tasks.module";
import {TodoList} from "./tasks/entities/todo_list.entity";


@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.db,
      type: 'mysql',
      entities: [Task, TodoList],
      synchronize: true,
    }),
    TasksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
