import { insertDB } from "../lib/database/query"
import { v4 as uuidv4 } from 'uuid';

export class leave {
    public readonly id: string
    public readonly datestart: string
    public readonly dateend: string
    public readonly reason: string
    public approved: boolean
    public readonly employeeID: string

    constructor(id: string | undefined, datestart: string, dateend: string, reason: string, approved: boolean, employeeID: string) {
        this.id = id === undefined ? uuidv4() : id
        this.datestart = datestart
        this.dateend = dateend
        this.reason = reason
        this.approved = approved
        this.employeeID = employeeID
    }

    insertLeave = async () => {
        const stringFormat = "{ 'id': ?, 'datestart': ?, 'dateend': ?, 'reason': ?, 'approved': ?, 'employeeID': ? }"
        const params = [
            { S: this.id },
            { S: this.datestart },
            { S: this.dateend },
            { S: this.reason },
            { N: `${this.approved ? 1 : 0}` },
            { S: this.employeeID },
        ]
        try {
            await insertDB("Leave", stringFormat, params)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to save");
        }
    }
}