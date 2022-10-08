import { IncomingMessage } from "http";
import { getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { companies } from "../../_sample-data/companies";
import { computeTotalOvertime } from "../modules/computations";
import { employees } from "../../_sample-data/employees";
import { overtimes } from "../../_sample-data/overtime";

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


export const totalOTRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/totalovertimes/:id')

    switch (req.method) {

        case 'GET':

            //FOR EMPLOYEE AND EMPLOYER RETRIEVING THE EMPLOYEE OVERTIMES

            const employee: employee | any = _.find(employees, { id: Number(getResult.id) })

            const assocCompany: any = _.find(companies, { id: employee.company })

            const totalOT = computeTotalOvertime(overtimes, Number(getResult.id), assocCompany.overtimelimit)

            console.log(totalOT);

            return { totalOT }



        default:
            break;
    }
}