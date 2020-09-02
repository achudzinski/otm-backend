import {Injectable} from "@nestjs/common";
import {TodoList} from "../entities/todo_list.entity";
import {TodoListRepository} from "../repositories/todo_list.repository";

@Injectable()
export class TodoListsService {
    constructor(private listRepository: TodoListRepository) {
    }

    findAll(): Promise<TodoList[]> {
        return this.listRepository.find({
            order: {
                id: "ASC"
            }
        });
    }

    findOneById(id: number): Promise<TodoList> {
        return this.listRepository.findOne(id);
    }
}
