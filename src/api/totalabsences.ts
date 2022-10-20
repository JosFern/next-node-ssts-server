import { IncomingMessage } from "http";
import { validateToken } from "../util/generateToken";
import { selectDB } from "../lib/database/query";
import { employee } from "../modules/employee";
import { getPathParams } from "../util/generateParams";

interface returnMessage {
    code: number
    message: string | any
}

export const totalAbsencesRequest = async (req: IncomingMessage) => {

    try {
        let response: returnMessage = { code: 200, message: "Success" }

        const getResult = getPathParams(req.url as string, '/employee/totalabsence/:id')

        switch (req.method) {

            case 'GET':

                //FOR EMPLOYEE RETRIEVE TOTAL ABSENCES

                const getToken = req.headers.authorization

                const validateJwt = await validateToken(getToken, ['employee', 'employer'])

                if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

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

                const totalAbsence = await model.getTotalAbsences()

                response = { ...response, code: 200, message: { totalAbsence } }

                return response as returnMessage

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }

}