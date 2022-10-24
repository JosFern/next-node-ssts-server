import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { leave } from "../modules/leaves";
import { deleteDB, selectDB, updateDB } from "../lib/database/query";
import { encryptToken, validateToken } from "../util/generateToken";

interface returnMessage {
    code: number
    message: string | any
}

export const leaveRequest = async (req: IncomingMessage) => {

    try {
        let response: returnMessage = { code: 200, message: "Success" }

        const getResult = getPathParams(req.url as string, '/employee/leave/:id')

        switch (req.method) {

            case 'POST':
                {
                    // FOR EMPLOYEE REQUESTING A LEAVE

                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employee'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    // VALIDATE ENCRYPTED LEAVE DATA //must be employee id
                    const data: object | any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    const { datestart, dateend, reason } = validateData

                    const postModel = new leave(undefined, datestart, dateend, reason, false, getResult.id)

                    //INSERTING NEW LEAVE REQUEST DATA
                    postModel.insertData()

                    response = { ...response, code: 201, message: "Leave request created" }

                    return response as returnMessage
                }

            case 'PUT':
                {
                    // FOR EMPLOYER TO APPROVE/DENY LEAVE REQUEST

                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employer'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    //VALIDATE ENCRYPTED LEAVE DATA
                    const data: object | any = await getJSONDataFromRequestStream(req)

                    const validateData = await validateToken(data)

                    const { approved } = validateData

                    //QUERY LEAVE IF EXIST //must be leave id
                    const getLeave: any = await selectDB('Leave', `id='${getResult.id}'`)

                    if (getLeave.length === 0) return { code: 404, message: "Leave not found" }

                    //UPDATING LEAVE
                    const model = new leave(
                        getResult.id,
                        getLeave[0].datestart,
                        getLeave[0].dateend,
                        getLeave[0].reason,
                        approved,
                        getLeave[0].employeeID
                    )

                    model.updateData()

                    response = { ...response, message: `Leave ${approved ? "Approved" : "Denied"}` }

                    return response as returnMessage
                }

            case 'GET':
                {
                    //FOR EMPLOYEE AND EMPLOYER RETRIEVING THE EMPLOYEE LEAVES

                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employee', 'employer'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    // QUERY EMPLOYEE //must be employee id
                    const employee: object | any = await selectDB('Employee', `employeeID='${getResult.id}'`)

                    if (employee.length === 0) return { code: 404, message: "Employee not found" }

                    // QUERY EMPLOYEE LEAVES
                    const leaves = await selectDB('Leave', `employeeID='${getResult.id}'`)

                    //ENCRYPT DATA
                    const jwt = await encryptToken(leaves)

                    response = { ...response, message: jwt }

                    return response as returnMessage
                }

            case 'DELETE':

                {
                    // VALIDATE USER TOKEN
                    const getToken = req.headers.authorization

                    const validateJwt = await validateToken(getToken, ['employee', 'employer'])

                    if (validateJwt === 401) return { code: 401, message: "user not allowed" }

                    if (validateJwt === 403) return { code: 403, message: "privileges not valid" }

                    //QUERY LEAVE IF EXIST //must be leave id
                    const leaveInfo: object | any = await selectDB('Leave', `id='${getResult.id}'`)

                    if (leaveInfo.length === 0) return { code: 404, message: "leave not found" }

                    //DELETING LEAVE
                    const leaveModel = new leave(
                        getResult.id,
                        leaveInfo[0].datestart,
                        leaveInfo[0].dateend,
                        leaveInfo[0].reason,
                        leaveInfo[0].approved,
                        leaveInfo[0].employeeID,
                    )

                    leaveModel.deleteData()

                    response = { ...response, message: "Leave successfully deleted" }

                    return response as returnMessage
                }

            default:
                break;
        }
    } catch (err) {
        console.log("error: " + err);

    }
}