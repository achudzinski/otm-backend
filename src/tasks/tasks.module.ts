import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./entities/task.entity";
import {TasksController} from "./tasks.controller";
import {TasksService} from "./tasks.service";
import {TaskRepository} from "./repositories/task.repository";
import {ApiService} from "./api.service";

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskRepository])],
  exports: [TypeOrmModule],
  controllers: [TasksController],
  providers: [TasksService, ApiService],
})
export class TasksModule {}
