import { IncomingMessage } from "http";
import { getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { employees } from "../../_data_/employees";
import { store } from "../modules/store";
import { selectDB } from "../lib/database/query";
import { employee } from "../modules/employee";

export const dailywageRequest = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/dailywage/:id')

    switch (req.method) {

        case 'GET':

            //FOR EMPLOYEE RETRIEVE DAILY WAGE

            const getEmployee: any = await selectDB('Employee', `employeeID='${getResult.id}'`)

            const getAccount: any = await selectDB('Account', `accountID='${getEmployee[0].accountID}'`)

            const acc = getAccount[0]

            const model = new employee(
                getEmployee[0].accountID,
                acc.firstname,
                acc.lastname,
                acc.email,
                acc.password,
                acc.role,
                getEmployee[0].employeeID,
                getEmployee[0].salaryperhour,
                getEmployee[0].employmenttype,
                getEmployee[0].companyID,
                getEmployee[0].position,
            )

            const dailywage = model.getDailyWage()

            return { dailywage }

        default:
            break;
    }
}