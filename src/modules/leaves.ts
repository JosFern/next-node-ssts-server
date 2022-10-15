import { insertDB } from "../lib/database/query"
import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from "./dbOperations";

export class leave extends dbOperations {
    public readonly id: string
    public readonly datestart: string
    public readonly dateend: string
    public readonly reason: string
    public approved: boolean
    private readonly employeeID: string
    private readonly TABLE: string = "Leave"

    constructor(id: string | undefined, datestart: string, dateend: string, reason: string, approved: boolean, employeeID: string) {
        super()
        this.id = id === undefined ? uuidv4() : id
        this.datestart = datestart
        this.dateend = dateend
        this.reason = reason
        this.approved = approved
        this.employeeID = employeeID

        this.assignData({
            id: this.id,
            datestart: this.datestart,
            dateend: this.dateend,
            reason: this.reason,
            approved: this.approved ? 1 : 0,
            employeeID: this.employeeID,
            TABLE: this.TABLE
        })
    }
}