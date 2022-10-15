import { insertDB, updateDB } from '../lib/database/query';
import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from './dbOperations';

export class overtime extends dbOperations {
    public readonly id: string
    public readonly dateHappen: string
    public readonly timeStart: string
    public readonly timeEnd: string
    public readonly reason: string
    public approved: boolean
    private readonly employeeID: string
    private readonly TABLE: string = "Overtime"

    constructor(id: string | undefined, dateHappen: string, timeStart: string, timeEnd: string, reason: string, approved: boolean, employeeID: string) {
        super()
        this.id = id === undefined ? uuidv4() : id
        this.dateHappen = dateHappen
        this.timeStart = timeStart
        this.timeEnd = timeEnd
        this.reason = reason
        this.approved = approved
        this.employeeID = employeeID

        this.assignData({
            id: this.id,
            dateHappen: this.dateHappen,
            timeStart: this.timeStart,
            timeEnd: this.timeEnd,
            reason: this.reason,
            approved: this.approved ? 1 : 0,
            employeeID: this.employeeID,
            TABLE: this.TABLE
        })
    }
}