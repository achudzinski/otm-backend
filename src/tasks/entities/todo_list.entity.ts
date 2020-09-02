import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "todo_lists"})
export class TodoList {

    constructor(id:number|null, name: string) {
        this.id = id;
        this.name = name;
    }
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}