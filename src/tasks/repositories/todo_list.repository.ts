import {EntityRepository, Repository} from "typeorm";
import {TodoList} from "../entities/todo_list.entity";

@EntityRepository(TodoList)
export class TodoListRepository extends Repository<TodoList> {} {

}