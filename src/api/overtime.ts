import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import { overtime } from "../modules/overtime";
import { deleteDB, selectDB, updateDB } from "../lib/database/query";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { document } from "../lib/database/document";
import { validateToken } from "../util/generateToken";

interface returnMessage {
    code: number
    message: string | any
}

export const overtimeRequest = async (req: IncomingMessage) => {

    try {
        let response: returnMessage = { code: 200, message: "Success" }

        const getResult = getPathParams(req.url as string, '/employee/overtime/:id')

        switch (req.method) {

            case 'POST':
                {
                    // FOR EMPLOYEE REQUESTING AN OVERTIME

                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employee'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    const data: any = await getJSONDataFromRequestStream(req)

                    const newOT = new overtime(
                        undefined,
                        data.dateHappen,
                        data.timeStart,
                        data.timeEnd,
                        data.reason,
                        data.approved,
                        getResult.id
                    )

                    newOT.insertData()

                    response = { ...response, code: 201, message: "Overtime request created" }

                    return response as returnMessage
                }

            case 'PUT':
                {
                    // FOR EMPLOYER TO APPROVE/DENY OVERTIME REQUEST

                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employer'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    const data: object | any = await getJSONDataFromRequestStream(req)

                    const getOvertime: any = await selectDB('Overtime', `id='${getResult.id}'`)

                    if (getOvertime.length === 0) return { code: 404, message: "Overtime not found" }

                    const model = new overtime(
                        getResult.id,
                        getOvertime[0].dateHappen,
                        getOvertime[0].timeStart,
                        getOvertime[0].timeEnd,
                        getOvertime[0].reason,
                        data.approved,
                        getOvertime[0].employeeID
                    )

                    model.updateData()

                    response = { ...response, message: `Overtime ${data.approved ? "Approved" : "Denied"}` }

                    return response as returnMessage
                }

            case 'GET':
                {
                    //FOR EMPLOYEE AND EMPLOYER RETRIEVING THE EMPLOYEE OVERTIMES

                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employee', 'employer'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    const employee: object | any = await selectDB('Employee', `employeeID='${getResult.id}'`)

                    if (employee.length === 0) return { code: 404, message: "Employee not found" }

                    const overtimes = await selectDB('Overtime')

                    response = { ...response, message: overtimes }

                    return response as returnMessage
                }

            case 'DELETE':

                {
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employee', 'employer'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    const overtimeInfo: any = await selectDB("Overtime", `id='${getResult.id}'`)

                    if (overtimeInfo.length === 0) return { code: 404, message: "Overtime not found" }

                    const otModel = new overtime(
                        getResult.id,
                        overtimeInfo[0].dateHappen,
                        overtimeInfo[0].timeStart,
                        overtimeInfo[0].timeEnd,
                        overtimeInfo[0].reason,
                        overtimeInfo[0].approved,
                        overtimeInfo[0].employeeID,
                    )

                    await otModel.deleteData()

                    response = { ...response, message: "Overtime successfully deleted" }

                    return response as returnMessage
                }

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err)

    }
}