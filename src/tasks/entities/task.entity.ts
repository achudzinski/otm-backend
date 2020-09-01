import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "tasks"})
export class Task {

    constructor(id:number|null, title: string, completed = false) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ default: false })
    completed: boolean;
}