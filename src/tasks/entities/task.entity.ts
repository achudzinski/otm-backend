import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {TodoList} from "./todo_list.entity";

@Entity({name: "tasks"})
export class Task {

    constructor(id:number|null, title: string, list: TodoList, completed = false) {
        this.id = id;
        this.title = title;
        this.list = list;
        this.completed = completed;
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: false })
    completed: boolean;

    @ManyToOne(type => TodoList)
    list: TodoList;
}