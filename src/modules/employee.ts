import { leave } from "./leaves"
import { absence } from "./absences"
import { overtime } from "./overtime"
import { store } from "./store"
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import { differenceInDays, differenceInHours, isSameMonth, parseISO } from "date-fns"
import { company } from "./company"
import { account } from "./account"
import { insertDB, updateDB } from "../lib/database/query"

export class employee extends account {
    public readonly employeeID: string
    public readonly companyID: string
    private employmenttype: "parttime" | "fulltime"
    private salaryperhour: number
    private position: string

    constructor(
        accountID: string | undefined,
        firstname: string,
        lastname: string,
        email: string,
        password: string,
        role: string,
        employeeID: string | undefined,
        salaryperhour: number,
        employmenttype: "parttime" | "fulltime",
        companyID: string,
        position: string
    ) {
        super(accountID, firstname, lastname, email, password, role)
        this.employeeID = employeeID === undefined ? uuidv4() : employeeID
        this.salaryperhour = salaryperhour
        this.employmenttype = employmenttype
        this.companyID = companyID
        this.position = position
    }

    private leaves: leave[] = []
    private absences: absence[] = []
    private overtimes: overtime[] = []

    getSalaryPerHour = (): number => this.salaryperhour

    getEmploymentType = () => this.employmenttype

    getPosition = () => this.position

    postLeave = (leave: leave) => this.leaves.push(leave)

    postAbsence = (absence: absence) => this.absences.push(absence)

    postOvertime = (ot: overtime) => this.overtimes.push(ot)

    getAssocCompany = (): company | any => _.find(store.getCompanies(), (comp) => comp.id === this.companyID)

    // updateEmployee = (salaryperhour: number, employmenttype: "parttime" | "fulltime", position: string) => {
    //     this.salaryperhour = salaryperhour
    //     this.position = position
    //     this.employmenttype = employmenttype
    // }

    insertEmployee = async () => {
        const employeeStringFormat = "{ 'employeeID': ?, 'accountID': ?, 'salaryperhour': ?, 'employmenttype': ?, 'companyID': ?, 'position': ? }"
        const employeeParams = [
            { S: this.employeeID },
            { S: this.accountID },
            { N: `${this.salaryperhour}` },
            { S: this.employmenttype },
            { S: this.companyID },
            { S: this.position },
        ]

        const accountStringFormat = "{ 'accountID': ?, 'email': ?, 'firstname': ?, 'lastname': ?, 'password': ?, 'role': ?}"
        const accountParams = [
            { S: this.accountID },
            { S: this.getEmail() },
            { S: this.getFirstName() },
            { S: this.getLastName() },
            { S: this.getPassword() },
            { S: this.role },
        ]

        try {
            await insertDB("Employee", employeeStringFormat, employeeParams)
            await insertDB("Account", accountStringFormat, accountParams)
        } catch (err) {
            console.error(err)
            throw new Error("Unable to save");
        }
    }

    updateEmployee = async () => {

        const stringFormat = ` salaryperhour='${this.salaryperhour}' , employmenttype='${this.employmenttype}' , position='${this.position}' `

        updateDB('Employee', stringFormat, this.employeeID, "employeeID", "accountID", this.accountID)
    }

    requestLeave = (leaveRequest: object | any) => {

        const { datestart, dateend, reason, approved } = leaveRequest

        const newLeave = new leave(datestart, dateend, reason, approved)

        this.leaves.push(newLeave)
    }

    requestOvertime = (otRequest: object | any) => {

        const { datehappen, timestart, timeend, reason, approved } = otRequest

        const newOT = new overtime(datehappen, timestart, timeend, reason, approved)

        this.overtimes.push(newOT)
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

    getRemainingLeaves = (): number => {

        const getLeaves = this.getTotalLeaves()

        const assocCompany = this.getAssocCompany()

        return Math.max(assocCompany?.getAllotedLeaves() - getLeaves, 0)
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

    getTotalAbsences = (): number => {

        let getAbsences = _.chain(this.absences)
            .filter((absence) => isSameMonth(parseISO(absence.datestart), new Date()))
            .reduce((total, absence) =>
                total += differenceInDays(parseISO(absence.dateend), parseISO(absence.datestart)) + 1,
                0)
            .value()

        const assocCompany = this.getAssocCompany()

        const leaves = this.getTotalLeaves()

        if (leaves - assocCompany.getAllotedLeaves()) getAbsences + Math.abs(leaves - assocCompany.getAllotedLeaves())

        return getAbsences
    }

    getTotalOvertime = (): number => {

        const getOvertimes = _.chain(this.overtimes)
            .filter((ot) => isSameMonth(parseISO(ot.datehappen), new Date()) && ot.approved)
            .reduce((total, ot) =>
                total += differenceInHours(parseISO(ot.timeend), parseISO(ot.timestart)),
                0)
            .value()

        const assocCompany = this.getAssocCompany()

        return Math.min(getOvertimes, assocCompany.getOvertimeLimit())
    }

    getMonthlySalary = (): number => {

        const dailywage = this.getDailyWage()

        const remainingleave = this.getRemainingLeaves()

        const absences = this.getTotalAbsences()

        const overtime = this.getTotalOvertime()

        const monthlyWage = dailywage * 20 //days in a working month

        const bonusLeaveWages = remainingleave * dailywage

        const deductFromAbsences = absences * dailywage

        const monthSalary = (monthlyWage + (overtime + (this.salaryperhour * .2)) + bonusLeaveWages) - deductFromAbsences

        return Math.round(monthSalary)
    }


}