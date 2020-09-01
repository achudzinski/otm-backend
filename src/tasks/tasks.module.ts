import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./entities/task.entity";
import {TasksController} from "./tasks.controller";
import {TasksService} from "./tasks.service";
import {TaskRepository} from "./repositories/task.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskRepository])],
  exports: [TypeOrmModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
