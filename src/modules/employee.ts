import { leave } from "./leaves"
import { absences } from "./absences"
import { overtime } from "./overtime"
import { store } from "./store"
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid';
import { differenceInDays, differenceInHours, isSameMonth, parseISO } from "date-fns"
import { company } from "./company"
import { account } from "./account"

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
    private absences: absences[] = []
    private overtimes: overtime[] = []

    getSalaryPerHour = (): number => this.salaryperhour

    getEmploymentType = () => this.employmenttype

    getPosition = () => this.position

    getAssocCompany = (): company | any => _.find(store.getCompanies(), (comp) => comp.id === this.companyID)

    updateEmployee = (salaryperhour: number, employmenttype: "parttime" | "fulltime", position: string) => {
        this.salaryperhour = salaryperhour
        this.position = position
        this.employmenttype = employmenttype
    }

    requestLeave = (leaveRequest: object | any) => {

        const { datestart, dateend, reason, approved } = leaveRequest

        const newLeave = new leave(datestart, dateend, reason, approved)

        this.leaves.push(newLeave)
    }

    retrieveLeaves = () => {
        return this.leaves
    }


    //-----------------------COMPUTATION METHODS BELOW-----------------------------

    getDailyWage = (): number => {

        let dailyWorkHours = 4;

        if (this.employmenttype === 'fulltime') dailyWorkHours = 8;

        console.log(this.getSalaryPerHour());


        return this.getSalaryPerHour() * dailyWorkHours
    }

    getRemainingLeaves = (): number => {

        const getLeaves = this.getTotalLeaves()

        const assocCompany = this.getAssocCompany()

        return Math.max(getLeaves, assocCompany?.getAllotedLeaves)
    }

    getTotalLeaves = (): number => {
        const getLeaves = _.chain(this.leaves)
            .filter((leave) => isSameMonth(parseISO(leave.datestart), new Date()))
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
            .filter((ot) => isSameMonth(parseISO(ot.datehappen), new Date()))
            .reduce((total, ot) =>
                total += differenceInHours(parseISO(ot.timeend), parseISO(ot.timestart)) + 1,
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

        return monthSalary
    }


}