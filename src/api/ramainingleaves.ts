import { IncomingMessage } from "http";
import { getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { leaves } from "../../_sample-data/leave";
import { computeRemainingLeaves } from "../modules/computations";
import { companies } from "../../_sample-data/companies";
import { employees } from "../../_sample-data/employees";

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

export const remainingleave = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/dailywage/:id')

    switch (req.method) {

        case 'GET':

            //FOR EMPLOYEE RETRIEVE REMAINING LEAVES
            const getEmployee: employee | any = _.find(employees, { id: Number(getResult.id) })

            const assocCompany: any = _.find(companies, { id: getEmployee.company })

            const remainingleaves = computeRemainingLeaves(leaves, Number(getResult.id), assocCompany.allotedleaves)

            return { remainingleaves }

        default:
            break;
    }
}