import { insertDB } from "../lib/database/query"

export class absence {
    datestart: string
    dateend: string
    employeeID: string

    constructor(datestart: string, dateend: string, employeeID: string) {
        this.datestart = datestart
        this.dateend = dateend
        this.employeeID = employeeID
    }

    insertAbsence = async () => {
        const stringFormat = "{ 'datestart': ?, 'dateend': ?, 'employeeID': ? }"
        const params = [
            { S: this.datestart },
            { S: this.dateend },
            { S: this.employeeID },
        ]
        try {
            await insertDB("Company", stringFormat, params)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to save");
        }
    }
}