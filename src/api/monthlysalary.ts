import { IncomingMessage } from "http";
import { getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { computeMonthlySalary, computeRemainingLeaves, computeTotalAbsences, computeTotalLeaves, computeTotalOvertime } from "../modules/computations";
import { companies } from "../../_data_/companies";
import { employees } from "../../_data_/employees";
import { leaves } from "../../_data_/leave";
import { absences } from "../../_data_/absences";
import { overtimes } from "../../_data_/overtime";

interface employee {
    id: number
    firstname: string
    lastname: string
    email: string
    salaryperhour: number
    employmenttype: string
    position: string
    company: number
}

export const monthlySalRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/totalabsences/:id')

    switch (req.method) {

        case 'GET':

            //FOR EMPLOYEE RETRIEVE MONTHLY SALARY
            // const getEmployee: employee | any = _.find(employees, { id: Number(getResult.id) })


            // const assocCompany: any = _.find(companies, { id: getEmployee.company })

            // const remainingleave = computeRemainingLeaves(leaves, Number(getResult.id), assocCompany.allotedleaves)

            // const overtime = computeTotalOvertime(overtimes, Number(getResult.id), assocCompany.overtimelimit)

            // const totalleave = computeTotalLeaves(leaves, Number(getResult.id))

            // const absence = computeTotalAbsences(absences, Number(getResult.id), assocCompany.allotedleaves, totalleave)

            // const monthlysalary = computeMonthlySalary(getEmployee, overtime, remainingleave, absence)


            // return { monthlysalary }
            return "monthly salary"

        default:
            break;
    }
}