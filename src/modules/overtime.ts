import { insertDB, updateDB } from '../lib/database/query';
import { v4 as uuidv4 } from 'uuid';

export class overtime {
    public readonly id: string
    public readonly datehappen: string
    public readonly timestart: string
    public readonly timeend: string
    public readonly reason: string
    public approved: boolean
    public readonly employeeID: string

    constructor(id: string | undefined, datehappen: string, timestart: string, timeend: string, reason: string, approved: boolean, employeeID: string) {
        this.id = id === undefined ? uuidv4() : id
        this.datehappen = datehappen
        this.timestart = timestart
        this.timeend = timeend
        this.reason = reason
        this.approved = approved
        this.employeeID = employeeID
    }

    insertOvertime = async () => {
        const stringFormat = "{ 'id': ?, 'date': ?, 'timestart': ?, 'timeend': ?, 'reason': ?, 'approved': ?, 'employeeID': ? }"
        const params = [
            { S: this.id },
            { S: this.datehappen },
            { S: this.timestart },
            { S: this.timeend },
            { S: this.reason },
            { N: `${this.approved ? 1 : 0}` },
            { S: this.employeeID },
        ]
        try {
            await insertDB("Overtime", stringFormat, params)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to save");
        }
    }
}