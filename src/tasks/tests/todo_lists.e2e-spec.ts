import {Test} from '@nestjs/testing';
import {TasksModule} from "./../tasks.module";
import {INestApplication} from "@nestjs/common";
import * as request from 'supertest';
import {Task} from "./../entities/task.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {TodoList} from "../entities/todo_list.entity";
import {TodoListRepository} from "../repositories/todo_list.repository";

describe('Todo lists', () => {
    let app: INestApplication;
    let todoListRepository: Repository<TodoList>;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TasksModule,
                TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: '127.0.0.1',
                    port: 3041,
                    username: 'root',
                    password: 'root',
                    database: 'orm-tasks-test',
                    entities: [Task, TodoList],
                    synchronize: true,
                }),
            ],
        })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();

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
