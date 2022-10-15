import { IncomingMessage } from "http";
import { getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { selectDB } from "../lib/database/query";
import { employee } from "../modules/employee";

interface returnMessage {
    code: number
    message: string | any
}

export const dailywageRequest = async (req: IncomingMessage) => {

    try {
        let response: returnMessage = { code: 200, message: "Success" }

        const getResult = getPathParams(req.url as string, '/employee/dailywage/:id')

        switch (req.method) {

            case 'GET':

                //FOR EMPLOYEE RETRIEVE DAILY WAGE

                const getEmployee: any = await selectDB('Employee', `employeeID='${getResult.id}'`)

                if (getEmployee.length === 0) return { code: 404, message: "Employee not found" }

                const model = new employee(
                    getEmployee[0].employeeID,
                    getEmployee[0].accountID,
                    getEmployee[0].rate,
                    getEmployee[0].empType,
                    getEmployee[0].companyID,
                    getEmployee[0].pos,
                )

                const dailywage = model.getDailyWage()

                response = { ...response, code: 200, message: { dailywage } }

                return response as returnMessage

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }

}