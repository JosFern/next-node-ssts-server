import { differenceInDays, differenceInHours, isSameMonth, parseISO } from "date-fns";
import _ from 'lodash'


export const computeDailyWage = (salaryPerHour: number, employmentType: string) => {

    let dailyWorkHours = 4;

    if (employmentType === 'fulltime') dailyWorkHours = 8;

    return salaryPerHour * dailyWorkHours
}

interface leave {
    id: number
    empID: number
    datestart: string
    dateend: string
    reason: string
    status: string
}

export const computeRemainingLeaves = (leaves: leave[], id: number, companyAllowedLeaves: number) => {

    const getLeaves = computeTotalLeaves(leaves, id)

    return Math.max(companyAllowedLeaves - getLeaves, 0)
}

export const computeTotalLeaves = (leaves: leave[], id: number) => {

    const getLeaves = _.chain(leaves)
        .filter({ empID: id })
        .filter((leave) => isSameMonth(parseISO(leave.datestart), new Date()))
        .reduce((total, leave) =>
            total += differenceInDays(parseISO(leave.dateend), parseISO(leave.datestart)) + 1,
            0)
        .value()


    return getLeaves
}

interface overtime {
    id: number
    empID: number
    datehappen: string
    timestart: string
    timeend: string
    reason: string
    status: string
}

export const computeTotalOvertime = (overtimes: overtime[], id: number, companyOTLimit: number) => {

    const getOvertimes = _.chain(overtimes)
        .filter({ empID: id })
        .filter((ot) => isSameMonth(parseISO(ot.datehappen), new Date()))
        .reduce((total, overtime) =>
            total += differenceInHours(parseISO(overtime.timeend), parseISO(overtime.timestart)),
            0)
        .value()

    console.log(getOvertimes, companyOTLimit);


    return Math.min(getOvertimes, companyOTLimit)
}

interface absence {
    id: number
    empID: number
    datestart: string
    dateend: string
}

export const computeTotalAbsences = (absences: absence[], id: number, companyAllowedLeaves: number, leaves: number) => {

    let getAbsences = _.chain(absences)
        .filter({ empID: id })
        .filter((ab) => isSameMonth(parseISO(ab.datestart), new Date()))
        .reduce((total, absence) =>
            total += differenceInDays(parseISO(absence.dateend), parseISO(absence.datestart)) + 1,
            0)
        .value()

    if (leaves - companyAllowedLeaves < 0) getAbsences + Math.abs(leaves - companyAllowedLeaves)

    return getAbsences
}

export const computeMonthlySalary = (emp: any, overtime: number, remainingleave: number, absences: number) => {
    const { salaryperhour, employmenttype } = emp

    const dailywage = computeDailyWage(salaryperhour, employmenttype)

    const monthlyWage = dailywage * 20;

    const bonusLeaveWages = remainingleave * dailywage;

    const deductFromAbsences = absences * dailywage

    const monthSalary = (monthlyWage + (overtime * (salaryperhour * .2)) + bonusLeaveWages) - deductFromAbsences

    return monthSalary


}