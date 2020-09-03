import config from "../../config";
import {Test} from '@nestjs/testing';
import {TasksModule} from "./../tasks.module";
import {INestApplication} from "@nestjs/common";
import * as request from 'supertest';
import {Task} from "./../entities/task.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {TaskRepository} from "./../repositories/task.repository";
import {TodoList} from "../entities/todo_list.entity";
import {TodoListRepository} from "../repositories/todo_list.repository";
import testConfig from "./config";

const assertListOfTasks = async (app: INestApplication, tasks:any[], listId: number) => {
    await request(app.getHttpServer())
        .get('/tasks/list/?list=' + listId)
        .expect(200)
        .expect({
            tasks
        });
}

describe('Tasks', () => {
    let app: INestApplication;
    let tasksRepository: Repository<Task>;
    let todoListRepository: Repository<TodoList>;

    beforeAll(async () => {
        const [application, moduleRef] = await testConfig();
        app = application as INestApplication;

        tasksRepository = moduleRef.get<TaskRepository>(TaskRepository);
        todoListRepository = moduleRef.get<TodoListRepository>(TodoListRepository);
    });

    beforeEach(async () => {
        await tasksRepository.query(`DELETE FROM tasks;`);
        await tasksRepository.query(`DELETE FROM todo_lists;`);

        await tasksRepository.query(`ALTER TABLE tasks AUTO_INCREMENT = 6;`);

        const listA = new TodoList(1, "List A");
        const listB = new TodoList(2, "List B");

        await todoListRepository.save([
            listA, listB
        ]);

        await tasksRepository.save([
            new Task(1, "Task A1", listA),
            new Task(2, "Task A2", listA, true),
            new Task(3, "Task A3", listA),
            new Task(4, "Task C1", listB),
            new Task(5, "Task C2", listB, true),
        ]);
    });

    describe("getting list of tasks", () => {
        it(`provides list of all tasks by list`, async () => {
            await assertListOfTasks(app, [
                {id: 1, title: "Task A1", completed: false},
                {id: 2, title: "Task A2", completed: true},
                {id: 3, title: "Task A3", completed: false},
            ], 1);
        });
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
                {id: 1, title: "Task A1", completed: false},
                {id: 2, title: "Task A2", completed: true},
                {id: 3, title: "Task A3", completed: true},
            ], 1);
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
                {id: 1, title: "Task A1", completed: false},
                {id: 2, title: "Task A2", completed: false},
                {id: 3, title: "Task A3", completed: false},
            ], 1);
        });
    });

    describe("creating task", () => {
        it(`creates new task`, async () => {
            await request(app.getHttpServer())
                .post('/tasks/create')
                .send({
                    "title": "XX",
                    "list": 1,
                })
                .expect(201);

            await assertListOfTasks(app, [
                {id: 1, title: "Task A1", completed: false},
                {id: 2, title: "Task A2", completed: true},
                {id: 3, title: "Task A3", completed: false},
                {id: 6, title: "XX", completed: false},
            ], 1);
        });

        it(`validates title when creating new task`, async () => {
            await request(app.getHttpServer())
                .post('/tasks/create')
                .send({
                    "title": "",
                    "list": 1,
                })
                .expect(400)
                .expect({
                    message: "Title cannot be blank",
                });

            await assertListOfTasks(app, [
                {id: 1, title: "Task A1", completed: false},
                {id: 2, title: "Task A2", completed: true},
                {id: 3, title: "Task A3", completed: false},
            ], 1);
        });

        it(`validates list when creating new task`, async () => {
            await request(app.getHttpServer())
                .post('/tasks/create')
                .send({
                    "title": "XX",
                    "list": "5",
                })
                .expect(400)
                .expect({
                    message: "List not found",
                });

            await assertListOfTasks(app, [
                {id: 1, title: "Task A1", completed: false},
                {id: 2, title: "Task A2", completed: true},
                {id: 3, title: "Task A3", completed: false},
            ], 1);
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
                {id: 2, title: "Task A2", completed: true},
                {id: 3, title: "Task A3", completed: false},
            ], 1);
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
                {id: 1, title: "Task A1", completed: false},
                {id: 2, title: "Task A2", completed: true},
                {id: 3, title: "Task A3", completed: false},
            ], 1);
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
                {id: 1, title: "Task A1", completed: false},
                {id: 2, title: "Task A2", completed: true},
                {id: 3, title: "Task A3", completed: false},
            ], 1);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
