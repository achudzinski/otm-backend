import {Test, TestingModule} from '@nestjs/testing';
import {TasksModule} from "./tasks.module";
import {INestApplication} from "@nestjs/common";
import * as request from 'supertest';
import {Task} from "./entities/task.entity";
import {getRepositoryToken, TypeOrmModule} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {TaskRepository} from "./repositories/task.repository";

const assertListOfTasks = async (app: INestApplication, tasks:Task[]) => {
    await request(app.getHttpServer())
        .get('/tasks/all')
        .expect(200)
        .expect({
            tasks
        });
}

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
    });

    beforeEach(async () => {
        await tasksRepository.save([
            new Task(1, "Task A"),
            new Task(2, "Task B", true),
            new Task(3, "Task C"),
        ]);
    });

    it(`provides list of all tasks`, async () => {
        await assertListOfTasks(app, [
            {id: 1, title: "Task A", completed: false},
            {id: 2, title: "Task B", completed: true},
            {id: 3, title: "Task C", completed: false},
        ]);
    });

    describe("updating completed status", () => {
        it(`updates completed status on true`, async () => {
            await request(app.getHttpServer())
                .post('/tasks/update-completed')
                .send({
                    id: 3,
                    completed: true,
                })
                .expect(201);

            await assertListOfTasks(app, [
                {id: 1, title: "Task A", completed: false},
                {id: 2, title: "Task B", completed: true},
                {id: 3, title: "Task C", completed: true},
            ]);
        });

        it(`updates completed status on false`, async () => {
            await request(app.getHttpServer())
                .post('/tasks/update-completed')
                .send({
                    id: 2,
                    completed: false,
                })
                .expect(201);

            await assertListOfTasks(app, [
                {id: 1, title: "Task A", completed: false},
                {id: 2, title: "Task B", completed: false},
                {id: 3, title: "Task C", completed: false},
            ]);
        });
    });

    describe("creating task", () => {
        it(`creates new task`, async () => {
            await request(app.getHttpServer())
                .post('/tasks/create')
                .send({
                    "title": "XX",
                })
                .expect(201);

            await assertListOfTasks(app, [
                {id: 1, title: "Task A", completed: false},
                {id: 2, title: "Task B", completed: true},
                {id: 3, title: "Task C", completed: false},
                {id: 4, title: "XX", completed: false},
            ]);
        });

        it(`validates title when creating new task`, async () => {
            await request(app.getHttpServer())
                .post('/tasks/create')
                .send({
                    "title": "",
                })
                .expect(400)
                .expect({
                    message: "Title cannot be blank",
                });

            await assertListOfTasks(app, [
                {id: 1, title: "Task A", completed: false},
                {id: 2, title: "Task B", completed: true},
                {id: 3, title: "Task C", completed: false},
            ]);
        });
    });

    describe("updating task", () => {
        it(`update task`, async () => {
            await request(app.getHttpServer())
                .post('/tasks/update')
                .send({
                    "id": 1,
                    "title": "XX",
                })
                .expect(201);

            await assertListOfTasks(app, [
                {id: 1, title: "XX", completed: false},
                {id: 2, title: "Task B", completed: true},
                {id: 3, title: "Task C", completed: false},
            ]);
        });

        it(`validates if task exists`, async () => {
            await request(app.getHttpServer())
                .post('/tasks/update')
                .send({
                    "id": 10,
                    "title": "XX",
                })
                .expect(400)
                .expect({
                    message: "Task not found",
                });

            await assertListOfTasks(app, [
                {id: 1, title: "Task A", completed: false},
                {id: 2, title: "Task B", completed: true},
                {id: 3, title: "Task C", completed: false},
            ]);
        });

        it(`validates title when updating task`, async () => {
            await request(app.getHttpServer())
                .post('/tasks/update')
                .send({
                    "id": 1,
                    "title": "",
                })
                .expect(400)
                .expect({
                    message: "Title cannot be blank",
                });

            await assertListOfTasks(app, [
                {id: 1, title: "Task A", completed: false},
                {id: 2, title: "Task B", completed: true},
                {id: 3, title: "Task C", completed: false},
            ]);
        });
    });


    afterEach(async () => {
        await tasksRepository.query(`DELETE FROM tasks;`);
        await tasksRepository.query(`ALTER TABLE tasks AUTO_INCREMENT = 4;`);
    });

    afterAll(async () => {
        await app.close();
    });
});
