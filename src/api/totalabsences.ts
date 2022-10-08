import { IncomingMessage } from "http";
import { getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { computeTotalAbsences, computeTotalLeaves } from "../modules/computations";
import { companies } from "../../_sample-data/companies";
import { employees } from "../../_sample-data/employees";
import { leaves } from "../../_sample-data/leave";
import { absences } from "../../_sample-data/absences";

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

export const totalAbsencesRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/totalabsences/:id')

    switch (req.method) {

        case 'GET':

            //FOR EMPLOYEE RETRIEVE TOTAL ABSENCES
            const getEmployee: employee | any = _.find(employees, { id: Number(getResult.id) })

            const assocCompany: any = _.find(companies, { id: getEmployee.company })

            const totalLeaves = computeTotalLeaves(leaves, Number(getResult.id))

            const totalAbsence = computeTotalAbsences(absences, Number(getResult.id), assocCompany.allotedleaves, totalLeaves)

            return { totalAbsence }

        default:
            break;
    }
}