import { IncomingMessage } from "http";
import { getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { selectDB } from "../lib/database/query";
import { employee } from "../modules/employee";
import { encryptToken, validateToken } from "../util/generateToken";

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

                // VALIDATE USER TOKEN
                const getToken = req.headers.authorization

                const validateJwt = await validateToken(getToken, ['employee', 'employer'])

                if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                // QUERY EMPLOYEE
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

                //GETTING EMPLOYEE DAILY WAGE
                const dailywage = model.getDailyWage()

                //ENCRYPT DATA
                const jwt = await encryptToken({ dailywage })

                response = { ...response, code: 200, message: jwt }

                return response as returnMessage

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }

}