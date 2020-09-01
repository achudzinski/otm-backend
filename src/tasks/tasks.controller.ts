import {Body, Controller, Get, Inject, Post, Query} from "@nestjs/common";
import {Task} from "./entities/task.entity";
import {TasksService} from "./tasks.service";

@Controller("tasks")
export class TasksController {

    constructor(private readonly taskService:TasksService) {
    }

    @Get("all")
    async getAllTasks():Promise<{tasks: Task[]}> {
        const tasks = await this.taskService.findAllOrdered();
        return {tasks};
    }

    @Post("update-completed")
    async updateCompletedState(@Body("id") id: number, @Body("completed") completed: boolean): Promise<void> {
        console.log(id, completed);
        await this.taskService.updateCompleted(id, completed);
    }
}