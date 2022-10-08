import { leave } from "./leaves"
import { absences } from "./absences"
import { overtime } from "./overtime"
import { store } from "./store"
import _ from 'lodash'
import { differenceInDays, differenceInHours, isSameMonth, parseISO } from "date-fns"
import { company } from "./company"

export class employee {
    public readonly employeeID: number
    public readonly accountID: number
    public readonly employmentType: "partime" | "fulltime"
    public readonly companyID: number
    private salaryperhour: number

    constructor(
        employeeID: number,
        accountID: number,
        salaryperhour: number,
        employmentType: "partime" | "fulltime",
        companyID: number
    ) {
        this.employeeID = employeeID
        this.accountID = accountID
        this.salaryperhour = salaryperhour
        this.employmentType = employmentType
        this.companyID = companyID
    }

    leaves: leave[] = []
    absences: absences[] = []
    overtimes: overtime[] = []

    getSalaryPerHour = (): number => {
        return this.salaryperhour
    }

    getAssocCompany = (): company | any => _.find(store.companies, (comp) => comp.id === this.companyID)

    getDailyWage = (): number => {

        let dailyWorkHours = 4;

        if (this.employmentType === 'fulltime') dailyWorkHours = 8;

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