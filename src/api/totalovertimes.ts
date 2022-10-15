import { IncomingMessage } from "http";
import { employee } from "../modules/employee";
import { selectDB } from "../lib/database/query";
import { getPathParams } from "../util/generateParams";

interface returnMessage {
    code: number
    message: string | any
}

export const totalOTRequest = async (req: IncomingMessage) => {

    try {
        let response: returnMessage = { code: 200, message: "Success" }

        const getResult = getPathParams(req.url as string, '/employee/totalovertime/:id')

        switch (req.method) {

            case 'GET':

                //FOR EMPLOYEE RETRIEVE TOTAL OVERTIME HOURS

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

                const totalOvertime = await model.getTotalOvertime()

                response = { ...response, code: 200, message: { totalOvertime } }

                return response as returnMessage

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }
}