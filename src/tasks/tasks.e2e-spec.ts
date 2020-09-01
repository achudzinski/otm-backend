import {Test, TestingModule} from '@nestjs/testing';
import {TasksModule} from "./tasks.module";
import {INestApplication} from "@nestjs/common";
import * as request from 'supertest';
import {Task} from "./entities/task.entity";
import {getRepositoryToken} from "@nestjs/typeorm";

describe('Tasks', () => {
    let app: INestApplication;

    const tasks = [
        {id: 1, title: "Task 1", completed: false},
        {id: 2, title: "Task 2", completed: true},
        {id: 3, title: "Task 3", completed: false},
    ];

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [TasksModule],
        })
            .overrideProvider(getRepositoryToken(Task))
            .useFactory({
                factory: () => ({
                    create: jest.fn(async () => tasks[1]),
                    find: jest.fn(async () => tasks),
                    update: jest.fn((id, project2) => new Promise((resolve) => resolve(tasks[1]))),
                    findOne: jest.fn(
                        ({ uuid }) =>
                            new Promise((resolve) => {
                                resolve(tasks[1]);
                            }),
                    ),
                    delete: jest.fn(async (uuid) => { return }),
                    save: jest.fn(
                        (data) =>
                            new Promise((resolve) => {
                                // data = data.uuid === undefined ? data.uuid = uuid() : data;
                                resolve(data);
                            }),
                    ),
                }),
            })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/GET tasks/all`, () => {
        return request(app.getHttpServer())
            .get('/tasks/all')
            .expect(200)
            .expect({ tasks });
    });

    afterAll(async () => {
        await app.close();
    });
});
