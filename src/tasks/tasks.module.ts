import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Task} from "./entities/task.entity";
import {TasksController} from "./controllers/tasks.controller";
import {TasksService} from "./services/tasks.service";
import {TaskRepository} from "./repositories/task.repository";
import {ApiService} from "./services/api.service";
import {TodoList} from "./entities/todo_list.entity";
import {TodoListRepository} from "./repositories/todo_list.repository";
import {TodoListsService} from "./services/todo_lists.service";
import {TodoListsController} from "./controllers/todo_lists.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskRepository, TodoList, TodoListRepository])],
  exports: [TypeOrmModule],
  controllers: [TasksController, TodoListsController],
  providers: [TasksService, TodoListsService, ApiService],
})
export class TasksModule {}
