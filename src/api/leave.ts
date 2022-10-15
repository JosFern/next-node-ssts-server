import { IncomingMessage } from "http";
import { getJSONDataFromRequestStream, getPathParams } from "../util/generateParams";
import _ from 'lodash';
import { leave } from "../modules/leaves";
import { deleteDB, selectDB, updateDB } from "../lib/database/query";

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

                    const data: object | any = await getJSONDataFromRequestStream(req)

                    console.log(data);

                    const postModel = new leave(
                        undefined,
                        data.datestart,
                        data.dateend,
                        data.reason,
                        false,
                        getResult.id)

                    postModel.insertData()

                    response = { ...response, code: 201, message: "Leave request created" }

                    return response as returnMessage
                }

            case 'PUT':
                {
                    // FOR EMPLOYER TO APPROVE/DENY LEAVE REQUEST

                    const data: object | any = await getJSONDataFromRequestStream(req)

                    const getLeave: any = await selectDB('Leave', `id='${getResult.id}'`)

                    if (getLeave.length === 0) return { code: 404, message: "Leave not found" }

                    const model = new leave(
                        getResult.id,
                        getLeave[0].datestart,
                        getLeave[0].dateend,
                        getLeave[0].reason,
                        data.approved,
                        getLeave[0].employeeID
                    )

                    model.updateData()

                    response = { ...response, message: `Leave ${data.approved ? "Approved" : "Denied"}` }

                    return response as returnMessage
                }

            case 'GET':
                {
                    //FOR EMPLOYEE AND EMPLOYER RETRIEVING THE EMPLOYEE LEAVES

                    const employee: object | any = await selectDB('Employee', `employeeID='${getResult.id}'`)

                    if (employee.length === 0) return { code: 404, message: "Employee not found" }

                    const leaves = await selectDB('Leave', `employeeID='${getResult.id}'`)

                    response = { ...response, message: leaves }

                    return response as returnMessage
                }

            case 'DELETE':

                {
                    deleteDB("Leave", getResult.id, "id")

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