import {Body, Controller, Get, HttpStatus, Inject, Post, Query, Res} from "@nestjs/common";
import {Task} from "./entities/task.entity";
import {TasksService} from "./tasks.service";
import {ApiService, ValidationErrorResponse} from "./api.service";

@Controller("tasks")
export class TasksController {

    constructor(
        private readonly taskService:TasksService,
        private readonly api:ApiService
    ) {
    }

    @Get("all")
    async getAllTasks():Promise<{tasks: Task[]}> {
        const tasks = await this.taskService.findAllOrdered();
        return {tasks};
    }

    @Post("update-completed")
    async updateCompletedState(@Body("id") id: number, @Body("completed") completed: boolean): Promise<void> {
        await this.taskService.updateCompleted(id, completed);
    }

    @Post("create")
    async create(@Res() res, @Body("title") title: string): Promise<{task: Task}|ValidationErrorResponse> {
        if (title.trim() == "") {
            res.status(HttpStatus.BAD_REQUEST)
                .send(this.api.createValidationErrorResponse("Title cannot be blank"));
            return;
        }

        const task = new Task(null, title);
        await this.taskService.create(task);

        res.status(HttpStatus.CREATED)
            .send({task});
    }
}