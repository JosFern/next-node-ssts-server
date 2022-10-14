import { deleteDB, insertDB, updateDB } from '../lib/database/query';
import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from './dbOperations';

export class company extends dbOperations {
    public readonly id: string;
    private name: string;
    private allotedleaves: number;
    private overtimelimit: number;
    private readonly TABLE = 'Company'

    constructor(id: string | undefined, name: string, allotedleaves: number, overtimelimit: number) {
        super()
        this.id = (id === undefined) ? uuidv4() : id
        this.name = name
        this.allotedleaves = allotedleaves
        this.overtimelimit = overtimelimit

        this.assignData({
            id: this.id,
            name: this.name,
            allocateLeaves: this.allotedleaves,
            allocateOvertime: this.overtimelimit,
            TABLE: this.TABLE
        })
    }

    getName = () => this.name

    getAllotedLeaves = () => this.allotedleaves

    getOvertimeLimit = () => this.overtimelimit
}