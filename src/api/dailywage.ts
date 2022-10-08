import { IncomingMessage } from "http";
import { getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { computeDailyWage } from "../modules/computations";
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

export const dailywageRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/dailywage/:id')

    switch (req.method) {

        case 'GET':

            //FOR EMPLOYEE RETRIEVE DAILY WAGE

            const employee: employee | any = _.find(employees, { id: Number(getResult.id) })

            const dailywage = computeDailyWage(employee.salaryperhour, employee.employmenttype)

            console.log(employee);

            return { dailywage }

        default:
            break;
    }
}