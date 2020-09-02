import {Injectable} from "@nestjs/common";
import {Task} from "../entities/task.entity";
import {TaskRepository} from "../repositories/task.repository";
import {TodoList} from "../entities/todo_list.entity";

@Injectable()
export class TasksService {
    constructor(private tasksRepository: TaskRepository) {
    }

    findByList(list:TodoList): Promise<Task[]> {
        return this.tasksRepository.find({
            where: {
                list: list
            },
            order: {
                id: "ASC"
            }
        });
    }

    findOneById(id: number): Promise<Task> {
        return this.tasksRepository.findOne(id);
    }

    async updateCompleted(id: number, completed:boolean): Promise<void> {
        const task = await this.findOneById(id);
        if (task) {
            task.completed = completed;
            await this.tasksRepository.save(task);
        }
    }

    async create(task: Task): Promise<void> {
        await this.tasksRepository.save(task);
    }

    async update(task: Task, title: string): Promise<void> {
        task.title = title;
        await this.tasksRepository.save(task);
    }

    async remove(id: string): Promise<void> {
        await this.tasksRepository.delete(id);
    }
}
