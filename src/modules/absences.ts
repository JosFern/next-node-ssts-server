import { insertDB } from "../lib/database/query"
import { v4 as uuidv4 } from 'uuid';
import { dbOperations } from "./dbOperations";

export class absence extends dbOperations {
    public readonly id: string
    public readonly dateStart: string
    public readonly dateEnd: string
    private readonly employeeID: string
    private readonly TABLE: string = "Absence"

    constructor(id: string | undefined, dateStart: string, dateEnd: string, employeeID: string) {
        super()
        this.id = id === undefined ? uuidv4() : id
        this.dateStart = dateStart
        this.dateEnd = dateEnd
        this.employeeID = employeeID

        this.assignData({
            id: this.id,
            dateStart: this.dateStart,
            dateEnd: this.dateEnd,
            employeeID: this.employeeID,
            TABLE: this.TABLE
        })
    }
}