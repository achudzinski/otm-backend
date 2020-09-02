import {Body, Controller, Get, HttpStatus, Inject, Post, Query, Res} from "@nestjs/common";
import {Task} from "./entities/task.entity";
import {TasksService} from "./tasks.service";
import {ApiService, ValidationErrorResponse} from "./api.service";
import {take} from "rxjs/operators";
import {TodoListsService} from "./todo_lists.service";

@Controller("tasks")
export class TasksController {

    constructor(
        private readonly taskService:TasksService,
        private readonly todoListsService:TodoListsService,
        private readonly api:ApiService
    ) {
    }

    @Get("list")
    async getTasksByList(@Query("list") listId:string):Promise<{tasks: Task[]}> {
        const list = await this.todoListsService.findOneById(parseInt(listId));
        if (!list) {
            return { tasks: [] };
        }

        const tasks = await this.taskService.findByList(list);
        return {tasks};
    }

    @Post("update-completed")
    async updateCompletedState(@Body("id") id: number, @Body("completed") completed: boolean): Promise<void> {
        await this.taskService.updateCompleted(id, completed);
    }

    @Post("create")
    async create(@Res() res, @Body("title") title: string, @Body("list") listId: string): Promise<{task: Task}|ValidationErrorResponse> {
        const list = await this.todoListsService.findOneById(parseInt(listId));
        if (!list) {
            res
                .status(HttpStatus.BAD_REQUEST)
                .send(this.api.createValidationErrorResponse("List not found"));
            return;
        }

        if (title.trim() == "") {
            res
                .status(HttpStatus.BAD_REQUEST)
                .send(this.api.createValidationErrorResponse("Title cannot be blank"));
            return;
        }

        const task = new Task(null, title, list);
        await this.taskService.create(task);

        res
            .status(HttpStatus.CREATED)
            .send({task});
    }

    @Post("update")
    async update(@Res() res, @Body("id") id: number, @Body("title") title: string): Promise<{task: Task}|ValidationErrorResponse> {
        const task = await this.taskService.findOneById(id);
        if (!task) {
            res.status(HttpStatus.BAD_REQUEST)
                .send(this.api.createValidationErrorResponse("Task not found"));
            return;
        }

        if (title.trim() == "") {
            res.status(HttpStatus.BAD_REQUEST)
                .send(this.api.createValidationErrorResponse("Title cannot be blank"));
            return;
        }

        await this.taskService.update(
            task,
            title
        );

        res.status(HttpStatus.CREATED)
            .send({task});
    }
}