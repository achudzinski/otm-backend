import {Controller, Get} from "@nestjs/common";
import {TodoListsService} from "../services/todo_lists.service";
import {TodoList} from "../entities/todo_list.entity";

@Controller("todo-lists")
export class TodoListsController {

    constructor(private readonly todoListsService:TodoListsService) {
    }

    @Get("all")
    async getAll():Promise<{lists: TodoList[]}> {
        const lists = await this.todoListsService.findAll();
        return {lists};
    }
}