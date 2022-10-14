import { IncomingMessage } from "http";
import { getPathParams } from "../util/generateParams";
import { map } from 'lodash';
import { selectDB } from "../lib/database/query";
import { employee } from "../modules/employee";
import { leave } from "../modules/leaves";

export const remainingleave = async (req: IncomingMessage) => {

    const getResult = getPathParams(req.url as string, '/employee/dailywage/:id')

    switch (req.method) {

        case 'GET':

            //FOR EMPLOYEE RETRIEVE REMAINING LEAVES

            const getEmployee: any = await selectDB('Employee', `employeeID='${getResult.id}'`)

            const getAccount: any = await selectDB('Account', `accountID='${getEmployee[0].accountID}'`)

            const leaves = selectDB('Leave', `employeeID='${getResult.id}'`)

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

            const empLeaves = map(leaves, (lv: any) => {
                return new leave(lv.id, lv.datestart, lv.dateend, lv.reason, lv.approved, lv.employeeID)
            })

            model.leaves = [...empLeaves]

            const remainingLeaves = model.getRemainingLeaves()

            return { remainingLeaves }

        default:
            break;
    }
}