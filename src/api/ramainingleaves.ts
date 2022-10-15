import { IncomingMessage } from "http";
import { getPathParams } from "../util/generateParams";
import { selectDB } from "../lib/database/query";
import { employee } from "../modules/employee";

interface returnMessage {
    code: number
    message: string | any
}

export const remainingleave = async (req: IncomingMessage) => {

    try {
        let response: returnMessage = { code: 200, message: "Success" }

        const getResult = getPathParams(req.url as string, '/employee/remainingleave/:id')

        switch (req.method) {

            case 'GET':

                //FOR EMPLOYEE RETRIEVE REMAINING LEAVES

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

                const remainingLeaves = await model.getRemainingLeaves()

                response = { ...response, code: 200, message: { remainingLeaves } }

                return response as returnMessage

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }

}