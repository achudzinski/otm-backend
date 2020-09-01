import {Controller, Get, Inject, Post, Query} from "@nestjs/common";
import {Task} from "./entities/task.entity";
import {TasksService} from "./tasks.service";

@Controller("tasks")
export class TasksController {

    constructor(private readonly taskService:TasksService) {
    }

    @Get("all")
    async getAllTasks():Promise<Task[]> {
        const tasks = await this.taskService.findAllOrdered();
        console.log(tasks);
        return tasks;
    }

    @Post("update-complete")
    async updateCompleteState(@Query() id: number, @Query() completed: boolean): Promise<boolean> {
        await this.taskService.updateComplete(id, completed);
        return true;
    }
}