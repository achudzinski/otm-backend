import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./entities/task.entity";
import {TasksController} from "./tasks.controller";
import {TasksService} from "./tasks.service";
import {TaskRepository} from "./repositories/task.repository";
import {ApiService} from "./api.service";
import {TodoList} from "./entities/todo_list.entity";
import {TodoListRepository} from "./repositories/todo_list.repository";
import {TodoListsService} from "./todo_lists.service";

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskRepository, TodoList, TodoListRepository])],
  exports: [TypeOrmModule],
  controllers: [TasksController],
  providers: [TasksService, TodoListsService, ApiService],
})
export class TasksModule {}
