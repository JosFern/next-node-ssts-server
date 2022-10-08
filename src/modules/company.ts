export class company {
    public readonly id: number;
    private name: string;
    private allotedleaves: number;
    private overtimelimit: number;

    constructor(id: number, name: string, allotedleaves: number, overtimelimit: number) {
        this.id = id
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
}