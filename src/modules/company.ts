import { v4 as uuidv4 } from 'uuid';

export class company {
    public readonly id: string;
    private name: string;
    private allotedleaves: number;
    private overtimelimit: number;

    constructor(id: string | undefined, name: string, allotedleaves: number, overtimelimit: number) {
        this.id = (id === undefined) ? uuidv4() : id
        this.name = name
        this.allotedleaves = allotedleaves
        this.overtimelimit = overtimelimit
    }

    getName = () => {
        return this.name
    }

    getAllotedLeaves = () => {
        return this.allotedleaves
    }

    getOvertimeLimit = () => {
        return this.overtimelimit
    }

    updateCompany = (name: string, allotedleaves: number, overtimelimit: number) => {
        this.name = name
        this.allotedleaves = allotedleaves
        this.overtimelimit = overtimelimit
    }
}