import {Test, TestingModule} from "@nestjs/testing";
import {TasksModule} from "../tasks.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import config from "../../config";
import {Task} from "../entities/task.entity";
import {TodoList} from "../entities/todo_list.entity";

export default async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [
            TasksModule,
            TypeOrmModule.forRoot({
                ...config.testDb,
                type: 'mysql',
                entities: [Task, TodoList],
                synchronize: true,
            }),
        ],
    })
        .compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    return [app, moduleRef];
};
