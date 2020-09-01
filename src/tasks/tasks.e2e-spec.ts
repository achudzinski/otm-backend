import {Test, TestingModule} from '@nestjs/testing';
import {TasksModule} from "./tasks.module";
import {INestApplication} from "@nestjs/common";
import * as request from 'supertest';
import {Task} from "./entities/task.entity";
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {TaskRepository} from "./repositories/task.repository";

describe('Tasks', () => {
    let app: INestApplication;
    let tasksRepository: Repository<Task>;

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
                    entities: [Task],
                    synchronize: true,
                }),
            ],
        })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();

        tasksRepository = moduleRef.get<TaskRepository>(TaskRepository);

        await tasksRepository.save([
            new Task(1, "Task A"),
            new Task(2, "Task B", true),
            new Task(3, "Task C"),
        ]);
    });

    it(`provides list of all tasks`, async () => {
        await request(app.getHttpServer())
            .get('/tasks/all')
            .expect(200)
            .expect({
                tasks: [
                    {id: 1, title: "Task A", completed: false},
                    {id: 2, title: "Task B", completed: true},
                    {id: 3, title: "Task C", completed: false},
                ]
            });
    });

    it(`updates completed status on true`, async () => {
        await request(app.getHttpServer())
            .post('/tasks/update-completed')
            .send({
                id: 3,
                completed: true,
            })
            .expect(201);

        await request(app.getHttpServer())
            .get('/tasks/all')
            .expect(200)
            .expect({
                tasks: [
                    {id: 1, title: "Task A", completed: false},
                    {id: 2, title: "Task B", completed: true},
                    {id: 3, title: "Task C", completed: true},
                ]
            });

    });

    it(`updates completed status on false`, async () => {
        await request(app.getHttpServer())
            .post('/tasks/update-completed')
            .send({
                id: 2,
                completed: false,
            })
            .expect(201);

        await request(app.getHttpServer())
            .get('/tasks/all')
            .expect(200)
            .expect({
                tasks: [
                    {id: 1, title: "Task A", completed: false},
                    {id: 2, title: "Task B", completed: false},
                    {id: 3, title: "Task C", completed: false},
                ]
            });
    });

    afterAll(async () => {
        await tasksRepository.query(`DELETE FROM tasks;`);

        await app.close();
    });
});
