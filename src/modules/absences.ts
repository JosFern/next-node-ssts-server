import { insertDB } from "../lib/database/query"
import { v4 as uuidv4 } from 'uuid';

export class absence {
    id: string
    datestart: string
    dateend: string
    employeeID: string

    constructor(id: string | undefined, datestart: string, dateend: string, employeeID: string) {
        this.id = id === undefined ? uuidv4() : id
        this.datestart = datestart
        this.dateend = dateend
        this.employeeID = employeeID
    }

    insertAbsence = async () => {
        const stringFormat = "{ 'id': ?, 'datestart': ?, 'dateend': ?, 'employeeID': ? }"
        const params = [
            { S: this.id },
            { S: this.datestart },
            { S: this.dateend },
            { S: this.employeeID },
        ]
        try {
            await insertDB("Absence", stringFormat, params)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to save");
        }
    }
}