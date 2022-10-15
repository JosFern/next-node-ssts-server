import { leave } from "./leaves"
import { absence } from "./absences"
import { overtime } from "./overtime"
import { chain, map } from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import { differenceInDays, differenceInHours, isSameMonth, parseISO } from "date-fns"
import { selectDB } from "../lib/database/query"
import { dbOperations } from "./dbOperations"

export class employee extends dbOperations {
    public readonly employeeID: string
    public readonly accountID: string
    public readonly companyID: string
    private empType: "parttime" | "fulltime"
    private rate: number
    private pos: string
    private readonly TABLE: string = "Employee"

    constructor(
        employeeID: string | undefined,
        accountID: string,
        rate: number,
        empType: "parttime" | "fulltime",
        companyID: string,
        pos: string
    ) {
        super()
        this.employeeID = employeeID === undefined ? uuidv4() : employeeID
        this.accountID = accountID
        this.rate = rate
        this.empType = empType
        this.companyID = companyID
        this.pos = pos

        this.assignData({
            employeeID: this.employeeID,
            accountID: this.accountID,
            rate: this.rate,
            empType: this.empType,
            pos: this.pos,
            companyID: this.companyID,
            TABLE: this.TABLE
        })
    }

    private leaves: leave[] = []
    private overtimes: overtime[] = []
    private absences: absence[] = []

    getAssocCompany = async () => {
        // _.find(store.getCompanies(), (comp) => comp.id === this.companyID)

        const getCompany: any = await selectDB('Company', `id='${this.companyID}'`)

        return getCompany[0]
    }

    retrieveLeaves = async () => {

        const leaves: any = await selectDB('Leave', `employeeID='${this.employeeID}'`)

        this.leaves = map(leaves, lv => {
            return new leave(lv.id, lv.datestart, lv.dateend, lv.reason, lv.approved === 1 ? true : false, lv.employeeID)
        })
    }

    retrieveOvertimes = async () => {

        const overtimes: any = await selectDB('Overtime', `employeeID='${this.employeeID}'`)

        this.overtimes = map(overtimes, ot => {
            return new overtime(
                ot.id,
                ot.dateHappen,
                ot.timeStart,
                ot.timeEnd,
                ot.reason,
                ot.approved === 1 ? true : false,
                ot.employeeID
            )
        })
    }

    retrieveAbsences = async () => {

        const absences: any = await selectDB('Absence', `employeeID='${this.employeeID}'`)

        this.absences = map(absences, (ab) => {
            return new absence(ab.id, ab.dateStart, ab.dateEnd, ab.employeeID)
        })
    }


    //-----------------------COMPUTATION METHODS BELOW-----------------------------

    getDailyWage = (): number => {

        let dailyWorkHours = 4;

        if (this.empType === 'fulltime') dailyWorkHours = 8;

        return this.rate * dailyWorkHours
    }

    getRemainingLeaves = async () => {

        await this.retrieveLeaves()

        const getLeaves = this.getTotalLeaves()

        const assocCompany = await this.getAssocCompany()

        console.log(assocCompany);

        return Math.max(assocCompany.allocateLeaves - getLeaves, 0)
    }

    getTotalLeaves = (): number => {
        const getLeaves = chain(this.leaves)
            .filter((leave) => isSameMonth(parseISO(leave.datestart), new Date()) && leave.approved)
            .reduce((total, leave) =>
                total += differenceInDays(parseISO(leave.dateend), parseISO(leave.datestart)) + 1,
                0)
            .value()

        return getLeaves
    }

    getTotalAbsences = async () => {

        await this.retrieveAbsences()

        let getAbsences = chain(this.absences)
            .filter((absence) => isSameMonth(parseISO(absence.dateStart), new Date()))
            .reduce((total, absence) =>
                total += differenceInDays(parseISO(absence.dateEnd), parseISO(absence.dateStart)) + 1,
                0)
            .value()

        const assocCompany = await this.getAssocCompany()

        const leaves = this.getTotalLeaves()

        if (leaves - assocCompany.allocateLeaves) getAbsences + Math.abs(leaves - assocCompany.allocateLeaves)

        return getAbsences
    }

    getTotalOvertime = async () => {

        await this.retrieveOvertimes()

        const getOvertimes = chain(this.overtimes)
            .filter((ot) => isSameMonth(parseISO(ot.dateHappen), new Date()) && ot.approved)
            .reduce((total, ot) =>
                total += differenceInHours(parseISO(ot.timeEnd), parseISO(ot.timeStart)),
                0)
            .value()

        const assocCompany = await this.getAssocCompany()

        return Math.min(getOvertimes, assocCompany.allocateOvertime)
    }

    getMonthlySalary = async () => {

        const dailywage = this.getDailyWage()

        const remainingleave = await this.getRemainingLeaves()

        const absences = await this.getTotalAbsences()

        const overtime = await this.getTotalOvertime()

        const monthlyWage = dailywage * 20 //days in a working month

        const bonusLeaveWages = remainingleave * dailywage

        const deductFromAbsences = absences * dailywage

        const monthSalary = (monthlyWage + (overtime + (this.rate * .2)) + bonusLeaveWages) - deductFromAbsences

        console.log(dailywage, remainingleave, overtime, absences, monthlyWage, bonusLeaveWages, deductFromAbsences);

        return Math.round(monthSalary)
    }


}