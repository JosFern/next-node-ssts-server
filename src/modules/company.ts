import { deleteDB, insertDB, updateDB } from '../lib/database/query';
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

    // updateCompany = (name: string, allotedleaves: number, overtimelimit: number) => {
    //     this.name = name
    //     this.allotedleaves = allotedleaves
    //     this.overtimelimit = overtimelimit
    // }

    insertCompany = async () => {
        const stringFormat = "{ 'id': ?, 'name': ?, 'allocateOvertime': ?, 'allocateLeaves': ? }"
        const params = [
            { S: this.id },
            { S: this.name },
            { N: `${this.overtimelimit}` },
            { N: `${this.allotedleaves}` }
        ]
        try {
            await insertDB("Company", stringFormat, params)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to save");
        }
    }

    updateCompany = async (origName: string) => {

        if (this.name !== origName) {

            deleteDB("Company", this.id, "id", "name", origName)

            const newCompany = new company(this.id, this.name, this.allotedleaves, this.overtimelimit)

            newCompany.insertCompany()

        } else {

            const stringFormat = ` allocateLeaves=${this.allotedleaves}, allocateOvertime=${this.overtimelimit}`

            updateDB("Company", stringFormat, this.id, "id", "name", origName)
        }
    }
}