import {Injectable} from "@nestjs/common";
import {Task} from "./entities/task.entity";
import {TaskRepository} from "./repositories/task.repository";

@Injectable()
export class TasksService {
    constructor(private tasksRepository: TaskRepository) {
    }

    findAllOrdered(): Promise<Task[]> {
        return this.tasksRepository.find({
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

    async remove(id: string): Promise<void> {
        await this.tasksRepository.delete(id);
    }
}
