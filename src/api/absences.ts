import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { absence } from "../modules/absences";
import { deleteDB, selectDB } from "../lib/database/query";
import { encryptToken, validateToken } from "../util/generateToken";

interface returnMessage {
    code: number
    message: string | any
}

export const absenceRequest = async (req: IncomingMessage) => {

    try {
        let response: returnMessage = { code: 200, message: "Success" }

        const getResult = getPathParams(req.url as string, '/employee/absence/:id')

        switch (req.method) {

            case 'POST':
                {
                    // FOR EMPLOYER SETTING AN ABSENCE TO EMPLOYEE

                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employer'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    //VALIDATE ENCRYPTED EMPLOYEE DATA
                    const data: any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    const { dateStart, dateEnd } = validateData

                    //INSERTING NEW EMPLOYEE ABSENCE DATA
                    const model = new absence(undefined, dateStart, dateEnd, getResult.id)

                    model.insertData()

                    response = { ...response, code: 201, message: "Employee Absence Set" }

                    return response as returnMessage
                }

            case 'GET':
                {
                    //FOR EMPLOYEE AND EMPLOYER RETRIEVING THE EMPLOYEE ABSENCES

                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employee', 'employer'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    // QUERY EMPLOYEE
                    const employee: object | any = await selectDB('Employee', `employeeID='${getResult.id}'`)

                    if (employee.length === 0) return { code: 404, message: "Employee not found" }

                    const absences = await selectDB('Absence', `employeeID='${getResult.id}'`)

                    //ENCRYPT DATA
                    const jwt = await encryptToken(absences)

                    response = { ...response, message: jwt }

                    return response as returnMessage
                }

            case 'DELETE':

                {
                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employer'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    //QUERY ABSENCE IF EXIST //must be absence id
                    const absentInfo: any = await selectDB("Absence", `id='${getResult.id}'`)

                    if (absentInfo.length === 0) return { code: 404, message: "Absence not found" }

                    //DELETING ABSENCE
                    const otModel = new absence(
                        getResult.id,
                        absentInfo[0].dateStart,
                        absentInfo[0].dateEnd,
                        absentInfo[0].employeeID,
                    )

                    await otModel.deleteData()

                    response = { ...response, message: "Absence successfully deleted" }

                    return response as returnMessage
                }

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err)

    }
}