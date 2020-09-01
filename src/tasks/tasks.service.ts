import {Injectable} from "@nestjs/common";
import {Task} from "./entities/task.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) {}

    findAllOrdered(): Promise<Task[]> {
        return this.tasksRepository.find();
        //{
        //             order: {
        //                 id: "ASC"
        //             }
        //         }
    }

    findOneById(id: number): Promise<Task> {
        return this.tasksRepository.findOne(id);
    }

    async updateComplete(id: number, completed:boolean): Promise<void> {
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
