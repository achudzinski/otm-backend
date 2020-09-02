import config from "../../config";
import {Test} from '@nestjs/testing';
import {TasksModule} from "./../tasks.module";
import {INestApplication} from "@nestjs/common";
import * as request from 'supertest';
import {Task} from "./../entities/task.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {TodoList} from "../entities/todo_list.entity";
import {TodoListRepository} from "../repositories/todo_list.repository";
import testConfig from "./config";

describe('Todo lists', () => {
    let app: INestApplication;
    let todoListRepository: Repository<TodoList>;

    beforeAll(async () => {
        const [application, moduleRef] = await testConfig();
        app = application as INestApplication;

        todoListRepository = moduleRef.get<TodoListRepository>(TodoListRepository);
    });

    beforeEach(async () => {
        await todoListRepository.save([
            new TodoList(1, "List A"), new TodoList(2, "List B")
        ]);
    });

    it(`provides all lists`, async () => {
        await request(app.getHttpServer())
            .get('/todo-lists/all')
            .expect(200)
            .expect({
                lists: [
                    {id: 1, name: "List A"},
                    {id: 2, name: "List B"}
                ]
            });
    });

    afterEach(async () => {
        await todoListRepository.query(`DELETE FROM tasks;`);
    });

    afterAll(async () => {
        await app.close();
    });
});
