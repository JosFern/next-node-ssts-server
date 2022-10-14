import { leave } from "./leaves"
import { absence } from "./absences"
import { overtime } from "./overtime"
import { store } from "./store"
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import { differenceInDays, differenceInHours, isSameMonth, parseISO } from "date-fns"
import { company } from "./company"
import { account } from "./account"
import { insertDB, selectDB, updateDB } from "../lib/database/query"
import { dbOperations } from "./dbOperations"

export class employee extends dbOperations {
    public readonly employeeID: string
    public readonly accountID: string
    public readonly companyID: string
    private employmenttype: "parttime" | "fulltime"
    private salaryperhour: number
    private position: string

    constructor(
        employeeID: string | undefined,
        accountID: string,
        salaryperhour: number,
        employmenttype: "parttime" | "fulltime",
        companyID: string,
        position: string
    ) {
        super()
        this.employeeID = employeeID === undefined ? uuidv4() : employeeID
        this.accountID = accountID
        this.salaryperhour = salaryperhour
        this.employmenttype = employmenttype
        this.companyID = companyID
        this.position = position
    }

    leaves: leave[] = []
    absences: absence[] = []
    overtimes: overtime[] = []

    getSalaryPerHour = (): number => this.salaryperhour

    getEmploymentType = () => this.employmenttype

    getPosition = () => this.position

    postLeave = (leave: leave) => this.leaves.push(leave)

    postAbsence = (absence: absence) => this.absences.push(absence)

    postOvertime = (ot: overtime) => this.overtimes.push(ot)

    getAssocCompany = async () => {
        // _.find(store.getCompanies(), (comp) => comp.id === this.companyID)

        const getCompany: any = await selectDB('Company', `id='${this.companyID}'`)

        return getCompany
    }

    // insertEmployee = async () => {
    //     const employeeStringFormat = "{ 'employeeID': ?, 'accountID': ?, 'salaryperhour': ?, 'employmenttype': ?, 'companyID': ?, 'position': ? }"
    //     const employeeParams = [
    //         { S: this.employeeID },
    //         { S: this.accountID },
    //         { N: `${this.salaryperhour}` },
    //         { S: this.employmenttype },
    //         { S: this.companyID },
    //         { S: this.position },
    //     ]

    //     const accountStringFormat = "{ 'accountID': ?, 'email': ?, 'firstname': ?, 'lastname': ?, 'password': ?, 'role': ?}"
    //     const accountParams = [
    //         { S: this.accountID },
    //         { S: this.getEmail() },
    //         { S: this.getFirstName() },
    //         { S: this.getLastName() },
    //         { S: this.getPassword() },
    //         { S: this.role },
    //     ]

    //     try {
    //         await insertDB("Employee", employeeStringFormat, employeeParams)
    //         await insertDB("Account", accountStringFormat, accountParams)
    //     } catch (err) {
    //         console.error(err)
    //         throw new Error("Unable to save");
    //     }
    // }

    updateEmployee = async () => {

        const stringFormat =
            ` salaryperhour=${this.salaryperhour}, employmenttype='${this.employmenttype}', companyID='${this.companyID}', position='${this.position}'  `

        updateDB('Employee', stringFormat, this.employeeID, "employeeID", "accountID", this.accountID)
    }

    retrieveLeaves = () => this.leaves

    retrieveOvertimes = () => this.overtimes

    retrieveAbsences = () => this.absences

    //-----------------------COMPUTATION METHODS BELOW-----------------------------

    getDailyWage = (): number => {

        let dailyWorkHours = 4;

        if (this.employmenttype === 'fulltime') dailyWorkHours = 8;

        return this.getSalaryPerHour() * dailyWorkHours
    }

    getRemainingLeaves = async () => {

        const getLeaves = this.getTotalLeaves()

        const assocCompany = await this.getAssocCompany()

        return Math.max(assocCompany.allocateLeaves - getLeaves, 0)
    }

    getTotalLeaves = (): number => {
        const getLeaves = _.chain(this.leaves)
            .filter((leave) => isSameMonth(parseISO(leave.datestart), new Date()) && leave.approved)
            .reduce((total, leave) =>
                total += differenceInDays(parseISO(leave.dateend), parseISO(leave.datestart)) + 1,
                0)
            .value()

        return getLeaves
    }

    getTotalAbsences = async () => {

        let getAbsences = _.chain(this.absences)
            .filter((absence) => isSameMonth(parseISO(absence.datestart), new Date()))
            .reduce((total, absence) =>
                total += differenceInDays(parseISO(absence.dateend), parseISO(absence.datestart)) + 1,
                0)
            .value()

        const assocCompany = await this.getAssocCompany()

        const leaves = this.getTotalLeaves()

        if (leaves - assocCompany.allocateLeaves) getAbsences + Math.abs(leaves - assocCompany.allocateLeaves)

        return getAbsences
    }

    getTotalOvertime = async () => {

        const getOvertimes = _.chain(this.overtimes)
            .filter((ot) => isSameMonth(parseISO(ot.datehappen), new Date()) && ot.approved)
            .reduce((total, ot) =>
                total += differenceInHours(parseISO(ot.timeend), parseISO(ot.timestart)),
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

        const monthSalary = (monthlyWage + (overtime + (this.salaryperhour * .2)) + bonusLeaveWages) - deductFromAbsences

        return Math.round(monthSalary)
    }


}